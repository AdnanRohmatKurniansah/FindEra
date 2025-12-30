"use client"

import { Clock, TrendingUp, Users } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import ItemsCard from "./items-card"
import PaginationData from "@/components/shared/pagination-data"
import { useReports, useReportsSummary } from "@/hooks/useReports"
import ItemsCardSkeleton from "./items-card-skeleton"
import SummaryCard from "./summary-card"
import { Skeleton } from "@/components/ui/skeleton"
import Image from "next/image"

const HomeReports = () => {
  const router = useRouter()
  const searchParams = useSearchParams()

  const page = Number(searchParams.get("page") || 1)

  const { data, isLoading } = useReports(page, 6)
  const { data: summary, isLoading: isSummaryLoading } = useReportsSummary()

  const items = data?.data ?? []
  const total = data?.total ?? 0
  const totalPages = Math.ceil(total / 6)

  return (
    <>
      <div className="grid justify-center grid-cols-2 md:grid-cols-3 gap-4 mb-7">
        {isSummaryLoading ? (
            <>
                <Skeleton className="h-20 rounded-[10px]" />
                <Skeleton className="h-20 rounded-[10px]" />
                <Skeleton className="h-20 rounded-[10px]" />
            </>
        ) : (
            <>
                <div className="col-span-2 md:col-span-1">
                  <SummaryCard label="Total Laporan" value={summary?.total ?? 0} bgColor="bg-[#EEF3FF]" textColor="text-blue-500" iconBg="bg-primary" icon={<TrendingUp />} />
                </div>
                <SummaryCard label="Barang Hilang" value={summary?.missing ?? 0} bgColor="bg-[#FFF2F3]" textColor="text-red-500" iconBg="bg-red-500" icon={<Clock />} />
                <SummaryCard label="Hasil Temuan" value={summary?.found ?? 0} bgColor="bg-[#EFFDF4]" textColor="text-green-500" iconBg="bg-green-500" icon={<Users />}/>
            </>
        )}
      </div>
      <div className="report_head mb-7">
        <div className="flex justify-between border shadow-sm rounded-[10px] px-4 py-3">
          <div>
            <h3 className="font-medium text-[18px] mb-2">Daftar Laporan</h3>
            <p className="text-gray-600 text-[15px] flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Live Update
            </p>
          </div>
          <div className="flex items-center">
            <span className="bg-[#EEF3FF]  rounded-[15px] py-2 px-3 text-primary text-[14px]">
                {total} Items
            </span>
          </div>
        </div>
      </div>
      <div className="list_item grid grid-cols-1 md:grid-cols-2 gap-4">
        {isLoading ? (
            <>
                {Array.from({ length: 4 }).map((_, i) => (
                    <ItemsCardSkeleton key={i} />
                ))}
            </>
        ) : (
            <>
              {items.length === 0 ? (
                <div className="text-center text-gray-500 col-span-full my-20">
                  <Image className="mx-auto" width={120} height={120} src={'/images/empty.png'} alt="empty data" />
                  <p className="mt-4">Tidak ada laporan ditemukan.</p>
                </div>
              ) : (
                items.map((item) => (
                  <ItemsCard key={item.id} item={item} />
                ))
              )}
            </>
        )}
      </div>
      {items.length > 0 && (
        <div className="pagination my-8">
          <PaginationData
            page={page}
            totalPages={totalPages}
            onPageChange={(p) => router.push(`/?page=${p}`)}
          />
        </div>
      )}
    </>
  )
}


export default HomeReports
