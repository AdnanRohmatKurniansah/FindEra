import { createClientSupabase } from "@/lib/supabase/client"
import { extractStoragePath, removeFile, uploadFile } from "@/lib/supabase/storage"
import { changePasswordData, profileData } from "@/types"

const BUCKET = "findera_bucket"
const FOLDER = "avatar_upload"

type UpdateProfilePayload = Partial<Omit<profileData, "id_user" | "created_at">>

export const getMyProfile = async () => {
  const { data: { user } } = await createClientSupabase().auth.getUser()

  if (!user) return null

  const { data: profile, error } = await createClientSupabase()
    .from("profiles")
    .select("*")
    .eq("id_user", user.id)
    .single()

  if (error) throw error

  return profile
}

export const updateDataProfile = async (profileData: UpdateProfilePayload) => {
  const { data: { user } } = await createClientSupabase().auth.getUser()
  if (!user) throw new Error("Silahkan login dahulu")

  const { data: profile, error } = await createClientSupabase()
    .from("profiles")
    .update(profileData)
    .eq("id_user", user.id)
    .select()
    .single()

  if (error) throw error

  return profile
}

export const updateAvatarProfile = async (file: File) => {
  try {
    const profile = await getMyProfile()

    if (!profile) {
      throw new Error("Silahkan login terlebih dahulu")
    }

    const fileExt = file.name.split(".").pop()
    const fileName = `${profile.id}.${fileExt}`
    const filePath = `${FOLDER}/${fileName}`
    
    if (profile?.image) {
      const oldPath = extractStoragePath(profile.image, BUCKET)
      if (oldPath) {
        await removeFile(BUCKET, [oldPath])
      }
    }

    const publicUrl = await uploadFile(BUCKET, filePath, file, { upsert: true })

    const { error } = await createClientSupabase()
      .from("profiles")
      .update({ image: publicUrl })
      .eq("id_user", profile.id_user)

    if (error) throw error

    return publicUrl

  } catch (error) {
    throw error instanceof Error
      ? error
      : new Error("Gagal memperbarui avatar")
  }
}

export const deleteAvatarProfile = async () => {
  try {
    const profile = await getMyProfile()

    if (!profile) {
      throw new Error("Silahkan login terlebih dahulu")
    }

    if (profile?.image) {
      const oldPath = extractStoragePath(profile.image, BUCKET)
      if (oldPath) {
        await removeFile(BUCKET, [oldPath])
      }
    }

    const { error } = await createClientSupabase()
      .from("profiles")
      .update({ image: null })
      .eq("id_user", profile.id_user)

    if (error) throw error

  } catch (error) {
    throw error instanceof Error
      ? error
      : new Error("Gagal menghapus avatar")
  }
}

export const changePassword = async (data: changePasswordData) => {
  const { data: { user }, error } = await createClientSupabase().auth.getUser()
  if (!user) throw new Error("Silahkan login dahulu")
  if (user.app_metadata.provider !== "email") throw new Error("Akun Google tidak bisa ubah password")

  try {
    const { error: loginError } = await createClientSupabase().auth.signInWithPassword({
      email: user.email!,
      password: data.old_password
    })

    if (loginError) throw new Error("Password lama salah")

    const { error: updateError } = await createClientSupabase().auth.updateUser({
      password: data.new_password
    })

    if (updateError) throw updateError

    return true
  } catch (err) {
    if (err instanceof Error) throw err
    throw new Error("Gagal memperbarui password")
  }
}