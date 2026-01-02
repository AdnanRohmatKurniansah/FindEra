import { Metadata } from 'next';
import NavigationSide from '../_components/nav-side';
import ProfileForm from './_components/profile-form';

export const metadata: Metadata = {
    title: "Edit Profile | FindEra"
}

const EditProfile = () => {
  return (
    <section className="pt-5 pb-10 md:py-10">
      <div className="mx-auto px-5 md:px-15">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="nav-side col-span-4 md:col-span-1 order-2 md:order-1">
            <NavigationSide />
          </div>
          <div className="activity col-span-4 md:col-span-3 mb-5 md:mb-8 order-1 md:order-2">
            <ProfileForm />
          </div>
        </div>
      </div>
    </section>
  )
}

export default EditProfile