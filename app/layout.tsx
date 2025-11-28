import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  description: "Peta barang hilang dan ditemukan berbasis lokasi. Laporkan, temukan, dan klaim barang dengan cepat menggunakan map real-time. Aman, cerdas, dan berbasis komunitas.",
  keywords: [
    "findera",
    "lost and found",
    "barang hilang",
    "temukan barang hilang",
    "peta barang hilang",
    "lost and found Indonesia",
    "AI lost and found",
    "map lost and found",
    "lapor barang hilang",
    "barang ditemukan",
    "lokasi barang hilang",
    "lost item tracker",
    "lost item map",
    "hilang ketemu",
    "community lost and found",
    "find lost items",
    "lost and found app",
    "lost and found map"
  ],
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Toaster richColors position="top-right" closeButton />
        {children}
      </body>
    </html>
  );
}
