import { Metadata } from 'next'
import AccountProfile from '../../_components/account'
import ReportEditForm from './_components/report-edit-form'

export const metadata: Metadata = {
    title: "Edit Laporan | FindEra"
}

interface Params {
  params: Promise<{
    id: string
  }>
}

const EditReport = async ({ params }: Params) => {
  const { id } = await params
  return (
    <section className="py-10">
      <div className="mx-auto px-5 md:px-15">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="account relative md:sticky md:top-22 h-fit col-span-4 md:col-span-1 order-2 md:order-1">
            <AccountProfile />
          </div>
          <div className="report col-span-4 md:col-span-3 mb-8 order-1 md:order-2">
            <ReportEditForm id_item={id} />
          </div>
        </div>
      </div>
    </section>
  )
}

export default EditReport