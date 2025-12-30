"use client"

import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs"
import { FileText, Bookmark, Bell, Plus } from "lucide-react"
import Link from "next/link"
import { useMyReports } from "@/hooks/useReports"
import ItemDashboard from "./item-dashboard"
import ItemsDashboardSkeleton from "./item-dashboard-skeleton"

const Activity = () => {
  const { data: items, isLoading: itemLoading } = useMyReports()

  return (
    <div className="border shadow-md rounded-md p-4">
      <Tabs defaultValue="reports" className="w-full">
        <TabsList className="grid grid-cols-2 w-full mb-6">
          <TabsTrigger value="reports" className="flex gap-2">
            <FileText className="w-4 h-4" />
            <span className="hidden md:block">Laporan Saya</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex gap-2">
            <Bell className="w-4 h-4" />
            <span className="hidden md:block">Notifikasi</span>
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
            <Link href="/akun/buat-laporan" className="group flex flex-col items-center justify-center rounded-xl border-2 border-dashed min-h-[350px] md:min-h-[320px] border-gray-300 p-6 text-center transition hover:border-primary hover:bg-gray-50">
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
