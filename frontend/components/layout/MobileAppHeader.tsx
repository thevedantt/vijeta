"use client"

import { Menu } from "lucide-react"
import { ThemeToggle } from "@/components/theme/ThemeToggle"

interface MobileAppHeaderProps {
  onMenuClick: () => void
}

export function MobileAppHeader({ onMenuClick }: MobileAppHeaderProps) {
  return (
    <div className="flex items-center justify-between h-14 px-4 border-b border-[var(--v-border)] bg-[var(--v-card)] lg:hidden sticky top-0 z-20">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="w-9 h-9 rounded-lg hover-bg-v-hover flex items-center justify-center"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5 text-[var(--v-heading)]" />
        </button>
        <span className="text-base font-bold text-[var(--v-heading)]">Vijeta</span>
      </div>
      <ThemeToggle />
    </div>
  )
}
