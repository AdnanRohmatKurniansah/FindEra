'use client'

import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardFooter, CardHeader } from '@/components/ui/card'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb'
import Link from 'next/link'
import { SlashIcon, MapPin, Calendar, Share2, Info } from 'lucide-react'
import { useFindReport } from '@/hooks/useReports'
import { toast } from 'sonner'
import ItemDetailMap from './item-detail-map'
import AccountItem from './account-item'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { isValidUUID } from '@/lib/utils'
import ItemDetailSkeleton from './item-detail-skeleton'
import { useProfile } from '@/hooks/useProfiles'

const ItemDetailClient = ({ id }: { id: string }) => {
  const router = useRouter()
  const isUUID = isValidUUID(id)
  const { data, isLoading, error } = useFindReport(id)
  const { data: profile, isLoading: loadingProfile } = useProfile()

  const myProfileId = profile?.id ?? null

  useEffect(() => {
    if (!isUUID) {
      router.replace('/404')
    }
  }, [isUUID, router])

  if (isLoading || loadingProfile) {
    return <ItemDetailSkeleton />
  }

  if (error || !data) {
    return null 
  }

  const category = Array.isArray(data.categories)
    ? data.categories[0]
    : data.categories

  const CopyUrl = () => {
    const url = window.location.href
    navigator.clipboard.writeText(url).then(() => {
        toast.success('Link berhasil disalin di clipboard!')
    }).catch(() => {
        toast.error('Gagal menyalin link.')
    })
  }

  return (
    <section className="pt-5 pb-10 md:py-10">
      <div className="mx-auto px-5 md:px-15">
        <Breadcrumb className="mb-5">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator><SlashIcon /></BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbPage>{data.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 mb-16">
          <div className="lg:col-span-2 space-y-4">
            <div className="mb-6">
              <h1 className="text-2xl md:text-3xl font-bold flex justify-between items-center mb-4">
                  {data.title}
                  {data.status == 'ditemukan' ? (
                    <span className="bg-[#DCFCE7] border border-primary ms-2 flex rounded-xl items-center text-primary text-[10px] md:text-[12px] px-2 md:px-3 py-1 md:py-2">
                      Status: Ditemukan
                    </span>
                  ) : data.status == 'ditutup' ? (
                    <span className="bg-[#FFFBEB] border border-[#78350F] ms-2 flex rounded-xl items-center text-[#78350F] text-[10px] md:text-[12px] px-2 md:px-3 py-1 md:py-2">
                      Status: Ditutup
                    </span>
                  ) : data.status == 'diklaim' ? (
                    <span className="bg-blue-200 border border-blue-500 ms-2 flex rounded-xl items-center text-blue-500 text-[10px] md:text-[12px] px-2 md:px-3 py-1 md:py-2">
                      Status: Diklaim
                    </span>
                  ) : (
                    <span className="bg-[#FFF2F3] border border-[#FB2C36] ms-2 flex rounded-xl items-center text-[#FB2C36] text-[10px] md:text-[12px] px-2 md:px-3 py-1 md:py-2">
                      Status: Hilang
                    </span>
                  )}
              </h1>
              <div className="mt-3 flex flex-wrap gap-4 text-sm">
                  <Badge className='px-3 py-1'>{category.name}</Badge>
                  <span className="flex items-center text-gray-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    Dilaporkan pada {new Date(data.report_date).toLocaleDateString()}
                  </span>
                  <Button className='border' variant="outline" size="sm" onClick={CopyUrl}>
                    <Share2 className="w-4 h-4 mr-1" /> Bagikan
                  </Button>
              </div>
            </div>
            <div className="overflow-hidden rounded-[10px] mb-10">
              <div className="relative aspect-[4/3]">
                <Image src={data.image_url} alt={data.title} fill className="object-cover" />
              </div>
            </div>
            <Card className="p-5 mb-10">
              <h3 className="flex items-center font-semibold border-b-2 pb-3 gap-2">
                <Info className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-blue-600" />
                Deskripsi
              </h3>
              <p className="text-sm text-gray-600 mt-3">{data.description}</p>
            </Card>

            <Card className="overflow-hidden gap-4">
              <CardHeader className="flex items-center gap-2 px-5">
                <MapPin className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-primary" />
                <h3 className="font-semibold">Lokasi Terakhir Keberadaan</h3>
              </CardHeader>
              <ItemDetailMap item={data} />
              <CardFooter className='py-2'>
                <p className="text-sm">
                  <span className='font-semibold'>Lokasi Detail di :</span> {data.location_text}
                </p>
              </CardFooter>
            </Card>
          </div>
          <div className="relative md:sticky md:top-28 h-fit space-y-4">
            <AccountItem data={data} myProfileId={myProfileId} />
          </div>
        </div>
      </div>
    </section>
  )
}

export default ItemDetailClient