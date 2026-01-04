import { createClientSupabase } from '@/lib/supabase/client'
import { rewardConfirmClaim, rewardFindItem } from './rewardService'

export const getOrCreateChatRoom = async (myProfileId: string, otherProfileId: string, item_id: string) => {
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
      profile_b: otherProfileId,
      item_id
    })
    .select('id')
    .single()

  if (error) throw error

  return newRoom.id
}

export const fetchMessages = async (roomId: string) => {
  const { data, error } = await createClientSupabase()
    .from('private_messages')
    .select('*')
    .eq('room_id', roomId)
    .order('created_at', { ascending: true })

  if (error) throw error
  return data ?? []
}

export const sendTextMessage = async (
  roomId: string,
  senderId: string,
  receiverId: string,
  message: string
) => {
  const { error } = await createClientSupabase().from('private_messages').insert({
    room_id: roomId,
    sender_id: senderId,
    receiver_id: receiverId,
    message,
    image_url: null
  })

  if (error) throw error
}

export const sendImageMessage = async (
  roomId: string,
  senderId: string,
  receiverId: string,
  imageUrl: string,
  message: string
) => {
  const { error } = await createClientSupabase().from('private_messages').insert({
    room_id: roomId,
    sender_id: senderId,
    receiver_id: receiverId,
    image_url: imageUrl,
    message
  })

  if (error) throw error
}

export const deleteMessageById = async (id: string) => {
  const { error } = await createClientSupabase()
    .from('private_messages')
    .delete()
    .eq('id', id)

  if (error) throw error
}

export const fetchChatHistory = async (myProfileId: string) => {
  const { data, error } = await createClientSupabase()
    .from('chat_rooms')
    .select(`
      id,
      item_id,
      items:item_id ( id, status, title ),
      profile_a:profile_a ( id, name, image ),
      profile_b:profile_b ( id, name, image ),
      private_messages (
        id,
        sender_id,
        receiver_id,
        message,
        image_url,
        is_read,
        created_at
      )
    `)
    .or(`profile_a.eq.${myProfileId},profile_b.eq.${myProfileId}`)
    .order('created_at', { foreignTable: 'private_messages', ascending: false })

  if (error) throw error

  return data?.map(room => {
    const messages = room.private_messages ?? []
    const lastMessage = messages[0]
    const unreadCount = messages.filter(
      m => m.receiver_id === myProfileId && m.is_read == false
    ).length

    const item = Array.isArray(room.items) ? room.items[0] : room.items

    return {
      ...room,
      lastMessage,
      unreadCount,
      itemStatus: item?.status ?? null,
      itemTitle: item?.title ?? null
    }
  }) ?? []
}

export const markMessagesAsRead = async (roomId: string, myProfileId: string) => {
  const { data, error } = await createClientSupabase()
    .from('private_messages')
    .update({ is_read: true })
    .eq('room_id', roomId)
    .eq('receiver_id', myProfileId)
    .eq('is_read', false)
    .select()

  if (error) throw error
  
  return { 
    count: data?.length || 0,
    data 
  }
}

export const confirmFinishedWithClaim = async (itemId: string, otherProfileId: string) => {
  try {
    const { data: item, error: itemError } = await createClientSupabase()
      .from("items")
      .select("id, id_user, status")
      .eq("id", itemId)
      .single()

    if (itemError || !item) throw itemError || new Error("Item tidak ditemukan")

    let ownerId: string
    let finderId: string

    if (item.status === "hilang") {
      ownerId = item.id_user
      finderId = otherProfileId
    } else if (item.status === "ditemukan") {
      finderId = item.id_user
      ownerId = otherProfileId
    } else {
      throw new Error("Item tidak bisa diklaim")
    }

    const { error: updateError } = await createClientSupabase()
      .from("items")
      .update({ status: "diklaim" })
      .eq("id", itemId)

    if (updateError) throw updateError

    const { error: insertClaimError } = await createClientSupabase().from("claims").insert({
      item_id: itemId,
      owner_id: ownerId,
      finder_id: finderId,
    })

    if (insertClaimError) throw insertClaimError  

    await rewardFindItem(itemId, 10, finderId)
    await rewardConfirmClaim(itemId, 2, ownerId)

    return true
  } catch (err) {
    throw err
  }
}

