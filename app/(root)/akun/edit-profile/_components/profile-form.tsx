'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import ProfileFormSkeleton from './profile-form-skeleton'
import AvatarForm from './avatar-form'
import { useProfile, useUpdateProfile } from '@/hooks/useProfiles'
import { useAuth } from '@/providers/user-provider'
import { zodResolver } from '@hookform/resolvers/zod'
import { profileUpdateSchema } from '@/lib/validations/profile-validation'
import { useForm } from 'react-hook-form'
import z from 'zod'
import Spinner from '@/components/ui/spinner'
import { profileData } from '@/types'
import { toast } from 'sonner'

type UpdateProfilePayload = Partial<Omit<profileData, "id_user" | "created_at">>
type updateProfileData = z.infer<typeof profileUpdateSchema>

const ProfileForm = () => {
  const { user } = useAuth()
  const { data, isLoading } = useProfile()
  const profile = data ?? null

  const { register, handleSubmit, reset, formState: {errors} } = useForm<updateProfileData>({
    resolver: zodResolver(profileUpdateSchema),
  })

  const updateMutation = useUpdateProfile()

  const submitProfile = async (data: UpdateProfilePayload) => {
    updateMutation.mutate(data, {
      onSuccess: () => {
        toast.success("Profile berhasil diperbarui")
      },
      onError: (err) => {
        toast.error(err.message || "Gagal memperbarui profile")
      },
    })
  }

  if (isLoading) return <ProfileFormSkeleton />

  return (
    <div className="border shadow-md rounded-md bg-white">
      <div className="p-4">
        <h3 className="font-semibold text-xl mb-1">Profile Umum</h3>
        <p className="text-gray-500 text-sm">
          Perbarui foto dan detail pribadi anda
        </p>
      </div>
      <Separator />
      <div className="avatar">
        <AvatarForm profile={profile} user={user} loading={false} />
      </div>
      <Separator />
      <form onSubmit={handleSubmit(submitProfile)}>
        <div className="p-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className='col-span-2'>
                <Label className='mb-3'>Nama Lengkap</Label>
                <Input {...register("name")} defaultValue={profile?.name} />
                {errors.name && (
                  <p className="text-red-600 text-[13px] mt-1 mb-0 pb-0">{errors.name?.message}</p>
                )}
            </div>
            <div className='col-span-2 md:col-span-1'>
                <Label className='mb-3'>Email</Label>
                <Input value={user?.email} readOnly />
            </div>
            <div className='col-span-2 md:col-span-1'>
                <Label className='mb-3'>Nomer Telp</Label>
                <Input {...register("phone")} defaultValue={profile?.phone || ''} />
                {errors.phone && (
                  <p className="text-red-600 text-[13px] mt-1 mb-0 pb-0">{errors.phone?.message}</p>
                )}
            </div>
            </div>
        </div>
        <Separator />
        <div className="flex justify-end gap-2 p-4">
            <Button
              variant="ghost"
              type="button"
              onClick={() => reset()}
              disabled={updateMutation.isPending}
            >Cancel</Button>
            <Button type="submit" disabled={updateMutation.isPending}>
              Simpan perubahan {updateMutation.isPending && <span className="ml-2"><Spinner /></span>}
            </Button>
        </div>
      </form>
    </div>
  )
}

export default ProfileForm
