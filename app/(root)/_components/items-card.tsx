'use client'

import { Card } from '@/components/ui/card'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Calendar, Heart, MapPin, Search } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { itemData } from '../../../types/index';
import { formatMonthYear, getLastLocationPart } from '../../../lib/utils';

const ItemsCard = ({ item }: {item: itemData}) => {
  const profile = Array.isArray(item.profiles)
    ? item.profiles[0]
    : item.profiles

  return (
    <div className="group block h-full">
      <Card className="overflow-hidden h-full gap-0 py-0 hover:shadow-md transition-shadow">
        <div className="relative w-full aspect-4/3 rounded-t-md overflow-hidden">
          <Link href={`/item/${item.id}`}>
            <Image alt={item.title} src={item.image_url} fill className="object-cover transition-transform duration-300 group-hover:scale-105"/>
          </Link>
          <div className="absolute left-2 top-2">
            {item.status == 'hilang' ? (
              <Badge className="px-2 py-1 bg-red-500 font-bold">
                <Search className="w-3 me-1" /> Hilang
              </Badge>
            ): (
              <Badge className="px-2 py-1 bg-blue-500 font-bold">
                <Search className="w-3 me-1" /> Ditemukan
              </Badge>
            )}
          </div>
          <div className="absolute right-2 top-2">
            <Badge className="px-2 py-1 bg-black-transparent">
                <Calendar className="w-3 me-1" /> {formatMonthYear(item.report_date)}
            </Badge>
          </div>
          <div className="absolute left-2 bottom-2">
            <Badge className="px-2 py-1 bg-white-transparent text-gray-600">
                <MapPin className='w-4 me-1 text-primary' />{getLastLocationPart(item.location_text)}
            </Badge>
          </div>
        </div>
        <Link className='px-4 py-2' href={`/`}>
          <h4 className="font-medium text-md mt-1">{item.title}</h4>
          <p className="text-sm text-muted-foreground mt-2 flex items-center pb-2">
            {item.description.length > 50
              ? item.description.slice(0, 50) + '...'
              : item.description}
          </p>
          {profile && (
            <div className="flex items-center gap-3 pt-2 border-t">
              <div className="profile rounded-full w-7 h-7 relative overflow-hidden">
                <Image
                  alt={profile.name ?? "User Avatar"}
                  src={profile.image || "/images/avatar.png"}
                  fill
                />
              </div>
              <p className="text-[13px] font-medium text-gray-600">
                {profile.name}
              </p>
            </div>
          )}
          <Button className='hidden md:flex w-full mt-3'>Lihat Detail <ArrowRight /></Button>
        </Link>
      </Card>
    </div>
  )
}

export default ItemsCard