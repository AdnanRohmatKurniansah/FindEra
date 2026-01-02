"use client"

import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs"
import { FileText, MessageCircle, Plus } from "lucide-react"
import Link from "next/link"
import { useMyReports } from "@/hooks/useReports"
import ItemDashboard from "./item-dashboard"
import ItemsDashboardSkeleton from "./item-dashboard-skeleton"
import { useChatHistory } from "@/hooks/useChats"
import { formatTime } from "@/lib/utils"
import Image from "next/image"
import { useProfile } from '@/hooks/useProfiles';
import { ChatDialog } from "../../item/[id]/_components/chat-dialog"

const Activity = () => {
  const { data: items, isLoading: itemLoading } = useMyReports()
  const { data: profile } = useProfile()
  const myProfileId = profile?.id

  const { data: chats = [], isLoading: chatLoading } = useChatHistory(myProfileId)

  return (
    <div className="border shadow-md rounded-md p-4">
      <Tabs defaultValue="reports" className="w-full">
        <TabsList className="grid grid-cols-2 w-full mb-6">
          <TabsTrigger value="reports" className="flex gap-2">
            <FileText className="w-4 h-4" />
            <span className="hidden md:block">Laporan Saya</span>
          </TabsTrigger>
          <TabsTrigger value="history-chat" className="flex gap-2">
            <MessageCircle className="w-4 h-4" />
            <span className="hidden md:block">Riwayat Chat</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="reports">
          <h3 className="font-semibold text-xl mb-5">Aktivitas Terbaru</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {itemLoading ? (
              <>
                {Array.from({ length: 2 }).map((_, i) => (
                  <ItemsDashboardSkeleton key={i} />
                ))}
              </>
            ) : (
              <>
                {items?.map((item) => (
                  <ItemDashboard key={item.id} item={item} />
                ))}
              </>
            )}

            <Link href="/akun/buat-laporan"
              className="group flex flex-col items-center justify-center rounded-xl border-2 border-dashed min-h-[350px] md:min-h-[320px] border-gray-300 p-6 text-center transition hover:border-primary hover:bg-gray-50">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-primary transition group-hover:bg-primary group-hover:text-white">
                <Plus className="h-6 w-6" />
              </div>

              <h4 className="mt-4 font-semibold">Buat laporan baru</h4>
              <p className="mt-1 text-sm text-gray-500">
                Kehilangan sesuatu atau menemukan suatu barang? Buat laporan baru di sini.
              </p>
            </Link>
          </div>
        </TabsContent>

        <TabsContent value="history-chat" className="min-h-[200px]">
          {chatLoading ? (
            <div className="py-10 text-center text-sm text-gray-500">
              Memuat riwayat chat...
            </div>
          ) : chats.length === 0 ? (
            <div className="py-10 text-center text-sm text-gray-500">
              <Image className="mx-auto" width={100} height={100} src={'/images/empty.png'} alt="empty data" />
              <p className="mt-4">Belum ada riwayat chat</p>
            </div>
          ) : (
            <div className="space-y-3">
              {chats.map((room) => {
                const profileA = Array.isArray(room.profile_a) ? room.profile_a[0] : room.profile_a
                const profileB = Array.isArray(room.profile_b) ? room.profile_b[0] : room.profile_b

                const other = profileA?.id === myProfileId ? profileB : profileA

                return (
                  <ChatDialog
                    key={room.id}
                    myProfileId={myProfileId}
                    otherProfile={other}
                    itemId={room.item_id}
                    itemStatus={room.itemStatus ?? 'hilang'}>
                    <div className="flex items-center justify-between p-3 rounded-lg border shadow-sm hover:bg-gray-50 transition cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center shrink-0">
                          {other.image && (
                            <Image src={other.image ? other.image : '/images/avatar.png'}
                              alt={other.name}
                              width={40}
                              height={40}
                              className="object-cover w-full h-full"/>
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-[14px]">{other.name}</div>
                          <div className="text-sm text-gray-500 line-clamp-2 max-w-[260px] break-words">
                            {room.lastMessage?.message || "📷 Foto"}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        {room.lastMessage && (
                          <span className="text-xs text-gray-400">
                            {formatTime(new Date(room.lastMessage.created_at))}
                          </span>
                        )}
                        {room.unreadCount > 0 && (
                          <span className="bg-primary text-white text-xs px-2 py-0.5 rounded-full">
                            {room.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </ChatDialog>
                )
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default Activity
