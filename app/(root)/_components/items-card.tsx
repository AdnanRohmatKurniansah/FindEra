'use client'

import { Card } from '@/components/ui/card'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Calendar, Check, DoorClosed, Heart, MapPin, Search, User } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { itemData } from '../../../types/index';
import { formatMonthYear } from '../../../lib/utils';

const ItemsCard = ({ item }: {item: itemData}) => {
  const profile = Array.isArray(item.profiles)
    ? item.profiles[0]
    : item.profiles

  return (
    <div className="group block h-full">
      <Card className="overflow-hidden gap-0 h-full py-0 hover:shadow-md transition-shadow flex flex-col">
        <div className="relative w-full aspect-4/3 rounded-t-md overflow-hidden">
          <Link href={`/item/${item.id}`}>
            <Image alt={item.title} src={item.image_url} fill className="object-cover transition-transform duration-300 group-hover:scale-105" />
          </Link>
          <div className="absolute left-2 top-2">
            {item.status == 'hilang' ? (
              <Badge className="px-2 py-1 bg-red-500 font-bold">
                <Search className="w-3 me-1" /> Hilang
              </Badge>
            ) : item.status == 'ditemukan' ? (
              <Badge className="px-2 py-1 bg-primary font-bold">
                <Check className="w-3 me-1" /> Ditemukan
              </Badge>
            ) : item.status == 'diklaim' ? (
              <Badge className="px-2 py-1 bg-blue-500 font-bold">
                <User className="w-3 me-1" /> Diklaim
              </Badge>
            ) : item.status == 'ditutup' ? (
              <Badge className="px-2 py-1 bg-[#78350F] font-bold">
                <DoorClosed className="w-3 me-1" /> Ditutup
              </Badge>
            ) : null}
          </div>
          <div className="absolute right-2 top-2">
            <Badge className="px-2 py-1 bg-black-transparent">
              <Calendar className="w-3 me-1" /> {formatMonthYear(item.report_date)}
            </Badge>
          </div>

          <div className="absolute left-2 bottom-2">
            <Badge className="px-2 py-1 bg-white-transparent text-gray-600">
              <MapPin className='w-4 me-1 text-primary' />
              {item.location_text.length > 30 ? item.location_text.slice(0, 30) + '...' : item.location_text}
            </Badge>
          </div>
        </div>
        <div className="flex flex-col flex-1 px-4 py-2">
          <h4 className="font-medium text-md mt-1">{item.title}</h4>
          <p className="text-sm text-muted-foreground mt-2 pb-2">
            {item.description.length > 50 ? item.description.slice(0, 50) + '...' : item.description}
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
              <p className="text-[13px] font-medium text-gray-600">{profile.name}</p>
            </div>
          )}
          <Link href={`/item/${item.id}`} className="mt-auto pt-3">
            <Button className="hidden md:flex w-full">
              Lihat Detail <ArrowRight />
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  )
}

export default ItemsCard