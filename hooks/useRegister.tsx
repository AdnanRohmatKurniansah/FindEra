"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { loginWithGoogle, registerEmail } from "@/service/authService"
import { toast } from "sonner"
import { registerSchema } from "@/lib/validations/auth-validation"
import z from "zod"

type RegisterFormData = z.infer<typeof registerSchema>

export function useRegisterActions() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false)

  const signupEmail = async (data: RegisterFormData) => {
    setIsSubmitting(true)

    try {
      const { error } = await registerEmail(data)
      if (error) {
        toast.error(error)
        return
      }

      toast.success("Register berhasil, Silahkan cek email anda")
      router.push("/sign-up")
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error("Register gagal")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const signupGoogle = async () => {
    setIsGoogleSubmitting(true)

    try {
      const { error } = await loginWithGoogle()
      if (error) throw error
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error("Register Google gagal")
      }
      setIsGoogleSubmitting(false)
    }
  }

  return {
    signupEmail,
    signupGoogle,
    isSubmitting,
    isGoogleSubmitting
  }
}
