import { Button } from '@/components/ui/button'
import { Award, BookCheck, GlobeIcon, MapPin, TrendingUp, Users, Verified } from 'lucide-react'
import { Metadata } from 'next'
import Link from 'next/link'
import Cta from '../_components/cta'

export const metadata: Metadata = {
  title: "Tentang Kami | Findera"
}

const stats = [
  {
    icon: TrendingUp,
    value: "10.000 +",
    label: "Barang Dikembalikan",
  },
  {
    icon: Users,
    value: "1.000 +",
    label: "Pengguna Aktif",
  },
  {
    icon: Award,
    value: "80%",
    label: "Tingkat Keberhasilan",
  },
  {
    icon: MapPin,
    value: "100+",
    label: "Kota Terjangkau",
  },
]

const mission = [
  'FindEra didirikan dengan visi sederhana namun kuat: tidak ada lagi yang harus kehilangan barang berharga mereka selamanya. Kami percaya bahwa dengan kombinasi teknologi yang canggih dan kekuatan komunitas yang peduli, kita dapat membuat perbedaan nyata dalam kehidupan orang-orang.',
  'Setiap hari, ribuan orang kehilangan barang - mulai dari dompet, ponsel, hingga barang dengan nilai sentimental tinggi. Platform kami hadir untuk menjembatani kesenjangan antara kehilangan dan penemuan kembali.'
]

const whychoose = [
  {
    icon: BookCheck,
    heading: "Cepat & Mudah",
    subheading: "Laporan bisa dibuat hanya dalam hitungan detik tanpa proses yang rumit.",
    color: "bg-blue-600",
  },
  {
    icon: GlobeIcon,
    heading: "Akurat Berbasis Lokasi",
    subheading: "Pemetaan lokasi memudahkan pengguna menemukan barang di area terdekat.",
    color: "bg-green-600",
  },
  {
    icon: Verified,
    heading: "Aman & Terverifikasi",
    subheading: "Sistem verifikasi membantu mencegah laporan palsu atau penipuan.",
    color: "bg-purple-600",
  },
  {
    icon: Users,
    heading: "Terhubung Secara Komunitas",
    subheading: "Semakin banyak pengguna, semakin besar peluang menemukan barang kamu.",
    color: "bg-orange-500",
  },
]

const TentangKami = () => {
  return (
    <div className="py-10">
      <div className="mx-auto px-5 md:px-15">
        <div className="relative overflow-hidden bg-gradient-to-r from-[#007f5f] via-[#18b18a] to-[#30d3aa] rounded-2xl p-8 mb-8 md:mb-16 text-white">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative">
            <h1 className="text-[26px] font-bold mb-3">Tentang Kami</h1>
            <p className=" text-[15px] md:text-lg max-w-2xl">
              Platform yang membantu mempertemukan pemilik dengan barang hilang mereka 
              melalui teknologi cerdas dan dukungan komunitas yang peduli.
            </p>
          </div>
          <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-white/10 rounded-full"></div>
          <div className="absolute -right-8 -top-8 w-24 h-24 bg-white/5 rounded-full"></div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8 md:mb-16">
          {stats.map((item, index) => {
            const Icon = item.icon
            return (
              <div key={index} className="shadow transition-all duration-200 hover:-translate-y-1.5 hover:shadow-md border text-center p-4 rounded-[10px]">
                <div className="flex justify-center">
                  <div className="icon p-3 bg-primary rounded-[10px]">
                    <Icon className="text-white" />
                  </div>
                </div>
                <h5 className="mt-5 mb-2 text-lg text-primary font-medium">{item.value}</h5>
                <h6 className="mb-3 text-gray-600 text-[14px] md:text-[16px]">{item.label}</h6>
              </div>
            )
          })}
        </div>
        <div className="mission shadow border text-gray-600 text-justify p-6 rounded-[10px] mb-8 md:mb-16">
          <h3 className='text-2xl font-semibold mb-3 text-black'>Misi Kami</h3>
          <p className='mb-4'>{mission[0]}</p>
          <p>{mission[1]}</p>
        </div>
        <div className="flex justify-center">
          <h3 className='text-2xl font-semibold mb-8 text-black'>Mengapa Kami?</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 md:mb-16">
          {whychoose.map((item, index) => {
            const Icon = item.icon
            return (
              <div key={index} className="shadow transition-all duration-200 hover:-translate-y-1.5 hover:shadow-md border text-start p-4 rounded-[10px]">
                <div className="flex justify-start">
                  <div className={`icon p-3 rounded-[10px] ${item.color}`}>
                    <Icon className="text-white" />
                  </div>
                </div>
                <h5 className="mt-3 md:mt-5 mb-2 text-lg font-medium">{item.heading}</h5>
                <h6 className="mb-3 text-gray-600 text-[14px] md:text-[16px]">{item.subheading}</h6>
              </div>
            )
          })}
        </div>
        <Cta />
      </div>
    </div>
  )
}

export default TentangKami
