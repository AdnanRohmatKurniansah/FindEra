import { AuthProvider } from '@/providers/user-provider'
import React from 'react'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col">
      <AuthProvider>
        <main className="flex-1">{children}</main>
      </AuthProvider>
    </div>
  )
}