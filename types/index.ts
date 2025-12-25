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