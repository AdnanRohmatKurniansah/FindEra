import { createClientSupabase } from "@/lib/supabase/client"
import { loginData, registerData } from "@/types"

export const registerEmail = async (credentials: registerData) => {
  try {
    const { data, error } = await createClientSupabase().auth.signUp({
      email: credentials.email,
      password: credentials.password,
      options: {
        data: { name: credentials.name },
        emailRedirectTo: `${window.location.origin}/sign-in`,
      },
    })

    if (!data.user) {
      return { data: null, error: "Gagal membuat user." }
    }

    const { error: profileError } = await createClientSupabase()
      .from("profiles")
      .insert({
        id_user: data.user.id,
        name: credentials.name,
      })

    if (profileError) {
      return { data: null, error: profileError.message }
    }

    return { data, error: null }

  } catch (err) {
    if (err instanceof Error) {
      return { data: null, error: err.message }
    }
    return { data: null, error: "Unexpected error" }
  }
}

export const loginWithEmail = async (credentials: loginData) => {
  try {
    const { data, error } = await createClientSupabase().auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password
    })

    if (error) throw error

    return { data, error: null }
  } catch (err) {
    if (err instanceof Error) {
      return { data: null, error: err.message }
    }
    return { data: null, error: "Unexpected error" }
  }
}

export const getCurrentUser = async () => {
  try {
    const { data: { user }, error } = await createClientSupabase().auth.getUser()

    return { user, error }
  } catch (err) {
    if (err instanceof Error) {
      return { user: null, error: err.message }
    }
    return { user: null, error: "Unexpected error" }
  }
}

export const logout = async () => {
  const { error } = await createClientSupabase().auth.signOut()

  return { error }
}

export const loginWithGoogle = async () => {
  try {
    const { data, error } = await createClientSupabase().auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/api/auth/callback`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    })

    if (error) throw error

    return { data, error: null }
  } catch (error) {
    return { data: null, error }
  }
}
