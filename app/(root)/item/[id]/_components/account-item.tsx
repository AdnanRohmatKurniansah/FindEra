import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { formatMonthYear } from '@/lib/utils'
import { itemData } from '@/types'
import { Badge, Check, Hand, Info, Shield, User } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

const claimSteps = [
  {
    title: 'Kirim Bukti Kepemilikan',
    description: 'Unggah foto atau detail unik yang hanya diketahui pemilik asli.'
  },
  {
    title: 'Verifikasi',
    description: 'Penemu akan meninjau data klaim yang kamu kirimkan.'
  },
  {
    title: 'Serah Terima Aman',
    description: 'Atur pertemuan di tempat umum yang aman untuk serah terima barang.'
  }
]

const ClaimProcess = () => {
  return (
    <div className="mt-4 rounded-lg border bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-800">
        <Info className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-blue-600" />
        Proses Klaim
      </div>

      <div className="relative ml-2 border-l border-gray-200 pl-5">
        {claimSteps.map((step, index) => (
          <div key={index} className="relative mb-4 last:mb-0">
            <span
              className={`absolute -left-6 mt-1 h-2 w-2 rounded-full ${
                index === 0 ? 'bg-blue-600' : 'bg-gray-400'
              }`}
            />
            <p className="text-sm mb-2 font-medium">
              {index + 1}. {step.title}
            </p>
            <p className="text-sm text-gray-500">{step.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

const AccountItem = ({ data }: { data: itemData }) => {
  const profile = Array.isArray(data.profiles)
    ? data.profiles[0]
    : data.profiles

  return (
    <div>
        <Card className="p-5 flex items-center gap-3">
            {profile && (
            <div className='profile mb-5 flex items-center gap-4'>
                <div className="relative flex justify-start">
                    <Image  
                    alt={profile.name ?? "User Avatar"}
                    src={profile.image || "/images/avatar.png"}
                    width={60}
                    height={60}
                    className="rounded-full object-cover"
                    />
                    <div className="absolute flex justify-center items-center bottom-0 left-10 w-4 h-4 rounded-full bg-green-500">
                        <Check className="w-3 text-white" />
                    </div>
                </div>
                <div className="text-start">
                    <h2 className="font-semibold text-lg">{profile.name}</h2>
                    <h4 className="font-normal text-gray-600 text-md">
                    Member Sejak {formatMonthYear(profile.created_at)}
                    </h4>
                </div>
            </div>
            )}
            <Button className="w-full"><Hand /> Klaim Barang Ini</Button>
            <Button variant="outline" className="w-full">Kirim Pesan</Button>
            <ClaimProcess />
        </Card>
        <div className="mt-5 p-4 text-sm shadow-sm rounded-[10px] border border-[#D97706] bg-[#FFFBEB] text-[#D97706] flex">
            <Shield className="w-8 h-8 me-2" />
            <span>Demi keamanan, lakukan pertemuan di tempat umum dan jangan bagikan alamat rumah.</span>
        </div>
    </div>
  )
}

export default AccountItem