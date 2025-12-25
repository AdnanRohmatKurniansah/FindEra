import React from 'react'
import Navbar from '@/components/shared/navbar'
import Footer from '@/components/shared/footer'
import { AuthProvider } from '@/providers/user-provider'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col">
      <AuthProvider>
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </AuthProvider>
    </div>
  )
}