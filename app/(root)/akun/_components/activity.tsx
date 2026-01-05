"use client"

import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs"
import { FileText, MessageCircle, Plus, Award, Coins, MapPin, Gift } from "lucide-react"
import Link from "next/link"
import { useClaimHistory, useMyReports, useRewardHistory } from "@/hooks/useReports"
import ItemDashboard from "./item-dashboard"
import ItemsDashboardSkeleton from "./item-dashboard-skeleton"
import { useChatHistory } from "@/hooks/useChats"
import { formatTime } from "@/lib/utils"
import Image from "next/image"
import { useProfile } from '@/hooks/useProfiles'
import { ChatDialog } from "./chat-dialog"
import { useEffect, useMemo, useState } from "react"
import { createClientSupabase } from "@/lib/supabase/client"
import { Badge } from "@/components/ui/badge"

const Activity = () => {
  const { data: items, isLoading: itemLoading } = useMyReports()
  const { data: profile } = useProfile()
  const myProfileId = profile?.id

  const { data: chats = [], isLoading: chatLoading } = useChatHistory(myProfileId)
  const { data: claims = [], isLoading: claimLoading } = useClaimHistory(myProfileId)
  const { data: rewards = [], isLoading: rewardLoading } = useRewardHistory(myProfileId)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [itemsById, setItemsById] = useState<Record<string, any>>({})

  const groupedChats = useMemo(() => {
    return chats.reduce((acc, room) => {
      if (!acc[room.item_id]) acc[room.item_id] = []
      acc[room.item_id].push(room)
      return acc
    }, {} as Record<string, typeof chats>)
  }, [chats])

  useEffect(() => {
    const itemIds = Object.keys(groupedChats)
    if (!itemIds.length) return

    const fetchItems = async () => {
      const { data, error } = await createClientSupabase()
        .from('items')
        .select('id, title, status, id_user')
        .in('id', itemIds)

      if (!error && data) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const map: Record<string, any> = {}
        data.forEach(i => { map[i.id] = i })
        setItemsById(map)
      }
    }

    fetchItems()
  }, [groupedChats])

  return (
    <div className="border shadow-md rounded-md p-4">
      <Tabs defaultValue="reports" className="w-full">
        <TabsList className="grid grid-cols-4 w-full mb-6">
          <TabsTrigger value="reports" className="flex gap-2">
            <FileText className="w-4 h-4" />
            <span className="hidden md:block">Laporan </span>
          </TabsTrigger>
          <TabsTrigger value="claimed" className="flex gap-2">
            <Award className="w-4 h-4" />
            <span className="hidden md:block">Terklaim </span>
          </TabsTrigger>
          <TabsTrigger value="rewards" className="flex gap-2">
            <Gift className="w-4 h-4" />
            <span className="hidden md:block">Poin</span>
          </TabsTrigger>
          <TabsTrigger value="chat" className="flex gap-2">
            <MessageCircle className="w-4 h-4" />
            <span className="hidden md:block">Chat</span>
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

        <TabsContent value="claimed" className="min-h-[200px]">
          <h3 className="font-semibold text-xl mb-5">Histori Klaim</h3>
          {claimLoading ? (
            <div className="py-10 text-center text-sm text-gray-500">
              Memuat histori klaim...
            </div>
          ) : claims.length === 0 ? (
            <div className="py-10 text-center text-sm text-gray-500">
              <Image className="mx-auto" width={100} height={100} src={'/images/empty.png'} alt="empty data" />
              <p className="mt-4">Belum ada histori klaim</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {claims.map((claim) => {
                const owner = Array.isArray(claim.owner) ? claim.owner[0] : claim.owner
                const finder = Array.isArray(claim.finder) ? claim.finder[0] : claim.finder
                const item = Array.isArray(claim.item) ? claim.item[0] : claim.item

                const isOwner = owner?.id === myProfileId
                const otherPerson = isOwner ? finder : owner
                const role = isOwner ? "Pemilik" : "Penemu"

                return (
                  <div key={claim.id} className="overflow-hidden h-full border rounded-xl hover:shadow-md transition-shadow flex flex-col">
                    <div className="relative w-full aspect-4/3 rounded-t-md overflow-hidden">
                      <Link href={`/item/${item?.id}`}>
                        <Image 
                          src={item?.image_url || '/images/placeholder.png'}
                          alt={item?.title}
                          fill
                          className="object-cover transition-transform duration-300 hover:scale-105"
                        />
                      </Link>
                      
                      <div className="absolute left-2 top-2">
                        <span className="px-2 py-1 rounded-md bg-primary text-white text-xs font-bold flex items-center gap-1">
                          <Award className="w-3 h-3" /> Diklaim
                        </span>
                      </div>
                      
                      <div className="absolute right-2 top-2">
                        <span className="px-2 py-1 rounded-md bg-primary/10 backdrop-blur-sm text-primary text-xs font-medium">
                          {role}
                        </span>
                      </div>
                      
                      <div className="absolute left-2 bottom-2">
                        <span className="px-2 py-1 rounded-md bg-white/80 backdrop-blur-sm text-gray-700 text-xs flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-primary" />
                          {item?.location_text && item.location_text.length > 25
                            ? item.location_text.slice(0, 25) + '...'
                            : item?.location_text}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col flex-1 px-4 py-3">
                      <Link href={`/item/${item?.id}`}>
                        <h4 className="font-semibold text-md line-clamp-1 hover:text-primary transition-colors">
                          {item?.title}
                        </h4>
                      </Link>
                      
                      <div className="flex items-center gap-3 pt-3 mt-auto border-t">
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center shrink-0">
                          <Image 
                            src={otherPerson?.image || '/images/avatar.png'}
                            alt={otherPerson?.name || 'User'}
                            width={40}
                            height={40}
                            className="object-cover w-full h-full"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-gray-500 mb-1">
                            {isOwner ? "Ditemukan oleh:" : "Pemilik:"}
                          </p>
                          <p className="font-medium text-sm truncate">
                            {otherPerson?.name}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-400">
                            {formatTime(new Date(claim.created_at))}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="rewards" className="min-h-[200px]">
          <h3 className="font-semibold text-xl mb-5">Histori Reward</h3>
          {rewardLoading ? (
            <div className="py-10 text-center text-sm text-gray-500">
              Memuat histori reward...
            </div>
          ) : rewards.length === 0 ? (
            <div className="py-10 text-center text-sm text-gray-500">
              <Image className="mx-auto" width={100} height={100} src={'/images/empty.png'} alt="empty data" />
              <p className="mt-4">Belum ada histori reward</p>
            </div>
          ) : (
            <div className="space-y-3">
              {rewards.map((reward) => {
                const item = Array.isArray(reward.items) ? reward.items[0] : reward.items

                return (
                  <div key={reward.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-4">
                      {item && (
                        <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                          <Image src={item.image_url || '/images/placeholder.png'}
                            alt={item.title || 'Item'}
                            fill className="object-cover"/>
                        </div>
                      )}
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-sm line-clamp-1">{reward.reason}</h4>
                            {item && (
                              <Link href={`/item/${item.id}`} className="text-sm text-gray-600 hover:text-primary line-clamp-1 mt-1">
                                {item.title}
                              </Link>
                            )}
                            <p className="text-xs text-gray-400 mt-1">
                              {formatTime(new Date(reward.created_at))}
                            </p>
                          </div>
                          
                          <div className="flex-shrink-0">
                            <Badge className="px-3 py-1 bg-primary text-white font-bold flex items-center gap-1">
                              <Coins className="w-4 h-4" />
                              +{reward.points}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="chat" className="min-h-[200px]">
          <h3 className="font-semibold text-xl mb-5">Riwayat Chat</h3>
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
              {Object.entries(groupedChats).map(([itemId, rooms]) => {
                const item = itemsById[itemId]

                return (
                  <div key={itemId} className="border rounded-lg p-3 space-y-2">
                    <div className="text-sm font-semibold text-gray-700 flex justify-between">
                      <span>{item?.title} - <Link className="underline" href={`/item/${item?.id}`}>Lihat Detail</Link></span>
                      {item && (
                        item.status === 'ditemukan' ? (
                          <span className="bg-[#DCFCE7] border border-primary ms-2 flex rounded-xl items-center text-primary text-[10px] md:text-[12px] px-2 py-1">
                            Ditemukan
                          </span>
                        ) : item.status === 'ditutup' ? (
                          <span className="bg-[#FFFBEB] border border-[#78350F] ms-2 flex rounded-xl items-center text-[#78350F] text-[10px] md:text-[12px] px-2 py-1">
                            Ditutup
                          </span>
                        ) : item.status === 'diklaim' ? (
                          <span className="bg-blue-200 border border-blue-500 ms-2 flex rounded-xl items-center text-blue-500 text-[10px] md:text-[12px] px-2 py-1">
                            Diklaim
                          </span>
                        ) : item.status === 'hilang' ? (
                          <span className="bg-[#FFF2F3] border border-[#FB2C36] ms-2 flex rounded-xl items-center text-[#FB2C36] text-[10px] md:text-[12px] px-2 py-1">
                            Hilang
                          </span>
                        ) : null
                      )}
                    </div>

                    {rooms.map(room => {
                      const profileA = Array.isArray(room.profile_a) ? room.profile_a[0] : room.profile_a
                      const profileB = Array.isArray(room.profile_b) ? room.profile_b[0] : room.profile_b
                      const other = profileA?.id === myProfileId ? profileB : profileA

                      return (
                        <ChatDialog
                          key={room.id}
                          myProfileId={myProfileId}
                          otherProfile={other}
                          itemId={itemId}
                          itemTitle={item?.title}
                          itemUserId={item?.id_user}
                          itemStatus={item?.status}>
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
                                  {!room.lastMessage && (
                                    <span className="italic text-gray-400">Belum ada pesan</span>
                                  )}
                                  {room.lastMessage && room.lastMessage.message && (
                                    room.lastMessage.message
                                  )}
                                  {room.lastMessage && !room.lastMessage.message && room.lastMessage.image_url && (
                                    "📷 Foto"
                                  )}
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