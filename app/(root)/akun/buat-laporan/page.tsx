import React from 'react'
import AccountProfile from '../_components/account'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: "Buat Laporan Baru | FindEra"
}

const CreateReport = () => {
  return (
    <section className="py-10">
      <div className="mx-auto px-5 md:px-15">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="account col-span-4 md:col-span-1 order-2 md:order-1">
            <AccountProfile />
          </div>
          <div className="report col-span-4 md:col-span-3 mb-8 order-1 md:order-2">

          </div>
        </div>
      </div>
    </section>
  )
}

export default CreateReport