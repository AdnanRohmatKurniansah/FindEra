'use client'

import { Input } from "@/app/components/ui/input"
import { Button } from "@/app/components/ui/button"
import { Label } from "@/app/components/ui/label"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft } from "lucide-react"
import z from "zod"
import { registerSchema } from "@/app/validations/auth-validation"
import { useForm } from "react-hook-form"
import { zodResolver  } from '@hookform/resolvers/zod'
import { useState } from "react"
import { useRouter } from "next/navigation"
import Spinner from "@/app/components/ui/spinner"
import { registerEmail } from "@/app/service/authService"
import { toast } from "sonner"

type validateRegister = z.infer<typeof registerSchema>

const RegisterPage = () => {
  const { register, handleSubmit, formState: {errors}} = useForm<validateRegister>({
    resolver: zodResolver(registerSchema)
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const registerHandle = async (formData: validateRegister) => {
    setIsSubmitting(true)

    const { data, error } = await registerEmail(formData)

    if (error) {
      toast.error('Registrasi Gagal')
    } else {
      toast.success('Registrasi Berhasil')
      router.push('/sign-in')
    }

    setIsSubmitting(false)
  }

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-8">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link href={'/'}>
            <Button className="shadow-sm" variant={'outline'}>
              <ArrowLeft /> Kembali ke Home</Button>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <form onSubmit={handleSubmit(registerHandle)} className="flex flex-col">
              <div className="flex justify-center mb-3">
                <Link href="/" className="flex items-center font-medium">
                  <Image src={'/images/logo.png'} width={0} height={0} sizes="100vw" className="h-16 w-auto" alt={'logo rebox'} />
                </Link>
              </div>
              <div className="flex flex-col items-center gap-2 text-center mb-5">
                <h1 className="text-2xl font-bold">Register to your account</h1>
                <p className="text-muted-foreground text-sm text-balance">
                  Enter your email below to Register to your account
                </p>
              </div>
              <div className="grid gap-3">
                <div className="grid gap-3">
                  <Label htmlFor="name">Name</Label>
                  <Input {...register('name')} id="name" type="text" placeholder="Enter your name"  />
                  {errors.name && (
                    <p className="text-red-600 text-[13px] mb-0 pb-0">{errors.name?.message}</p>
                  )}
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="email">Email</Label>
                  <Input {...register('email')} id="email" type="text" placeholder="Enter your email"  />
                  {errors.email && (
                    <p className="text-red-600 text-[13px] mb-0 pb-0">{errors.email?.message}</p>
                  )}
                </div>
                <div className="grid gap-3">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                  </div>
                  <Input {...register('password')} id="password" type="password" placeholder="Enter your password"  />
                  {errors.password && (
                    <p className="text-red-600 text-[13px] mb-0 pb-0">{errors.password?.message}</p>
                  )}
                </div>
                <Button disabled={isSubmitting} type="submit" className="w-full">
                  Register <span className='ml-2'>
                      {isSubmitting && <Spinner />}
                    </span>
                </Button>
              </div>
              <p className="text-center mt-3 text-muted-foreground text-sm text-balance">
                Already Have Account?, <Link className="text-primary underline" href={'/sign-in'}>Login Now</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block">
        <Image src={'/images/auth-img.jpg'} fill className="object-cover" alt={'authentication image'} />
      </div>
    </div>
  )
}

export default RegisterPage;
