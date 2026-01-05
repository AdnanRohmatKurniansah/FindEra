'use client'

import { useRef, useState, ReactNode, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Send, ImageIcon, Trash2, Loader2 } from 'lucide-react'
import { formatTime } from '@/lib/utils'
import Image from 'next/image'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { chatMessage, itemUser } from '@/types'
import {
  useChatRoom,
  useChatMessages,
  useSendMessage,
  useMarkAsRead,
  useFinishedWithClaim
} from '@/hooks/useChats'
import FinishWithClaim from '@/app/(root)/akun/_components/finish-with-claim'

type ChatDialogProps = {
  myProfileId: string | null
  otherProfile: itemUser
  itemId: string
  itemUserId: string
  itemStatus: string
  defaultMessage?: string
  children?: ReactNode
}

export const ChatDialog = ({
  myProfileId,
  otherProfile,
  itemId,
  itemUserId,
  itemStatus,
  defaultMessage,
  children
}: ChatDialogProps) => {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState(defaultMessage ?? '')
  const [selectedImage, setSelectedImage] = useState<File | null>(null)

  const fileRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

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
  const markAsRead = useMarkAsRead(roomId, myProfileId)

  const [confirmOpen, setConfirmOpen] = useState(false)
  const finishClaimMutation = useFinishedWithClaim()
  
  const canMarkAsOwner =
    myProfileId == itemUserId &&
    (itemStatus == 'ditemukan' || itemStatus == 'hilang')

  const otherProfileId = otherProfile?.id

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (!open || !roomId || !myProfileId) return

    const hasUnreadMessages = messages.some(
      (m: chatMessage) => !m.is_read && m.receiver_id === myProfileId && m.sender_id !== myProfileId
    )

    if (hasUnreadMessages) {
      const timer = setTimeout(() => {
        markAsRead.mutate()
      }, 1000)

      return () => clearTimeout(timer)
    }
  }, [open, roomId, myProfileId, messages, markAsRead])

  const handleOpen = () => {
    if (!requireLogin()) return
    setOpen(true)
  }

  const handleSend = async () => {
    if (!input.trim() && !selectedImage) return
    if (sendText.isPending || sendImage.isPending) return

    const messageToSend = input.trim()
    const imageToSend = selectedImage

    setInput('')
    setSelectedImage(null)

    try {
      if (imageToSend) {
        await sendImage.mutateAsync({ file: imageToSend, message: messageToSend })
      } else {
        await sendText.mutateAsync(messageToSend)
      }
    } catch (error) {
      toast.error('Gagal mengirim pesan')
      setInput(messageToSend)
      if (imageToSend) setSelectedImage(imageToSend)
    }
  }

  const handleDeleteMessage = (msg: chatMessage) => {
    if (deleteMessage.isPending) return
    
    deleteMessage.mutate(msg, {
      onError: () => {
        toast.error('Gagal menghapus pesan')
      }
    })
  }

  const isSending = sendText.isPending || sendImage.isPending

  return (
    <>
      {children && <div onClick={handleOpen}>{children}</div>}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="rounded-[10px] overflow-hidden sm:max-w-[425px] p-0 min-h-[70vh] max-h-[90vh] flex flex-col">
          <DialogHeader className="p-4 border-b bg-white">
            <DialogTitle>
              <div className="flex justify-between">
                <div className="flex items-center gap-4">
                  <Image
                    src={otherProfile.image || '/images/avatar.png'}
                    width={35}
                    height={35}
                    alt={otherProfile.name || 'Avatar'}
                    className="rounded-full"
                  />
                  <div>
                    <div className="text-[14px] font-semibold">{otherProfile.name}</div>
                    <div className="text-sm text-start font-normal text-gray-500">
                      User
                    </div>
                  </div>
                </div>
                {canMarkAsOwner && (
                  <div className="mark-as-owner mr-7">
                    <Button className="text-xs" size="sm"
                      onClick={() => setConfirmOpen(true)}>
                      Konfirmasi Selesai
                    </Button>
                  </div>
                )}
              </div>
            </DialogTitle>
          </DialogHeader>

          <div className="flex-1 p-4 overflow-y-auto">
            <div className="space-y-3">
              {messages.map((m) => (
                <div key={m.id || m.tempId} className={`flex ${m.sender_id === myProfileId ? 'justify-end' : 'justify-start'}`}>
                  <div className="relative group max-w-[70%] mt-1 mr-1">
                    <div
                      className={`rounded-xl px-3 py-2 text-sm ${
                        m.sender_id === myProfileId ? 'bg-primary text-white' : 'bg-gray-100'
                      } ${m.tempId ? 'opacity-70' : 'opacity-100'}`}>
                      {m.image_url && (
                        <div className="relative">
                          <Image 
                            src={m.image_url} 
                            alt="" 
                            width={200} 
                            height={200} 
                            className={`rounded mb-1 ${m.isUploading ? 'opacity-50' : ''}`} 
                          />
                          {m.isUploading && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <Loader2 className="w-6 h-6 text-white animate-spin" />
                            </div>
                          )}
                        </div>
                      )}
                      {m.message && <div>{m.message}</div>}
                      <div className="flex items-center gap-2 text-[10px] opacity-70 mt-1 text-right">
                        {m.tempId && (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        )}
                        <span>{formatTime(new Date(m.created_at))}</span>
                      </div>
                    </div>

                    {m.sender_id === myProfileId && !m.tempId && (
                      <button
                        onClick={() => handleDeleteMessage(m)}
                        disabled={deleteMessage.isPending}
                        className="absolute -top-2 -right-2 hidden group-hover:flex bg-white border rounded-full p-1 shadow disabled:opacity-50 hover:bg-red-50 transition"
                      >
                        <Trash2 className="w-3 h-3 text-red-500" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {selectedImage && (
            <div className="p-2 border-t bg-gray-50">
              <div className="relative w-fit">
                <Image
                  src={URL.createObjectURL(selectedImage)}
                  alt="Preview"
                  width={80}
                  height={80}
                  className="rounded object-cover"
                />
                <button
                  onClick={() => setSelectedImage(null)}
                  disabled={isSending}
                  className="absolute -top-2 -right-2 bg-white rounded-full shadow p-1 text-xs hover:bg-gray-100 transition disabled:opacity-50"
                >
                  ✕
                </button>
              </div>
            </div>
          )}

          <div className="p-3 border-t bg-gray-50 shadow-md flex gap-2 items-center">
            <button 
              onClick={() => fileRef.current?.click()}
              disabled={isSending}
              className="p-2 hover:bg-gray-200 rounded-full transition disabled:opacity-50"
            >
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
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleSend()
                }
              }}
              disabled={isSending}
              className="flex-1 border rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:bg-gray-100"
              placeholder="Ketik pesan..."
            />

            <Button 
              size="icon" 
              onClick={handleSend}
              disabled={isSending || (!input.trim() && !selectedImage)}
              className="shrink-0"
            >
              {isSending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <FinishWithClaim
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        isLoading={finishClaimMutation.isPending}
        onConfirm={() => {
          if (!myProfileId || !otherProfileId) return
          finishClaimMutation.mutate(
            {
              itemId,
              otherProfileId,
            },
            {
              onSuccess: () => {
                toast.success('Item berhasil diklaim/ditemukan')
                setConfirmOpen(false)
              },
              onError: (err) => {
                toast.error('Gagal menandai item')
              }
            }
          )
        }}
      />
    </>
  )
}