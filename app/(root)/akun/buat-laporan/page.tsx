import React from 'react'
import AccountProfile from '../_components/account'
import { Metadata } from 'next'
import ReportForm from './_components/report-form'

export const metadata: Metadata = {
    title: "Buat Laporan Baru | FindEra"
}

const CreateReport = () => {
  return (
    <section className="pt-5 pb-10 md:py-10">
      <div className="mx-auto px-5 md:px-15">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="account relative mb-8 md:mb-0 md:sticky md:top-22 h-fit col-span-4 md:col-span-1 order-2 md:order-1">
            <AccountProfile />
          </div>
          <div className="report col-span-4 md:col-span-3 mb-5 md:mb-8 order-1 md:order-2">
            <ReportForm />
          </div>
        </div>
      </div>
    </section>
  )
}

export default CreateReport