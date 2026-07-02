import type { Metadata } from "next"
import "@fontsource/poppins/400.css"
import "@fontsource/poppins/500.css"
import "@fontsource/poppins/600.css"
import "@fontsource/poppins/700.css"
import "@fontsource/poppins/800.css"
import "./globals.css"
import { ThemeProvider } from "@/components/theme/ThemeProvider"

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
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <body className="min-h-full bg-[var(--v-bg)] text-[var(--v-heading)]">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
