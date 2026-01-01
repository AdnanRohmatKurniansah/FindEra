'use client'

import { useEffect, useRef, useState, ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Send, ImageIcon, Trash2 } from 'lucide-react'
import { formatTime } from '@/lib/utils'
import { createClientSupabase } from '@/lib/supabase/client'
import Image from 'next/image'
import { uploadFile, extractStoragePath, removeFile } from '@/lib/supabase/storage'
import { getOrCreateChatRoom } from '@/service/chatRoomService'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

type ChatMessage = {
  id: string
  sender_id: string
  receiver_id: string
  message: string | null
  image_url: string | null
  created_at: string
}

type ChatDialogProps = {
  myProfileId: string | null
  otherProfileId: string
  reporterName?: string
  defaultMessage?: string
  children?: ReactNode
}

export const ChatDialog = ({
  myProfileId,
  otherProfileId,
  reporterName = 'User',
  defaultMessage,
  children
}: ChatDialogProps) => {
  const supabase = createClientSupabase()
  const router = useRouter()

  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState(defaultMessage ?? '')
  const [isLoading, setIsLoading] = useState(false)
  const [currentRoomId, setCurrentRoomId] = useState<string | null>(null)

  const fileRef = useRef<HTMLInputElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  const requireLogin = () => {
    if (!myProfileId) {
      toast.error('Silakan login terlebih dahulu')
      router.push('/sign-in')
      return false
    }
    return true
  }

  useEffect(() => {
    if (!open || !currentRoomId) return

    supabase
      .from('private_messages')
      .select('*')
      .eq('room_id', currentRoomId)
      .order('created_at', { ascending: true })
      .then(({ data }) => data && setMessages(data))
  }, [open, currentRoomId])

  useEffect(() => {
    if (!open || !currentRoomId) return

    const channel = supabase
      .channel(`room-${currentRoomId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'private_messages', filter: `room_id=eq.${currentRoomId}` },
        payload => setMessages(prev => [...prev, payload.new as ChatMessage])
      )
      .on(
        'postgres_changes',
        { event: 'DELETE', schema: 'public', table: 'private_messages', filter: `room_id=eq.${currentRoomId}` },
        payload => setMessages(prev => prev.filter(m => m.id !== payload.old.id))
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [open, currentRoomId])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight })
  }, [messages])

  const openDialog = () => {
    if (!requireLogin()) return
    setOpen(true)
  }

  const ensureRoom = async () => {
    if (!currentRoomId) {
      const room = await getOrCreateChatRoom(myProfileId!, otherProfileId)
      setCurrentRoomId(room)
      return room
    }
    return currentRoomId
  }

  const sendMessage = async () => {
    if (!input.trim()) return
    const room = await ensureRoom()
    await supabase.from('private_messages').insert({
      room_id: room,
      sender_id: myProfileId,
      receiver_id: otherProfileId,
      message: input.trim(),
      image_url: null
    })
    setInput('')
  }

  const sendImage = async (file: File) => {
    const room = await ensureRoom()
    const path = `${room}/${Date.now()}-${file.name}`
    const url = await uploadFile('chat-images', path, file)

    await supabase.from('private_messages').insert({
      room_id: room,
      sender_id: myProfileId,
      receiver_id: otherProfileId,
      image_url: url,
      message: null
    })
  }

  const deleteMessage = async (msg: ChatMessage) => {
    if (msg.sender_id !== myProfileId) return

    if (msg.image_url) {
      const path = extractStoragePath(msg.image_url, 'chat-images')
      if (path) await removeFile('chat-images', [path])
    }

    await supabase.from('private_messages').delete().eq('id', msg.id)
  }

  return (
    <>
      {children && <div onClick={openDialog}>{children}</div>}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl w-full p-0 max-h-[90vh] flex flex-col">
          <DialogHeader className="p-4 border-b">
            <DialogTitle>{reporterName}</DialogTitle>
          </DialogHeader>

          <ScrollArea className="flex-1 p-4" ref={scrollRef}>
            <div className="space-y-3">
              {messages.map(m => (
                <div key={m.id} className={`flex ${m.sender_id === myProfileId ? 'justify-end' : 'justify-start'}`}>
                  <div className="relative group max-w-[70%]">
                    <div className={`rounded-xl px-3 py-2 text-sm ${m.sender_id === myProfileId ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}>
                      {m.image_url && <Image src={m.image_url} alt="" width={200} height={200} className="rounded mb-1" />}
                      {m.message}
                      <div className="text-[10px] opacity-70 mt-1 text-right">{formatTime(new Date(m.created_at))}</div>
                    </div>

                    {m.sender_id === myProfileId && (
                      <button
                        onClick={() => deleteMessage(m)}
                        className="absolute -top-2 -right-2 hidden group-hover:flex bg-white border rounded-full p-1 shadow"
                      >
                        <Trash2 className="w-3 h-3 text-red-500" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          <div className="p-3 border-t bg-gray-50 flex gap-2">
            <button onClick={() => fileRef.current?.click()}><ImageIcon className="w-5 h-5" /></button>
            <input type="file" hidden ref={fileRef} accept="image/*" onChange={e => e.target.files && sendImage(e.target.files[0])} />

            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
              className="flex-1 border rounded-full px-4 py-2 text-sm"
              placeholder="Ketik pesan..."
            />

            <Button size="icon" onClick={sendMessage}><Send className="w-4 h-4" /></Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
