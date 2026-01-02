import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { deleteMessageById, fetchChatHistory, fetchMessages, getOrCreateChatRoom, sendImageMessage, sendTextMessage } from "@/service/chatRoomService"
import { createClientSupabase } from "@/lib/supabase/client"
import { useEffect } from "react"
import { extractStoragePath, removeFile, uploadFile } from "@/lib/supabase/storage"
import { generateRandomString } from "@/lib/utils"

const BUCKET = 'findera_bucket'
const FOLDER = 'chat-images'

export const useChatRoom = (myProfileId?: string | null, otherProfileId?: string | null, itemId?: string | null) => {
  return useQuery({
    queryKey: ['chat-room', myProfileId, otherProfileId, itemId],
    queryFn: () => {
      if (!myProfileId || !otherProfileId || !itemId) throw new Error('Id tidak lengkap')
      return getOrCreateChatRoom(myProfileId, otherProfileId, itemId)
    },
    enabled: !!myProfileId && !!otherProfileId && !!itemId,
    staleTime: Infinity
  })
}

export const useChatMessages = (roomId?: string | null) => {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: ['chat-messages', roomId],
    queryFn: () => {
      if (!roomId) return []
      return fetchMessages(roomId)
    },
    enabled: !!roomId
  })

  useEffect(() => {
    if (!roomId) return

    const channel = createClientSupabase()
      .channel(`room-${roomId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'private_messages', filter: `room_id=eq.${roomId}` },
        payload => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          queryClient.setQueryData(['chat-messages', roomId], (old: any[] = []) => [...old, payload.new])
        }
      )
      .on(
        'postgres_changes',
        { event: 'DELETE', schema: 'public', table: 'private_messages', filter: `room_id=eq.${roomId}` },
        payload => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          queryClient.setQueryData(['chat-messages', roomId], (old: any[] = []) =>
            old.filter(m => m.id !== payload.old.id)
          )
        }
      )
      .subscribe()

    return () => {
      createClientSupabase().removeChannel(channel)
    }
  }, [roomId, queryClient])

  return query
}

export const useSendMessage = (roomId?: string | null, myProfileId?: string | null, otherProfileId?: string | null) => {
  const queryClient = useQueryClient()

  const sendText = useMutation({
    mutationFn: (message: string) => {
      if (!roomId || !myProfileId || !otherProfileId) throw new Error('Id tidak lengkap')
      return sendTextMessage(roomId, myProfileId, otherProfileId, message)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chat-messages', roomId] })
    }
  })

  const sendImage = useMutation({
    mutationFn: async ({ file, message }: { file: File; message: string }) => {
      if (!roomId || !myProfileId || !otherProfileId) throw new Error('Id tidak lengkap')

      if (!file) throw new Error("File tidak ditemukan")

      const fileExt = file.name.split('.').pop()
      const randomName = generateRandomString(16)
      const fileName = `${randomName}-${Date.now()}.${fileExt}`
      const filePath = `${FOLDER}/${fileName}`

      const image_url = await uploadFile(BUCKET, filePath, file)

      return sendImageMessage(roomId, myProfileId, otherProfileId, image_url, message)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chat-messages', roomId] })
    }
  })

  const deleteMessage = useMutation({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mutationFn: async (msg: any) => {
      if (msg.image_url) {
        const path = extractStoragePath(msg.image_url, BUCKET)
        if (path) await removeFile(BUCKET, [path])
      }
      return deleteMessageById(msg.id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chat-messages', roomId] })
    }
  })

  return { sendText, sendImage, deleteMessage }
}

export const useChatHistory = (myProfileId?: string | null) => {
  return useQuery({
    queryKey: ['chat-history', myProfileId],
    queryFn: () => {
      if (!myProfileId) return []
      return fetchChatHistory(myProfileId)
    },
    enabled: !!myProfileId,
    refetchInterval: 5000 
  })
}