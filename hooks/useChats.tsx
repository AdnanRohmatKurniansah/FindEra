import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { deleteMessageById, fetchChatHistory, fetchMessages, getOrCreateChatRoom, confirmFinishedWithClaim, markMessagesAsRead, sendImageMessage, sendTextMessage } from "@/service/chatRoomService"
import { createClientSupabase } from "@/lib/supabase/client"
import { useEffect, useRef } from "react"
import { extractStoragePath, removeFile, uploadFile } from "@/lib/supabase/storage"
import { generateRandomString } from "@/lib/utils"

const BUCKET = 'findera_bucket'
const FOLDER = 'chat-images'

const pendingMessages = new Map<string, { message: string; timestamp: number }>()

export const useChatRoom = ( myProfileId?: string | null, otherProfileId?: string | null, itemId?: string | null) => {
  return useQuery({
    queryKey: ['chat-room', myProfileId, otherProfileId, itemId],
    queryFn: async () => {
      if (!myProfileId || !otherProfileId || !itemId) {
        throw new Error('Id tidak lengkap')
      }
      return await getOrCreateChatRoom(myProfileId, otherProfileId, itemId)
    },
    enabled: !!myProfileId && !!otherProfileId && !!itemId,
    staleTime: Infinity,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    retry: (failureCount, error: any) => {
      if (error?.code === '23505') return false
      return failureCount < 1
    },
    retryDelay: 500
  })
}

export const useChatMessages = (roomId?: string | null, myProfileId?: string | null) => {
  const queryClient = useQueryClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const channelRef = useRef<any>(null)
  // eslint-disable-next-line react-hooks/purity
  const lastEventTimeRef = useRef<number>(Date.now())
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pollingIntervalRef = useRef<any>(null)

  const query = useQuery({
    queryKey: ['chat-messages', roomId],
    queryFn: () => (roomId ? fetchMessages(roomId) : []),
    enabled: !!roomId,
    refetchOnWindowFocus: true
  })

  useEffect(() => {
    if (!roomId || !myProfileId) return

    if (channelRef.current) {
      createClientSupabase().removeChannel(channelRef.current)
      channelRef.current = null
    }

    const supabase = createClientSupabase()
    
    channelRef.current = supabase
      .channel(`room-${roomId}-${Date.now()}`)
      .on(
        'postgres_changes',
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'private_messages', 
          filter: `room_id=eq.${roomId}` 
        },
        (payload) => {
          lastEventTimeRef.current = Date.now()
          
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          queryClient.setQueryData(['chat-messages', roomId], (old: any[] = []) => {
            if (old.find(m => m.id === payload.new.id)) {
              return old
            }
            
            let replacedTemp = false
            const newMessages = old.map(m => {
              if (m.tempId) {
                const isSameMessage = 
                  m.sender_id === payload.new.sender_id &&
                  m.room_id === payload.new.room_id &&
                  (
                    (m.message && m.message === payload.new.message) ||
                    (m.image_url && payload.new.image_url && m.message === payload.new.message)
                  ) &&
                  Math.abs(new Date(m.created_at).getTime() - new Date(payload.new.created_at).getTime()) < 10000
                
                if (isSameMessage) {
                  replacedTemp = true
                  if (m.tempId) {
                    pendingMessages.delete(m.tempId)
                  }
                  return payload.new
                }
              }
              return m
            })
            
            if (replacedTemp) {
              return newMessages
            }
            
            return [...old, payload.new]
          })

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          queryClient.setQueryData(['chat-history', myProfileId], (old: any[] = []) => {
            if (!old) return old
            return old.map(room =>
              room.id === payload.new.room_id
                ? { 
                    ...room, 
                    lastMessage: payload.new, 
                    unreadCount: payload.new.sender_id === myProfileId ? room.unreadCount : room.unreadCount + 1 
                  }
                : room
            )
          })

          if (payload.new.receiver_id === myProfileId && payload.new.sender_id !== myProfileId) {
            setTimeout(() => {
              markMessagesAsRead(roomId, myProfileId).catch(console.error)
            }, 500)
          }
        }
      )
      .on(
        'postgres_changes',
        { 
          event: 'UPDATE', 
          schema: 'public', 
          table: 'private_messages', 
          filter: `room_id=eq.${roomId}` 
        },
        (payload) => {
          lastEventTimeRef.current = Date.now()
          
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          queryClient.setQueryData(['chat-messages', roomId], (old: any[] = []) =>
            old.map(m => (m.id === payload.new.id ? payload.new : m))
          )

          if (payload.new.is_read && !payload.old.is_read) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            queryClient.setQueryData(['chat-history', myProfileId], (old: any[] = []) => {
              if (!old) return old
              return old.map(room => {
                if (room.id === payload.new.room_id) {
                  return { 
                    ...room, 
                    unreadCount: Math.max(0, room.unreadCount - 1) 
                  }
                }
                return room
              })
            })

            const senderId = payload.new.sender_id
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            queryClient.setQueryData(['chat-history', senderId], (old: any[] = []) => {
              if (!old) return old
              return old.map(room => {
                if (room.id === payload.new.room_id) {
                  return { 
                    ...room, 
                    unreadCount: Math.max(0, room.unreadCount - 1) 
                  }
                }
                return room
              })
            })
          }
        }
      )
      .on(
        'postgres_changes',
        { 
          event: 'DELETE', 
          schema: 'public', 
          table: 'private_messages', 
          filter: `room_id=eq.${roomId}` 
        },
        (payload) => {
          lastEventTimeRef.current = Date.now()
          
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          queryClient.setQueryData(['chat-messages', roomId], (old: any[] = []) =>
            old.filter(m => m.id !== payload.old.id)
          )
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          pollingIntervalRef.current = setInterval(() => {
            const timeSinceLastEvent = Date.now() - lastEventTimeRef.current
            if (timeSinceLastEvent > 5000) {
              queryClient.invalidateQueries({ queryKey: ['chat-messages', roomId] })
            }
          }, 3000)
        }
      })

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current)
        channelRef.current = null
      }
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current)
        pollingIntervalRef.current = null
      }
    }
  }, [roomId, myProfileId, queryClient])

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now()
      for (const [tempId, data] of pendingMessages.entries()) {
        if (now - data.timestamp > 30000) {
          pendingMessages.delete(tempId)
          
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          queryClient.setQueryData(['chat-messages', roomId], (old: any[] = []) =>
            old.filter(m => m.tempId !== tempId)
          )
        }
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [roomId, queryClient])

  return query
}

