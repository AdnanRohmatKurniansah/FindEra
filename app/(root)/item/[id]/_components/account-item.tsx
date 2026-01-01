'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { formatMonthYear } from '@/lib/utils'
import { itemData } from '@/types'
import { Edit2Icon, Hand, Info, MessageCircle, Shield, Trash2Icon } from 'lucide-react'
import Image from 'next/image'
import { ChatDialog } from './chat-dialog'
import Link from 'next/link'

const claimSteps = [
  { title: 'Kirim Bukti Kepemilikan', description: 'Unggah foto atau detail unik yang hanya diketahui pemilik asli.' },
  { title: 'Verifikasi', description: 'Penemu akan meninjau data klaim yang kamu kirimkan.' },
  { title: 'Serah Terima Aman', description: 'Atur pertemuan di tempat umum yang aman untuk serah terima barang.' }
]

const ClaimProcess = () => (
  <div className="mt-4 rounded-lg border bg-blue-50 p-4">
    <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-800">
      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-100">
        <Info className="h-4 w-4 text-blue-600" />
      </div>
      Proses Klaim
    </div>

    <div className="relative ml-2 border-l-2 border-blue-200 pl-5">
      {claimSteps.map((step, i) => (
        <div key={i} className="relative mb-4 last:mb-0">
          <span className={`absolute -left-6 mt-1 h-2 w-2 rounded-full ${i === 0 ? 'bg-blue-600' : 'bg-gray-400'}`} />
          <p className="text-sm font-medium">{i + 1}. {step.title}</p>
          <p className="text-sm text-gray-600">{step.description}</p>
        </div>
      ))}
    </div>
  </div>
)

type AccountItemProps = {
  data: itemData
  myProfileId: string | null
}

const AccountItem = ({ data, myProfileId }: AccountItemProps) => {
  const profile = Array.isArray(data.profiles) ? data.profiles[0] : data.profiles

  if (!profile || !profile.id) return null

  return (
    <div className="account-item">
      <Card className="p-5 gap-1 space-y-4">
        <div className="flex items-center gap-4">
          <Image src={profile.image || '/images/avatar.png'} width={60} height={60} alt="" className="rounded-full" />
          <div>
            <div className="font-semibold">{profile.name}</div>
            <div className="text-sm text-gray-500">Member sejak {formatMonthYear(profile.created_at)}</div>
          </div>
        </div>

        {myProfileId == profile.id ? (
          <Button asChild className="w-full">
            <Link href="/akun">
              <Edit2Icon className="mr-2" />
              Edit Laporan
            </Link>
          </Button>
        ): (
          <ChatDialog myProfileId={myProfileId} otherProfileId={profile.id} reporterName={profile.name} defaultMessage="Saya ingin mengklaim barang ini...">
            <Button className="w-full">
              <Hand className="mr-2" /> Klaim Barang Ini
            </Button>
          </ChatDialog>
        )}

        {myProfileId == profile.id ? (
          <Button asChild className="w-full" variant="destructive">
            <Link href="/akun">
              <Trash2Icon className="mr-2" />
              Hapus Laporan
            </Link>
          </Button>
        ): (
          <ChatDialog myProfileId={myProfileId} otherProfileId={profile.id} reporterName={profile.name}>
            <Button variant={'outline'} className="w-full">
              <MessageCircle className="mr-2" /> Kirim Pesan
            </Button>
          </ChatDialog>
        )}
        <ClaimProcess />
      </Card>
      <div className="mt-5 p-4 text-sm border text-[#78350F] bg-[#FFFBEB] flex gap-2">
        <Shield className="w-5 h-5" />
        <span>Jangan bagikan data pribadi dan bertemu di tempat aman.</span>
      </div>
    </div>
  )
}

export default AccountItem
