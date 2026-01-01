import { Metadata } from 'next'
import { findReport } from '@/service/reportsService'
import ItemDetailClient from './_components/item-detail-client'

type Props = {
  params: Promise<{
    id: string
  }>
}


export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params

  const data = await findReport(id)

  if (!data) {
    return {
      title: 'Item Tidak Ditemukan | FindEra',
      description: 'Item yang Anda cari tidak tersedia.',
      openGraph: {
        title: 'Item Tidak Ditemukan',
        description: 'Item yang Anda cari tidak tersedia.',
      }
    }
  }

  return {
    title: `Detail Item "${data.title}" | FindEra`,
    description: data.description,
    openGraph: {
      title: data.title,
      description: data.description,
    }
  }
}

export default async function Page({ params }: Props) {
  const { id } = await params

  return <ItemDetailClient id={id} />
}
