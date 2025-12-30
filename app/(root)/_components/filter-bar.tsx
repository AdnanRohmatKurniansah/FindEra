"use client"

import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useCategories } from '@/hooks/useCategories'
import { Funnel } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'

const FilterBar = () => {
  const { data: categories, isLoading } = useCategories()
  const router = useRouter()
  const params = useSearchParams()

  const status = params.get("status")
  const category = params.get("category")

  const setFilter = (key: string, value?: string) => {
    const p = new URLSearchParams(params.toString())

    if (!value) p.delete(key)
    else p.set(key, value)

    p.set("page", "1") 
    router.push(`/?${p.toString()}`)
  }

  return (
    <div className='filterbar bg-white shadow px-4 py-3'>
      <div className="flex gap-3 overflow-x-scroll pb-1">

        <Button variant="outline"><Funnel className="mr-2" /> Filter</Button>

        <Button className='border shadow'
          variant={!status && !category ? "default" : "outline"}
          onClick={() => router.push("/")}>
          Semua
        </Button>

        <Button variant={status === "hilang" ? "default" : "outline"} onClick={() => setFilter("status", "hilang")}>
          Hilang
        </Button>

        <Button
          variant={status === "ditemukan" ? "default" : "outline"}
          onClick={() => setFilter("status", "ditemukan")}
        >
          Ditemukan
        </Button>

        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="w-24 h-9 rounded-md" />
          ))
        ) : (
          categories?.map(cat => (
            <Button
              key={cat.id}
              variant={category === cat.name.toLowerCase() ? "default" : "outline"}
              onClick={() => setFilter("category", cat.name.toLowerCase())}
            >
              {cat.name}
            </Button>
          ))
        )}
      </div>
    </div>
  )
}

export default FilterBar
