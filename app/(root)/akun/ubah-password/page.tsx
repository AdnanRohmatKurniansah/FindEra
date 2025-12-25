import { Metadata } from 'next';
import NavigationSide from '../_components/nav-side';
import ChangePasswordForm from './_components/changePassword-form';

export const metadata: Metadata = {
    title: "Ubah Password | FindEra"
}

const EditProfile = () => {
  return (
    <section className="py-10">
      <div className="mx-auto px-5 md:px-15">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="nav-side col-span-4 md:col-span-1 order-2 md:order-1">
            <NavigationSide />
          </div>
          <div className="password col-span-4 md:col-span-3 mb-8 order-1 md:order-2">
            <ChangePasswordForm />
          </div>
        </div>
      </div>
    </section>
  )
}

export default EditProfile