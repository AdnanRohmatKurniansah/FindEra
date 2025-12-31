import { createClientSupabase } from "@/lib/supabase/client"
import { extractStoragePath, removeFile, uploadFile } from "@/lib/supabase/storage"
import { createReportData, updateReportData } from "@/types"
import { getMyProfile } from "./profileService"
import { generateRandomString } from "@/lib/utils"

const BUCKET = "findera_bucket"
const FOLDER = "items_upload"

export const getReports = async (page = 1, limit = 6, 
  filters?: {
  status?: string | null
  category?: string | null 
  search?: string | null 
}) => {
    
  let query = createClientSupabase()
    .from("items")
    .select(
      `
        id,
        id_user,
        title,
        description,
        location_text,
        latitude,
        longitude,
        status,
        image_url,
        report_date,
        created_at,
        updated_at,
        profiles ( id, name, image ),
        categories!inner ( id, name )
      `,
      { count: "exact" }
    )
    .order("created_at", { ascending: false })

  if (filters?.status) {
    query = query.eq("status", filters.status)
  }
  
  if (filters?.category?.trim()) {
    query = query.ilike("categories.name", `%${filters.category.trim()}%`)
  }

  if (filters?.search?.trim()) {
    query = query.or(
      `title.ilike.%${filters.search.trim()}%,description.ilike.%${filters.search.trim()}%`
    )
  }

  const from = (page - 1) * limit
  const to = from + limit - 1

  const { data, error, count } = await query.range(from, to)


  if (error) throw error

  return {
    data,
    total: count ?? 0,
    page,
    limit,
  }
}

export const findReport = async (id_item: string) => {
  const { data, error } = await createClientSupabase()
    .from("items")
    .select(`
        id,
        id_user,
        id_category,
        title,
        description,
        location_text,
        latitude,
        longitude,
        status,
        image_url,
        report_date,
        created_at,
        updated_at,
        profiles ( id, name, image, created_at ),
        categories!inner ( id, name )
    `)
    .eq("id", id_item)
    .single()

  if (error) throw error

  return data
}

export const createReport = async (payload: createReportData) => {
  try {
    const profile = await getMyProfile()

    const file = payload.image_url[0] 
    if (!file) throw new Error("File tidak ditemukan")
  
    const fileExt = file.name.split(".").pop()
    const randomName = generateRandomString(16)
    const fileName = `${randomName}-${Date.now()}.${fileExt}`
    const filePath = `${FOLDER}/${fileName}`
  
    const image_url = await uploadFile(BUCKET, filePath, file)
  
    const { error } = await createClientSupabase().from("items").insert({
      id_user: profile.id,
      title: payload.title,
      description: payload.description,
      id_category: payload.id_category,
      location_text: payload.location_text,
      latitude: payload.latitude,
      longitude: payload.longitude,
      status: payload.status,
      image_url,
      report_date: payload.report_date,
    })
  
    if (error) throw error
  } catch (error) {
    throw error instanceof Error
      ? error
      : new Error("Gagal membuat laporan")
  }
}

export const updateReport = async (id_item: string, payload: createReportData) => {
  try {
    const profile = await getMyProfile()

    const { data: oldReport, error: oldError } = await createClientSupabase()
      .from("items")
      .select("image_url")
      .eq("id", id_item)
      .eq("id_user", profile.id)
      .single() 

    if (oldError) throw oldError

    let image_url: string | undefined = undefined

    const file = payload.image_url?.[0]
    if (file) {
      const fileExt = file.name.split(".").pop()
      const randomName = generateRandomString(16)
      const fileName = `${randomName}-${Date.now()}.${fileExt}`
      const filePath = `${FOLDER}/${fileName}`

      image_url = await uploadFile(BUCKET, filePath, file)
      
      if (oldReport?.image_url) {
        const oldPath = extractStoragePath(oldReport.image_url, BUCKET)
        if (oldPath) {
          await removeFile(BUCKET, [oldPath])
        }
      }
    }

    const updateData: Partial<updateReportData> = {
      title: payload.title,
      description: payload.description,
      id_category: payload.id_category,
      location_text: payload.location_text,
      latitude: payload.latitude,
      longitude: payload.longitude,
      status: payload.status,
      report_date: payload.report_date,
    }

    if (image_url) {
      updateData.image_url = image_url
    }

    const { data, error } = await createClientSupabase()
      .from("items")
      .update(updateData)
      .eq("id", id_item)
      .eq("id_user", profile.id) 

    if (error) throw error

    return data
  } catch (error) {
    throw error instanceof Error
      ? error
      : new Error("Gagal mengupdate laporan")
  }
}

export const deleteReport = async (id_item: string) => {
  try {
    const profile = await getMyProfile()

    const { data: createReportData, error: errorReport } = await createClientSupabase()
      .from("items")
      .select("*")
      .eq("id", id_item)
      .eq("id_user", profile.id)
      .single() 

    if (errorReport) throw errorReport

    if (createReportData?.image_url) {
      const oldPath = extractStoragePath(createReportData.image_url, BUCKET)    
      if (oldPath) {
        await removeFile(BUCKET, [oldPath])
      }
    }

    const { error } = await createClientSupabase()
      .from("items")
      .delete()
      .eq("id", id_item)
      .eq("id_user", profile.id)

    if (error) throw error
  } catch (error) {
    throw error instanceof Error ? error : new Error("Gagal menghapus data laporan")
  }
}

export const getMyReports = async () => {
  try {
    const profile = await getMyProfile()

    const { data, error } = await createClientSupabase()
      .from("items")
      .select(`
        id,
        id_user,
        title,
        description,
        location_text,
        latitude,
        longitude,
        status,
        image_url,
        report_date,
        created_at,
        updated_at,
        profiles ( id, name, image ),
        categories!inner ( id, name )
      `)
      .eq("id_user", profile.id)
      .order("created_at", { ascending: false })

    if (error) throw error

    return data
  } catch (error) {
    throw error instanceof Error ? error : new Error("Gagal mengambil data laporan")
  }
}

export const findMyReport = async (id_item: string) => {
  const profile = await getMyProfile()

  const { data, error } = await createClientSupabase()
    .from("items")
    .select(`
      id,
      title,
      description,
      id_category,
      location_text,
      latitude,
      longitude,
      status,
      image_url,
      report_date,
      created_at,
      updated_at
    `)
    .eq("id", id_item)
    .eq("id_user", profile.id) 
    .single()

  if (error) throw error

  return data
}
