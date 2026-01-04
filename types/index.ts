import { User } from "@supabase/supabase-js"

export type registerData = {
    name: string
    email: string
    password: string
}

export type loginData = {
    email: string
    password: string
}

export type profileData = {
    id_user: string
    name: string
    phone: string | null
    image: string | null
    created_at: string
}


export interface UserContextType {
  user: User | null
  profile: profileData | null
  loading: boolean
}

export type changePasswordData = {
    new_password: string
    old_password: string
}

export type createReportData = {
    title: string
    description: string
    id_category: string
    location_text: string
    latitude: number
    longitude: number
    status: string
    image_url: FileList
    report_date: string
}

export type updateReportData = {
    title: string
    description: string
    id_category: string
    location_text: string
    latitude: number
    longitude: number
    status: string
    report_date: string
    image_url: string
}

export type itemUser = {
  id?: string
  name?: string
  image?: string | null
  created_at?: string
}

export type itemData = {
  id: string
  id_user: string
  title: string
  description: string
  location_text: string
  latitude: number
  longitude: number
  status: string
  image_url: string
  report_date: string
  created_at: string
  updated_at: string
  profiles?: itemUser | itemUser[] | null
}

export type chatMessage = {
  id: string
  sender_id: string
  receiver_id: string
  message: string | null
  image_url: string | null
  is_read: boolean
  created_at: string
}
