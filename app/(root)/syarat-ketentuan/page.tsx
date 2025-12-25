import React from 'react'
import Cta from '../_components/cta'
import { CheckCircle, CheckSquareIcon, MapPin, MessageCircle, Search } from 'lucide-react'
import { Metadata } from 'next';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export const metadata: Metadata = {
    title: 'Syarat & Ketentuan - Findera',
}

const ketentuan = [
  {
    title: "Penerimaan Syarat",
    desc: "Dengan mengakses dan menggunakan platform FindEra, Anda setuju untuk terikat dengan syarat dan ketentuan yang dijelaskan di sini. Jika Anda tidak setuju dengan syarat ini, mohon untuk tidak menggunakan layanan kami." 
  },
  {
    title: "Penggunaan Layanan",
    desc: "Layanan FindEra disediakan gratis untuk membantu pengguna menemukan dan melaporkan barang hilang. Anda setuju untuk menggunakan layanan ini hanya untuk tujuan yang sah dan sesuai dengan hukum yang berlaku.",
  },
  {
    title: "Akun Pengguna",
    desc: "Anda bertanggung jawab untuk menjaga kerahasiaan akun dan password Anda. Anda setuju untuk tidak membagikan akun Anda dengan pihak lain dan bertanggung jawab atas semua aktivitas yang terjadi di bawah akun Anda.",
  },
  {
    title: "Konten Pengguna",
    desc: "Dengan mengunggah konten (foto, deskripsi, dll) ke platform kami, Anda memberikan kami hak untuk menggunakan, menyimpan, dan menampilkan konten tersebut untuk tujuan penyediaan layanan. Anda menjamin bahwa konten yang Anda unggah tidak melanggar hak pihak ketiga.",
  },
  {
    title: "Privasi dan Data",
    desc: "Kami menghormati privasi Anda dan berkomitmen untuk melindungi data pribadi Anda. Silakan lihat Kebijakan Privasi kami untuk informasi lebih lanjut tentang bagaimana kami mengumpulkan, menggunakan, dan melindungi data Anda.",
  },
  {
    title: "Tanggung Jawab Pengguna",
    desc: "Anda bertanggung jawab untuk memverifikasi kepemilikan barang sebelum mengklaim atau mengembalikan barang. Kami merekomendasikan untuk selalu bertemu di tempat publik saat transaksi pengambilan barang. FindEra tidak bertanggung jawab atas perselisihan antara pengguna.",
  },
  {
    title: "Larangan Penggunaan",
    desc: "Anda dilarang menggunakan platform ini untuk: (a) tujuan ilegal atau penipuan, (b) melecehkan atau mengintimidasi pengguna lain, (c) mengunggah konten yang melanggar hukum atau tidak pantas, (d) mencoba mengakses sistem kami secara tidak sah.",
  },
]

const SyaratKetentuan = () => {
  return (
    <section className="py-10">
      <div className="mx-auto px-5 md:px-15">
        <div className="relative mb-12 rounded-2xl bg-gradient-to-r from-[#007f5f] via-[#18b18a] to-[#30d3aa] p-8 text-white overflow-hidden">
          <div className="absolute inset-0 bg-black/10" />
          <div className="relative">
            <h1 className="text-2xl md:text-3xl font-bold mb-3">
              Syarat & Ketentuan
            </h1>
            <p className="max-w-2xl text-sm md:text-lg">Dokumen ini mengatur syarat dan ketentuan penggunaan platform kami. Harap baca dengan seksama sebelum menggunakan layanan kami.
            </p>
          </div>
        </div>
        {ketentuan.map((item, index) => {
            return (
                <div key={index} className="shadow border text-gray-600 text-justify p-6 rounded-[10px] mb-8">
                    <h3 className='text-md md:text-xl font-semibold mb-2 text-black'>{index+1}. {item.title}</h3>
                    <p className='text-[15px] md:text-[16px]'>{item.desc}</p>
                </div>
            )
        })}
        <div className="shadow bg-[#FFFBEB] border border-[#FEF3C7] text-gray-600 text-justify p-6 rounded-[10px] mb-8">
          <p className='text-[15px] md:text-[16px] text-[#78350F]'>Dengan menggunakan FindEra, Anda mengakui bahwa Anda telah membaca, memahami, dan setuju untuk terikat dengan Syarat dan Ketentuan ini.</p>
        </div>
        <div className="mt-14">
          <Cta />
        </div>
      </div>
    </section>
  )
}

export default SyaratKetentuan