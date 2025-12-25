"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import Spinner from "@/components/ui/spinner"
import { loginSchema } from "@/lib/validations/auth-validation"
import z from "zod"
import { useLoginActions } from "../../../hooks/useLogin"

type loginFormData = z.infer<typeof loginSchema>

export default function LoginForm() {
  const {
    loginEmail,
    loginGoogle,
    isSubmitting,
    isGoogleSubmitting
  } = useLoginActions()

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<loginFormData>({
    resolver: zodResolver(loginSchema)
  })

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-8">
        <Link href="/">
          <Button variant="outline" className="shadow-sm">
            <ArrowLeft /> Kembali ke Home
          </Button>
        </Link>
        <div className="flex flex-1 items-center justify-center">
            <div className="w-full max-w-xs">
              <form onSubmit={handleSubmit(loginEmail)} className="flex flex-col">
                <div className="flex justify-center mb-3">
                  <Link href="/" className="flex items-center font-medium">
                    <Image src={'/images/logo.png?v=1'} width={0} height={0} sizes="100vw" className="h-14 w-auto" alt={'logo rebox'} />
                  </Link>
                </div>
                <div className="flex flex-col items-center gap-2 text-center mb-5">
                  <h1 className="text-2xl font-bold">Masuk ke akun Anda</h1>
                  <p className="text-muted-foreground text-sm text-balance">
                    Masukkan email untuk login ke akun Anda.
                  </p>
                </div>
                <div className="grid gap-3">
                  <div className="grid gap-3">
                    <Label htmlFor="email">Email</Label>
                    <Input {...register('email')} id="email" type="text" placeholder="Masukkan email anda"  />
                    {errors.email && (
                      <p className="text-red-600 text-[13px] mb-0 pb-0">{errors.email?.message}</p>
                    )}
                  </div>
                  <div className="grid gap-3">
                    <div className="flex items-center">
                      <Label htmlFor="password">Password</Label>
                    </div>
                    <Input {...register('password')} id="password" type="password" placeholder="Masukkan password anda"  />
                    {errors.password && (
                      <p className="text-red-600 text-[13px] mb-0 pb-0">{errors.password?.message}</p>
                    )}
                  </div>
                  <Button disabled={isSubmitting} className="w-full">
                    Masuk <span className='ml-2'>
                      {isSubmitting && <Spinner />}
                    </span>
                  </Button>

                  <Button type="button" variant="outline"disabled={isSubmitting || isGoogleSubmitting} onClick={loginGoogle} className="w-full">
                    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 48 48">
                      <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
                    </svg>
                    Masuk dengan Google {isGoogleSubmitting && <Spinner />}
                  </Button>
                </div>
                <p className="text-center mt-3 text-sm">Tidak punya akun?{" "}
                  <Link href="/sign-up" className="underline text-primary">
                    Daftar Sekarang
                  </Link>
                </p>
              </form>
            </div>
        </div>
      </div>
      <div className="relative hidden lg:block bg-muted">
        <Image
          src="/images/auth-img.jpg?v=1"
          alt="auth"
          fill
          className="object-cover"
        />
      </div>
    </div>
  )
}
