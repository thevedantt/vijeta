"use client"

import { useEffect, useState } from "react"
import { useTheme } from "next-themes"
import { Sun, Moon } from "lucide-react"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="w-9 h-9 rounded-xl bg-[var(--v-card)] border border-[var(--v-border)] flex-shrink-0" />
  }

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="w-9 h-9 rounded-xl border border-[var(--v-border)] bg-[var(--v-card)] flex items-center justify-center hover:bg-[#5D7B3D]/10 transition-colors shadow-sm flex-shrink-0"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <Sun className="w-4 h-4 text-[#F6C94D]" />
      ) : (
        <Moon className="w-4 h-4 text-[var(--v-body)]" />
      )}
    </button>
  )
}
