"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { loginWithEmail, loginWithGoogle } from "@/service/authService"
import { toast } from "sonner"
import { loginSchema } from "@/lib/validations/auth-validation"
import z from "zod"

type LoginFormData = z.infer<typeof loginSchema>

export function useLoginActions() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false)

  const loginEmail = async (data: LoginFormData) => {
    setIsSubmitting(true)

    try {
      const { error } = await loginWithEmail(data)
      if (error) throw error

      toast.success("Login berhasil")
      router.push("/")
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error("Login gagal")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const loginGoogle = async () => {
    setIsGoogleSubmitting(true)

    try {
      const { error } = await loginWithGoogle()
      if (error) throw error
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error("Login Google gagal")
      }
      setIsGoogleSubmitting(false)
    }
  }

  return {
    loginEmail,
    loginGoogle,
    isSubmitting,
    isGoogleSubmitting
  }
}
