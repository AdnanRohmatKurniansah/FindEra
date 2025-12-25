'use client'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { LogOut, Settings, User } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { logout } from "@/service/authService"
import { useProfile } from "@/hooks/useProfiles"

export default function UserDropdown() {
  const { data: profile } = useProfile()

  if (!profile) return null

  const avatarUrl = profile?.image || '/images/avatar.png';
  const displayName = profile?.name

  const handleLogout = async () => {
    const { error } = await logout()

    if (!error) {
        window.location.href = '/sign-in'
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-10 w-10 rounded-full p-0">
          <Image
            src={avatarUrl}
            alt="User Avatar"
            width={40}
            height={40}
            className="rounded-full object-cover"
          />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel className="truncate">
          {displayName}
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link href="/akun" className="flex gap-2">
            <User className="w-4 h-4" /> Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/akun/ubah-password" className="flex gap-2">
            <Settings className="w-4 h-4" /> Ubah Password
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleLogout}
          className="cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
