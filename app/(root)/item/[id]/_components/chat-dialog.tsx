'use client'

import { useRef, useState, ReactNode, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Send, ImageIcon, Trash2 } from 'lucide-react'
import { formatTime } from '@/lib/utils'
import Image from 'next/image'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { chatMessage, itemUser } from '@/types'
import {
  useChatRoom,
  useChatMessages,
  useSendMessage,
  useMarkAsRead
} from '@/hooks/useChats' 

type ChatDialogProps = {
  myProfileId: string | null
  otherProfile: itemUser
  itemId: string
  itemStatus: string
  defaultMessage?: string
  children?: ReactNode
}

export const ChatDialog = ({
  myProfileId,
  otherProfile,
  itemId,
  itemStatus,
  defaultMessage,
  children
}: ChatDialogProps) => {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState(defaultMessage ?? '')

  const fileRef = useRef<HTMLInputElement>(null)

  const requireLogin = () => {
    if (!myProfileId) {
      toast.error('Silakan login terlebih dahulu')
      router.push('/sign-in')
      return false
    }
    return true
  }

  const { data: roomId } = useChatRoom(myProfileId, otherProfile.id, itemId)
  const { data: messages = [] } = useChatMessages(open ? roomId : null, myProfileId)
  const { sendText, sendImage, deleteMessage } = useSendMessage(roomId, myProfileId, otherProfile.id)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const markAsRead = useMarkAsRead(roomId, myProfileId)

  useEffect(() => {
    if (!open) return
    if (!roomId || !myProfileId) return

    markAsRead.mutate()
  }, [open, roomId])

  const handleOpen = () => {
    if (!requireLogin()) return
    setOpen(true)
  }

  const handleSend = () => {
    if (!input.trim() && !selectedImage) return

    if (selectedImage) {
      sendImage.mutate(
        { file: selectedImage, message: input.trim() },
        {
          onSuccess: () => {
            setInput('')
            setSelectedImage(null)
          }
        }
      )
    } else {
      sendText.mutate(input.trim())
      setInput('')
    }
  }

  return (
    <>
      {children && <div onClick={handleOpen}>{children}</div>}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="rounded-[10px] overflow-hidden sm:max-w-[425px] p-0 min-h-[70vh] max-h-[90vh] flex flex-col">
          <DialogHeader className="p-4 border-b bg-white">
            <DialogTitle>
              <div className="flex items-center gap-4">
                <Image
                  src={otherProfile.image || '/images/avatar.png'}
                  width={35}
                  height={35}
                  alt=""
                  className="rounded-full"
                />
                <div>
                  <div className="text-[14px] font-semibold">{otherProfile.name}</div>
                  <div className="text-sm text-start font-normal text-gray-500">
                    {itemStatus === 'hilang' ? 'Pencari' : 'Penemu'}
                  </div>
                </div>
              </div>
            </DialogTitle>
          </DialogHeader>

          <div className="flex-1 p-4 overflow-y-auto" >
            <div  className="space-y-3">
              {messages.map((m: chatMessage) => (
                <div key={m.id} className={`flex ${m.sender_id === myProfileId ? 'justify-end' : 'justify-start'}`}>
                  <div className="relative group max-w-[70%] mt-1 mr-1">
                    <div
                      className={`rounded-xl px-3 py-2 text-sm ${
                        m.sender_id === myProfileId ? 'bg-primary text-white' : 'bg-gray-100'
                      }`}>
                      {m.image_url && (
                        <Image src={m.image_url} alt="" width={200} height={200} className="rounded mb-1" />
                      )}
                      {m.message}
                      <div className="text-[10px] opacity-70 mt-1 text-right">
                        {formatTime(new Date(m.created_at))}
                      </div>
                    </div>

                    {m.sender_id === myProfileId && (
                      <button
                        onClick={() => deleteMessage.mutate(m)}
                        className="absolute -top-2 -right-2 hidden group-hover:flex bg-white border rounded-full p-1 shadow"
                      >
                        <Trash2 className="w-3 h-3 text-red-500" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {selectedImage && (
            <div className="p-2">
              <div className="relative w-fit">
                <Image
                  src={URL.createObjectURL(selectedImage)}
                  alt=""
                  width={60}
                  height={60}
                  className="rounded"
                />
                <button
                  onClick={() => setSelectedImage(null)}
                  className="absolute -top-2 -right-2 bg-white rounded-full shadow p-1 text-xs"
                >
                  ✕
                </button>
              </div>
            </div>
          )}

          <div className="p-3 border-t bg-gray-50 shadow-md flex gap-2">
            <button onClick={() => fileRef.current?.click()}>
              <ImageIcon className="w-5 h-5" />
            </button>
            <input
              type="file"
              hidden
              ref={fileRef}
              accept="image/*"
              onChange={e => {
                const file = e.target.files?.[0]
                if (file) setSelectedImage(file)
              }}
            />

            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              className="flex-1 border rounded-full px-4 py-2 text-sm"
              placeholder="Ketik pesan..."
            />

            <Button size="icon" onClick={handleSend}>
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
