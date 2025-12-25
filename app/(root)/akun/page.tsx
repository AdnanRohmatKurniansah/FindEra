import { Metadata } from 'next'
import AccountProfile from './_components/account'
import Activity from './_components/activity'

export const metadata: Metadata = {
  title: "Profile Akun | FindEra"
}

const Page = () => {
  return (
    <section className="py-10">
      <div className="mx-auto px-5 md:px-15">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="profile col-span-4 md:col-span-1">
            <AccountProfile />
          </div>
          <div className="activity col-span-4 md:col-span-3 mb-8">
            <Activity />
          </div>
        </div>
      </div>
    </section>
  )
}

export default Page