"use client"

import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs"
import { FileText, Bookmark, Bell, Plus } from "lucide-react"
import ItemsCard from "../../_components/items-card"
import Link from "next/link"

const Activity = () => {
  return (
    <div className="border shadow-md rounded-md p-4">
      <Tabs defaultValue="reports" className="w-full">
        <TabsList className="grid grid-cols-3 w-full mb-6">
          <TabsTrigger value="reports" className="flex gap-2">
            <FileText className="w-4 h-4" />
            <span className="hidden md:block">Laporan Saya</span>
          </TabsTrigger>
          <TabsTrigger value="saved" className="flex gap-2">
            <Bookmark className="w-4 h-4" />
            <span className="hidden md:block">Item Tersimpan</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex gap-2">
            <Bell className="w-4 h-4" />
            <span className="hidden md:block">Notifikasi</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="reports">
          <h3 className="font-semibold text-xl mb-5">Aktivitas Terbaru</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <ItemsCard key={i} />
            ))}
             <Link href="/akun/report" className="group flex flex-col items-center justify-center rounded-xl border-2 border-dashed min-h-[350px] md:min-h-[320px] border-gray-300 p-6 text-center transition hover:border-primary hover:bg-gray-50">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-primary transition group-hover:bg-primary group-hover:text-white">
                <Plus className="h-6 w-6" />
              </div>

              <h4 className="mt-4 font-semibold">Laporkan item baru</h4>
              <p className="mt-1 text-sm text-gray-500">
                Kehilangan sesuatu atau menemukan suatu barang? Buat laporan baru di sini.
              </p>
            </Link>
          </div>
        </TabsContent>

        <TabsContent value="saved">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <ItemsCard key={i} />
            ))}
           
          </div>
        </TabsContent>

        <TabsContent value="notifications">
          <div className="flex flex-col items-center justify-center py-12 text-center text-gray-500">
            <p className="text-sm">Belum ada notifikasi</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default Activity