export const useSendMessage = (roomId?: string | null, myProfileId?: string | null, otherProfileId?: string | null) => {
  const queryClient = useQueryClient()

  const sendText = useMutation({
    mutationFn: async (message: string) => {
      if (!roomId || !myProfileId || !otherProfileId) throw new Error('Id tidak lengkap')
      const result = await sendTextMessage(roomId, myProfileId, otherProfileId, message)
      return result
    },
    onMutate: async (message) => {
      const tempId = `temp-${Date.now()}-${Math.random().toString(36).substring(7)}`
      const timestamp = Date.now()
      
      pendingMessages.set(tempId, { message, timestamp })
      
      const optimisticMessage = {
        tempId,
        id: null,
        room_id: roomId,
        sender_id: myProfileId,
        receiver_id: otherProfileId,
        message,
        image_url: null,
        is_read: false,
        created_at: new Date().toISOString()
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      queryClient.setQueryData(['chat-messages', roomId], (old: any[] = []) => [...old, optimisticMessage])

      return { tempId }
    },
    onSuccess: (data, message, context) => {
      if (context?.tempId) {
        pendingMessages.delete(context.tempId)
      }
      
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ['chat-messages', roomId] })
      }, 1000)
      
      setTimeout(() => {
        if (context?.tempId) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          queryClient.setQueryData(['chat-messages', roomId], (old: any[] = []) => {
            const stillHasTemp = old.some(m => m.tempId === context.tempId)
            if (stillHasTemp) {
              return old.filter(m => m.tempId !== context.tempId)
            }
            return old
          })
        }
      }, 2000)
    },
    onError: (error, message, context) => {
      if (context?.tempId) {
        pendingMessages.delete(context.tempId)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        queryClient.setQueryData(['chat-messages', roomId], (old: any[] = []) =>
          old.filter(m => m.tempId !== context.tempId)
        )
      }
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
      const result = await sendImageMessage(roomId, myProfileId, otherProfileId, image_url, message)
      return { result, image_url }
    },
    onMutate: async ({ file, message }) => {
      const tempId = `temp-${Date.now()}-${Math.random().toString(36).substring(7)}`
      const timestamp = Date.now()
      const tempImageUrl = URL.createObjectURL(file)
      
      pendingMessages.set(tempId, { message, timestamp })
      
      const optimisticMessage = {
        tempId,
        id: null,
        room_id: roomId,
        sender_id: myProfileId,
        receiver_id: otherProfileId,
        message,
        image_url: tempImageUrl,
        is_read: false,
        created_at: new Date().toISOString(),
        isUploading: true
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      queryClient.setQueryData(['chat-messages', roomId], (old: any[] = []) => [...old, optimisticMessage])

      return { tempId, tempImageUrl }
    },
    onSuccess: (data, variables, context) => {
      if (context?.tempId) {
        pendingMessages.delete(context.tempId)
      }
      if (context?.tempImageUrl) {
        URL.revokeObjectURL(context.tempImageUrl)
      }
      
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ['chat-messages', roomId] })
      }, 1000)
      
      setTimeout(() => {
        if (context?.tempId) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          queryClient.setQueryData(['chat-messages', roomId], (old: any[] = []) => {
            const stillHasTemp = old.some(m => m.tempId === context.tempId)
            if (stillHasTemp) {
              return old.filter(m => m.tempId !== context.tempId)
            }
            return old
          })
        }
      }, 2000)
    },
    onError: (error, variables, context) => {
      if (context?.tempId) {
        pendingMessages.delete(context.tempId)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        queryClient.setQueryData(['chat-messages', roomId], (old: any[] = []) =>
          old.filter(m => m.tempId !== context.tempId)
        )
      }
      if (context?.tempImageUrl) {
        URL.revokeObjectURL(context.tempImageUrl)
      }
    }
  })

  const deleteMessage = useMutation({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mutationFn: async (msg: any) => {
      if (msg.image_url && !msg.image_url.startsWith('blob:')) {
        const path = extractStoragePath(msg.image_url, BUCKET)
        if (path) await removeFile(BUCKET, [path])
      }
      const result = await deleteMessageById(msg.id)
      return result
    }
  })

  return { sendText, sendImage, deleteMessage }
}

