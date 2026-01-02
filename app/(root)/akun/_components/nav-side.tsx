'use client'

import { Button } from '@/components/ui/button'
import { LogOut, Settings, User } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { logout } from '@/service/authService'

const menu = [
  {
    label: 'Profile Umum',
    url: '/akun/edit-profile',
    icon: User,
  },
  {
    label: 'Ubah Password',
    url: '/akun/ubah-password',
    icon: Settings,
  }
]

const NavigationSide = () => {
  const pathname = usePathname()

  const handleLogout = async () => {
    const { error } = await logout()
    if (!error) {
      window.location.href = '/sign-in'
    }
  }

  return (
    <div className="border shadow-md rounded-md p-4 mb-10 md:mb-4">
      <h2 className="font-semibold text-lg mb-4">Informasi Akun</h2>

      <div className="space-y-3">
        {menu.map((item) => {
          const isActive = pathname === item.url
          const Icon = item.icon

          return (
            <Button
              key={item.url}
              className={`w-full border shadow-md justify-start ${
                isActive
                  ? 'bg-primary text-white hover:bg-primary/90'
                  : 'text-primary hover:text-primary'
              }`}
              variant={isActive ? 'default' : 'outline'}
              asChild
            >
              <Link href={item.url} className="flex items-center w-full">
                <Icon className="w-5 mr-2" />
                {item.label}
              </Link>
            </Button>
          )
        })}

        <Button
          className="w-full border shadow-md justify-start text-primary hover:text-primary"
          variant="outline"
          onClick={handleLogout}
        >
          <div className="flex items-center w-full">
            <LogOut className="w-5 mr-2" />
            Logout
          </div>
        </Button>
      </div>
    </div>
  )
}

export default NavigationSide
