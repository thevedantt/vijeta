import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Vijeta — The Operating System for Ambitious Students",
  description:
    "Discover opportunities. Build with great teammates. Win competitions. Guide the next generation. The complete platform for ambitious Indian students.",
  keywords: ["hackathon", "scholarship", "student", "India", "competition", "team", "SIH"],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full bg-[#FAFAFA]">
        {children}
      </body>
    </html>
  )
}
