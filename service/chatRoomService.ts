import { createClientSupabase } from '@/lib/supabase/client'

export const getOrCreateChatRoom = async (myProfileId: string, otherProfileId: string) => {
  const { data: existingRoom } = await createClientSupabase()
    .from('chat_rooms')
    .select('id')
    .or(
      `and(profile_a.eq.${myProfileId},profile_b.eq.${otherProfileId}),and(profile_a.eq.${otherProfileId},profile_b.eq.${myProfileId})`
    )
    .maybeSingle()

  if (existingRoom) return existingRoom.id

  const { data: newRoom, error } = await createClientSupabase()
    .from('chat_rooms')
    .insert({
      profile_a: myProfileId,
      profile_b: otherProfileId
    })
    .select('id')
    .single()

  if (error) throw error

  return newRoom.id
}
