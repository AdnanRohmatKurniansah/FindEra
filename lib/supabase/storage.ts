import { createClientSupabase } from "@/lib/supabase/client"

export const uploadFile = async (
  bucket: string,
  path: string,
  file: File,
  options?: { upsert?: boolean }
) => {
  const supabase = createClientSupabase()

  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    upsert: options?.upsert ?? true,
  })

  if (error) throw error

  const { data } = supabase.storage.from(bucket).getPublicUrl(path)

  if (!data?.publicUrl) throw new Error("Failed to get public URL")

  return data.publicUrl
}

export const removeFile = async (bucket: string, paths: string[]) => {
  const supabase = createClientSupabase()

  const { error } = await supabase.storage.from(bucket).remove(paths)
  if (error) throw error
}

export const extractStoragePath = (publicUrl: string, bucket: string) => {
  const marker = `/object/public/${bucket}/`
  const index = publicUrl.indexOf(marker)
  if (index === -1) return null
  return publicUrl.substring(index + marker.length)
}

