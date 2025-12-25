import { Button } from '@/components/ui/button'
import { UserContextType } from '@/types'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { useUpdateAvatar, useDeleteAvatar } from '@/hooks/useProfiles'
import DeleteConfirmationDialog from '@/components/shared/delete-modal'
import { toast } from 'sonner'

const AvatarForm = ({ profile, user }: UserContextType) => {
  const avatarUrl = profile?.image || '/images/avatar.png'

  const inputRef = useRef<HTMLInputElement | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string>(avatarUrl)
  const [openDialog, setOpenDialog] = useState(false)

  const updateMutation = useUpdateAvatar()
  const deleteMutation = useDeleteAvatar()

  const loading = updateMutation.isPending || deleteMutation.isPending

  useEffect(() => {
    setPreview(avatarUrl)
  }, [avatarUrl])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f) return

    setFile(f)
    setPreview(URL.createObjectURL(f))
  }

  const handleSubmit = () => {
    if (!file) return alert("Pilih gambar dulu")
    updateMutation.mutate(file, {
      onSuccess: () => {
        toast.success("Berhasil mengupload foto")
        setFile(null)
      },
    })
  }

  const handleDelete = () => {
    deleteMutation.mutate(undefined, {
      onSuccess: () => {
        toast.success("Foto berhasil dihapus")
        setPreview('/images/avatar.png')
        setFile(null)
        setOpenDialog(false)
      },
    })
  }

  return (
    <form className="flex items-center gap-4 p-4" onSubmit={(e) => e.preventDefault()}>
      <div className="relative">
        <div className="cursor-pointer" onClick={() => inputRef.current?.click()}>
          <Image src={preview}
            alt="Avatar"
            width={64}
            height={64} className="rounded-full object-cover"/>
        </div>
        <input ref={inputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden"/>
      </div>

      <div className="flex-1">
        <p className="font-medium">{profile?.name || user?.email}</p>
        <p className="text-sm text-gray-500">{user?.email}</p>
        <div className="flex gap-2 mt-2">
          <Button size="sm"
            variant="secondary"
            type="button" onClick={handleSubmit} disabled={loading || !file}>
            {updateMutation.isPending ? "Menyimpan..." : "Ubah avatar"}
          </Button>

          <Button size="sm"
            variant="ghost" className="text-red-500 hover:text-red-600"
            type="button" onClick={() => setOpenDialog(true)} disabled={loading}>
            {deleteMutation.isPending ? "Menghapus..." : "Hapus"}
          </Button>
        </div>
      </div>

      <DeleteConfirmationDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onConfirm={handleDelete}
        isLoading={deleteMutation.isPending}/>
    </form>
  )
}

export default AvatarForm
