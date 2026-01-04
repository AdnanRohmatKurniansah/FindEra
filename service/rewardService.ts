import { createClientSupabase } from "@/lib/supabase/client"

export const rewardFindItem = async (itemId: string, rewardAmount: number, finderId: string) => {
  try {
    const { error: insertError } = await createClientSupabase()
      .from("reward_points")
      .insert({
        id_user: finderId,
        points: rewardAmount,
        reason: "Menemukan item",
        item_id: itemId,
      })

    if (insertError) throw insertError

    const { data: profile, error: fetchError } = await createClientSupabase()
      .from("profiles")
      .select("points")
      .eq("id", finderId)
      .single()

    if (fetchError) throw fetchError

    const currentPoints = profile?.points ?? 0

    const { error: updateError } = await createClientSupabase()
      .from("profiles")
      .update({ points: currentPoints + rewardAmount })
      .eq("id", finderId)

    if (updateError) throw updateError

  } catch (error) {
    throw error
  }
}

export const rewardConfirmClaim = async (itemId: string, rewardAmount: number, ownerId: string) => {
  try {
    const { error: insertError } = await createClientSupabase()
      .from("reward_points")
      .insert({
        id_user: ownerId,
        points: rewardAmount,
        reason: "Mengonfirmasi klaim item",
        item_id: itemId,
      })

    if (insertError) throw insertError

    const { data: profile, error: fetchError } = await createClientSupabase()
      .from("profiles")
      .select("points")
      .eq("id", ownerId)
      .single()

    if (fetchError) throw fetchError

    const currentPoints = profile?.points ?? 0

    const { error: updateError } = await createClientSupabase()
      .from("profiles")
      .update({ points: currentPoints + rewardAmount })
      .eq("id", ownerId)

    if (updateError) throw updateError

  } catch (error) {
    throw error
  }
}

export const fetchRewardHistory = async (userId: string) => {
  const { data, error } = await createClientSupabase()
    .from("reward_points")
    .select(`
      id,
      points,
      reason,
      created_at,
      items:item_id(id, title, image_url, status)
    `)
    .eq("id_user", userId)
    .order("created_at", { ascending: false })

  if (error) throw error

  return data || []
}