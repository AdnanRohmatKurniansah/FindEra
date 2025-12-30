import { createClientSupabase } from "@/lib/supabase/client"

export const getCategories = async () => {
  const { data: categories, error } = await createClientSupabase()
    .from("categories")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) throw error

  return categories
}