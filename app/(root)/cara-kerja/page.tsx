import { Button } from "@/components/ui/button"
import {
  MapPin,
  Search,
  MessageCircle,
  CheckCircle,
  CheckSquareIcon,
} from "lucide-react"
import { Metadata } from "next"
import React from "react"
import Cta from "../_components/cta"

export const metadata: Metadata = {
  title: "Cara Kerja | Findera",
}

const how = [
  {
    step: 1,
    icon: MapPin,
    title: "Laporkan Barang",
    desc: "Upload foto barang yang hilang atau ditemukan, tulis deskripsi detail, dan tandai lokasi di peta.",
    points: [
      "Upload foto yang jelas",
      "Deskripsi detail",
      "Tandai lokasi yang tepat",
    ],
    color: "bg-emerald-600",
  },
  {
    step: 2,
    icon: Search,
    title: "Pencarian & Filter",
    desc: "Temukan barang dengan cepat menggunakan filter kategori, lokasi, dan tanggal.",
    points: [
      "Filter berdasarkan kategori",
      "Radius pencarian",
      "Urutkan berdasarkan tanggal",
    ],
    color: "bg-blue-600",
  },
  {
    step: 3,
    icon: MessageCircle,
    title: "Hubungi & Verifikasi",
    desc: "Chat langsung dengan pemilik atau penemu untuk memastikan keaslian barang.",
    points: [
      "Tanya ciri spesifik",
      "Verifikasi kepemilikan",
      "Atur waktu bertemu",
    ],
    color: "bg-purple-600",
  },
  {
    step: 4,
    icon: CheckCircle,
    title: "Barang Dikembalikan",
    desc: "Bertemu di tempat aman, kembalikan barang, dan tandai laporan sebagai selesai.",
    points: [
      "Bertemu di tempat publik",
      "Verifikasi barang",
      "Berikan rating & feedback",
    ],
    color: "bg-green-600",
  },
]

const HowItWork = () => {
  return (
    <section className="pt-5 pb-10 md:py-10">
      <div className="mx-auto px-5 md:px-15">
        <div className="relative mb-12 rounded-2xl bg-gradient-to-r from-[#007f5f] via-[#18b18a] to-[#30d3aa] p-8 text-white overflow-hidden">
          <div className="absolute inset-0 bg-black/10" />
          <div className="relative">
            <h1 className="text-2xl md:text-3xl font-bold mb-3">
              Bagaimana Findera Bekerja
            </h1>
            <p className="max-w-2xl text-sm md:text-lg">
              Proses sederhana dan aman untuk menemukan kembali barang hilang
              hanya dalam beberapa langkah.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {how.map((item) => {
            const Icon = item.icon
            return (
              <div key={item.step} className="relative rounded-xl border bg-white p-5 md:p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
                <div className="flex items-start gap-4">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${item.color}`}>
                    <Icon className="text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-500">
                      Langkah {item.step}
                    </p>
                    <h3 className="text-lg font-bold mt-1">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm text-gray-600">
                      {item.desc}
                    </p>
                    <ul className="mt-3 space-y-1 text-sm text-gray-600">
                      {item.points.map((point, idx) => (
                        <li className="flex items-center" key={idx}><CheckSquareIcon className="w-4 mr-2 text-green-600"/> {point}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        <div className="mt-14">
          <Cta />
        </div>
      </div>
    </section>
  )
}

export default HowItWork
