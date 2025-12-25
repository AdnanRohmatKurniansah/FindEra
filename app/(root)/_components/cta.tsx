import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'

const Cta = () => {
  return (
    <div className="relative p-8 mb-8 md:mb-16 text-black">
        <div className="absolute top-0 rounded-full left-10 w-[15px] md:w-[40px] h-[15px] md:h-[40px] bg-[#18b18a]"></div>
        <div className="absolute bottom-5 rounded-full left-10 md:left-40 w-[20px] md:w-[30px] h-[20px] md:h-[30px] bg-[#9cefda]"></div>
        <div className="absolute bottom-10 rounded-full right-20 w-[10px] md:w-[30px] h-[10px] md:h-[30px] bg-[#18b18a]"></div>
        <div className="absolute -top-0 md:-top-5 rounded-full right-10 md:right-40 w-[30px] md:w-[30px] h-[30px] md:h-[30px] bg-[#9cefda]"></div>
        <div className="relative text-center">
            <h1 className="text-[21px] font-bold mb-3">Bergabung dengan Kami</h1>
            <div className="flex justify-center">
              <p className="text-[15px] text-gray-600 md:text-[17px] max-w-3xl">
                Jadilah bagian dari komunitas yang membantu ribuan orang menemukan kembali barang berharga mereka. Bersama, kita bisa membuat perbedaan.
              </p>
            </div>
            <Button className='mt-4 md:mt-6 px-4 md:px-8 py-5'>
              <Link className="group" href={'/masuk'}>Mulai Sekarang</Link>
            </Button>
        </div>
    </div>
  )
}

export default Cta