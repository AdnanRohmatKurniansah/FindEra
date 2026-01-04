"use client"

import Image from "next/image"
import { Check, Lock, Mail, Phone, Star, Verified } from "lucide-react"
import { formatMonthYear } from "@/lib/utils"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import AccountProfileSkeleton from "./account-skeleton"
import { useProfile } from "@/hooks/useProfiles"
import { useAuth } from "@/providers/user-provider"

const AccountProfile = () => {
  const { user } = useAuth()
  const { data: profile, isLoading } = useProfile()

  if (isLoading) return <AccountProfileSkeleton />
  if (!user || !profile) return <p className="text-center text-gray-500">Profile belum tersedia</p>

  const avatarUrl = profile.image || "/images/avatar.png"

  return (
    <>
        <div className="border shadow-md rounded-md p-4 mb-5 md:mb-8">
            <div className="relative mt-4 flex justify-center">
                <Image  
                src={avatarUrl}
                alt="User Avatar"
                width={80}
                height={80}
                className="rounded-full object-cover"
                />
                <div className="absolute flex justify-center items-center bottom-0 right-18 w-5 h-5 rounded-full bg-green-500">
                    <Check className="w-4 text-white" />
                </div>
            </div>
            <div className="text-center mt-3">
                <h2 className="font-semibold text-lg">{profile.name}</h2>
                <h4 className="font-normal text-gray-600 text-md">
                Member Sejak {formatMonthYear(profile.created_at)}
                </h4>
                <Button className="mt-3 w-full" asChild>
                    <Link href="/akun/edit-profile">Edit Profile</Link>
                </Button>
            </div>
        </div>
        <div className="border shadow-md rounded-md p-4 mb-4">
            <div className="flex justify-between items-center border-b pb-3">
                <h2 className="font-semibold text-lg">Reward Points</h2>
                <Star className="w-5 text-yellow-500" />
            </div>
            <div className="mt-4 text-center">
                <p className="text-3xl font-bold text-primary">{profile.points}</p>
                <p className="text-gray-600 text-sm mt-1">Total poin yang kamu miliki</p>
            </div>
        </div>
        <div className="border shadow-md rounded-md p-4 mb-4">
            <div className="text-start">
                <div className="flex justify-between border-b-2 pb-3">
                    <h2 className="font-semibold text-lg">Contact Information</h2>
                    <Lock className="w-5 text-blue-900" />
                </div>
                <div className="info pt-3">
                    <div className="mail mb-5 border-b-2 pb-3">
                        <h4 className="flex font-semibold text-primary text-md"><Mail className="w-5 mr-2" /> Email</h4>
                        <p className="mt-1">{user.email}</p>
                    </div>
                    <div className="phone mb-5 border-b-2 pb-3">
                        <h4 className="flex font-semibold text-primary text-md"><Phone className="w-5 mr-2" /> Phone</h4>
                        <p className="mt-1">{profile.phone ?? "-"}</p>
                    </div>
                    <div className="verified mb-5">
                        <h4 className="flex font-semibold text-primary text-md"><Verified className="w-5 mr-2" /> Verifikasi</h4>
                        <Badge className="mt-3">Identitas Terverifikasi</Badge>
                    </div>
                </div>
            </div>
        </div>
    </>
  )
}

export default AccountProfile
