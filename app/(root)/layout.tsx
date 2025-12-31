import React, { Suspense } from 'react'
import Navbar from '@/components/shared/navbar'
import Footer from '@/components/shared/footer'
import { AuthProvider } from '@/providers/user-provider'
import Spinner from '@/components/ui/spinner'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col">
      <AuthProvider>
        <Suspense
          fallback={
            <div className="flex flex-col items-center justify-center flex-1 min-h-screen gap-3">
              <Spinner />
              <p className="text-sm text-muted-foreground animate-pulse">
                Tunggu sebentar...
              </p>
            </div>
          }
        >
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </Suspense>
      </AuthProvider>
    </div>
  )
}