"use client"

import { getCurrentUser } from "@/service/authService"
import { User } from "@supabase/supabase-js"
import { createContext, useContext, useEffect, useState } from "react"

type AuthContextType = {
  user: User | null
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    const fetchUser = async () => {
      try {
        const res = await getCurrentUser()
        if (mounted) setUser(res.user ?? null)
      } finally {
        if (mounted) setIsLoading(false)
      }
    }

    fetchUser()

    return () => {
      mounted = false
    }
  }, [])

  return (
    <AuthContext.Provider value={{ user, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
