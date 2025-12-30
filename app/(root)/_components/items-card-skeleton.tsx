'use client'

import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

const ItemsCardSkeleton = () => {
  return (
    <div className="block h-full">
      <Card className="overflow-hidden h-full gap-0 py-0">
        <div className="relative w-full aspect-4/3 rounded-t-md overflow-hidden">
          <Skeleton className="w-full h-full" />
        </div>
        <div className="px-4 py-2 space-y-3">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-5/6" />
          <div className="flex items-center gap-3 pt-2 border-t">
            <Skeleton className="w-7 h-7 rounded-full" />
            <Skeleton className="h-3 w-1/3" />
          </div>
          <Skeleton className="hidden md:block h-9 w-full rounded-md" />
        </div>
      </Card>
    </div>
  )
}

export default ItemsCardSkeleton