export const useChatHistory = (myProfileId?: string | null) => {
  const queryClient = useQueryClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const channelRef = useRef<any>(null)

  const query = useQuery({
    queryKey: ['chat-history', myProfileId],
    queryFn: () => {
      if (!myProfileId) return []
      return fetchChatHistory(myProfileId)
    },
    enabled: !!myProfileId,
    staleTime: 5000,
    refetchOnWindowFocus: true
  })

  useEffect(() => {
    if (!myProfileId) return

    if (channelRef.current) {
      createClientSupabase().removeChannel(channelRef.current)
      channelRef.current = null
    }

    const supabase = createClientSupabase()
    
    channelRef.current = supabase
      .channel(`chat-history-${myProfileId}-${Date.now()}`)
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'private_messages',
          filter: `sender_id=eq.${myProfileId}`
        },
        () => {
          setTimeout(() => {
            queryClient.invalidateQueries({ queryKey: ['chat-history', myProfileId] })
          }, 500)
        }
      )
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'private_messages',
          filter: `receiver_id=eq.${myProfileId}`
        },
        () => {
          setTimeout(() => {
            queryClient.invalidateQueries({ queryKey: ['chat-history', myProfileId] })
          }, 500)
        }
      )
      .subscribe()

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current)
        channelRef.current = null
      }
    }
  }, [myProfileId, queryClient])

  return query
}

export const useMarkAsRead = (roomId?: string | null, myProfileId?: string | null) => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async () => {
      if (!roomId || !myProfileId) throw new Error('Id tidak lengkap')
      const result = await markMessagesAsRead(roomId, myProfileId)
      return result
    },
    onSuccess: () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      queryClient.setQueryData(['chat-messages', roomId], (old: any[] = []) => {
        if (!old) return old
        return old.map(m => {
          if (m.receiver_id === myProfileId && !m.is_read) {
            return { ...m, is_read: true }
          }
          return m
        })
      })

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      queryClient.setQueryData(['chat-history', myProfileId], (old: any[] = []) => {
        if (!old) return old
        return old.map(room => {
          if (room.id === roomId) {
            return { ...room, unreadCount: 0 }
          }
          return room
        })
      })
    }
  })
}

export const useFinishedWithClaim = () => {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async ({ itemId, otherProfileId }: {itemId: string, otherProfileId: string }) => {
      if (!itemId || !otherProfileId) throw new Error("Parameter tidak lengkap")
      return await confirmFinishedWithClaim(itemId, otherProfileId)
    },
    onSuccess: () => {
      qc.invalidateQueries()
    },
  })
}
