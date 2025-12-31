'use client'

import dynamic from 'next/dynamic'
import { Skeleton } from '@/components/ui/skeleton'
import { itemData } from '@/types'
import { useMemo } from 'react'

interface ItemDetailMapProps {
  item: itemData
}

const ItemDetailMap = ({ item }: ItemDetailMapProps) => {
  const Map = useMemo(
    () =>
      dynamic(() => import('@/components/shared/map'), {
        loading: () => <Skeleton className="h-72 w-full" />,
        ssr: false,
      }),
    []
  )

  return (
    <div className="h-72 w-full z-40 overflow-hidden rounded-lg">
      <Map
        position={[item.latitude, item.longitude]}
        zoom={15}
        items={[item]}  
      />
    </div>
  )
}

export default ItemDetailMap
