'use client'

import React, { useEffect, useState } from 'react'
import { Card } from '@/app/components/ui/card'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Calendar, Heart, MapPin, Search } from 'lucide-react'
import { Badge } from '@/app/components/ui/badge'
import { Button } from '@/app/components/ui/button'

const ItemsCard = () => {
  return (
    <div className="group block h-full">
      <Card className="overflow-hidden h-full gap-0 py-0 hover:shadow-md transition-shadow">
        <div className="relative w-full aspect-4/3 rounded-t-md overflow-hidden">
          <Link href={`/`}>
            <Image alt={'asdfafas'} src={'https://images.unsplash.com/photo-1634196650884-ac296483ca4f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8aGFuZHBob25lfGVufDB8fDB8fHww'} fill className="object-cover transition-transform duration-300 group-hover:scale-105"/>
          </Link>
          <div className="absolute left-2 top-2">
            <Badge className="px-2 py-1 bg-red-500 font-bold">
                <Search className="w-3 me-1" /> Hilang
            </Badge>
          </div>
          <div className="absolute right-2 top-2">
            <Badge className="px-2 py-1 bg-transparent">
                <Calendar className="w-3 me-1" /> 8 Nov
            </Badge>
          </div>
          <div className="absolute left-2 bottom-2">
            <Badge className="px-2 py-1 bg-white-transparent text-gray-600">
                <MapPin className='w-4 me-1 text-primary' />{'Central Park, Jakarta'}
            </Badge>
          </div>
        </div>
        <Link className='px-4 py-2' href={`/`}>
          <h4 className="font-medium text-md mt-1">{'Blue Leather Wallet'}</h4>
          <p className="text-sm text-muted-foreground mt-2 flex items-center pb-2">{'Lost my blue leather wallet near the central park. Contains ID cards and...'}</p>
          <div className="flex items-center gap-3 pt-2 border-t">
            <div className='profile rounded-full w-7 h-7 relative overflow-hidden'>
              <Image alt={'asdfafas'} src={'https://images.unsplash.com/photo-1634196650884-ac296483ca4f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8aGFuZHBob25lfGVufDB8fDB8fHww'} fill />
            </div>
            <div className="name">
              <p className='text-[13px] font-medium text-gray-600'>Adnan Rohmat K</p>
            </div>
          </div>
          <Button className='hidden md:flex w-full mt-3 text-primary hover:text-primary border-primary' variant={'outline'}>Lihat Detail <ArrowRight /></Button>
        </Link>
      </Card>
    </div>
  )
}

export default ItemsCard