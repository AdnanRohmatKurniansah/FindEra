'use client'

import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

const ItemsDashboardSkeleton = () => {
  return (
    <div className="block h-full">
      <Card className="overflow-hidden h-full gap-0 py-0">
        <div className="relative w-full aspect-4/3 rounded-t-md overflow-hidden">
          <Skeleton className="w-full h-full" />
          <div className="absolute left-2 top-2">
            <Skeleton className="h-5 w-16 rounded-md" />
          </div>
          <div className="absolute right-2 top-2">
            <Skeleton className="h-5 w-20 rounded-md" />
          </div>
          <div className="absolute left-2 bottom-2">
            <Skeleton className="h-5 w-24 rounded-md" />
          </div>
        </div>
        <div className="px-4 py-2 space-y-3">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-5/6" />
          <div className="flex items-center justify-center gap-3 pt-2 border-t">
            <Skeleton className="h-9 w-9 rounded-md" />
            <Skeleton className="h-9 w-9 rounded-md" />
            <Skeleton className="h-9 w-9 rounded-md" />
          </div>
        </div>
      </Card>
    </div>
  )
}

export default ItemsDashboardSkeleton
