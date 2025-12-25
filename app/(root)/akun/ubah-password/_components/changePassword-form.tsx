'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { useChangePassword, useProfile, useUpdateProfile } from '@/hooks/useProfiles'
import { useAuth } from '@/providers/user-provider'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import z from 'zod'
import Spinner from '@/components/ui/spinner'
import { toast } from 'sonner'
import ProfileFormSkeleton from '../../edit-profile/_components/profile-form-skeleton'
import { useEffect } from 'react'
import { changePasswordSchema } from '@/lib/validations/auth-validation'
import { logout } from '@/service/authService'
import { useRouter } from 'next/navigation'

type changePasswordData = z.infer<typeof changePasswordSchema>

const ChangePasswordForm = () => {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  const { register, handleSubmit, reset, formState: { errors } } = useForm<changePasswordData>({
    resolver: zodResolver(changePasswordSchema)
  })

  const changePasswordMutation = useChangePassword()

  const submitChange = (data: changePasswordData) => {
    changePasswordMutation.mutate(data, {
      onSuccess: async () => {
        toast.success("Password berhasil diperbarui")
        await logout()
        router.replace("/sign-in")
      },
      onError: (err) => {
        toast.error(err.message || "Gagal memperbarui password")
      }
    })
  }

  useEffect(() => {
    if (!isLoading) {
      if (!user) router.replace("/sign-in")
      else if (user.app_metadata.provider !== "email") router.replace("/profile")
    }
  }, [user, isLoading, router])

  if (isLoading) return <ProfileFormSkeleton />

  return (
    <div className="border shadow-md rounded-md bg-white">
      <div className="p-4">
        <h3 className="font-semibold text-xl mb-1">Ubah Password</h3>
        <p className="text-gray-500 text-sm">Perbarui password akun anda</p>
      </div>
      <Separator />
      <form onSubmit={handleSubmit(submitChange)}>
        <div className="p-4 space-y-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className='col-span-2'>
            <Label className="mb-3">Email</Label>
            <Input defaultValue={user?.email} readOnly />
          </div>
          <div>
            <Label className="mb-3">Password Baru</Label>
            <Input {...register("new_password")} type="password" placeholder="Masukkan password baru" />
            {errors.new_password && <p className="text-red-600 text-[13px] mt-1">{errors.new_password.message}</p>}
          </div>
          <div>
            <Label className="mb-3">Password Lama</Label>
            <Input {...register("old_password")} type="password" placeholder="Masukkan password lama" />
            {errors.old_password && <p className="text-red-600 text-[13px] mt-1">{errors.old_password.message}</p>}
          </div>
        </div>
        <Separator />
        <div className="flex justify-end gap-2 p-4">
          <Button variant="ghost" type="button" onClick={() => reset()} disabled={changePasswordMutation.isPending}>
            Cancel
          </Button>
          <Button type="submit" disabled={changePasswordMutation.isPending}>
            Simpan {changePasswordMutation.isPending && <span className="ml-2"><Spinner /></span>}
          </Button>
        </div>
      </form>
    </div>
  )
}

export default ChangePasswordForm
