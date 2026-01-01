import Link from 'next/link'
import { PlusCircle, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import Image from 'next/image'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Halaman Tidak Ditemukan | FindEra',
  description: 'Seperti barang yang hilang, halaman ini belum berhasil ditemukan. Coba kembali ke beranda atau buat laporan baru.',
}

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F7FAF9] px-4">
      <Card className="max-w-xl w-full p-8 gap-3 text-center shadow-lg rounded-2xl">
        <div className="flex justify-center mb-2">
          <Link href={'/'} className="shrink-0">
            <Image
              src={'/images/logo.png?v=1'}
              width={0}
              height={0}
              sizes="100vw"
              className="h-14 w-auto"
              alt={'logo findera'}
            />
          </Link>
        </div>

        <h1 className="text-3xl font-bold mb-2 text-gray-800">
          Oops! halaman tidak ditemukan
        </h1>

        <p className="text-gray-500 mb-6">
          Seperti barang yang hilang, halaman ini belum berhasil ditemukan.  
          Coba kembali ke beranda atau buat laporan baru.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild>
            <Link href="/">
              <Home className="w-4 h-4 mr-2" />
              Ke Beranda
            </Link>
          </Button>

          <Button variant="outline" asChild>
            <Link href="/akun/buat-laporan">
              <PlusCircle className="w-4 h-4 mr-2" />
              Buat Laporan
            </Link>
          </Button>
        </div>

        <p className="mt-6 text-xs text-muted-foreground">
          FindEra — Lost, Found, Connected.
        </p>
      </Card>
    </div>
  )
}
