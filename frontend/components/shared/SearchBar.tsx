"use client"

import { useState } from "react"
import { Search, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface SearchBarProps {
  placeholder?: string
  onSearch?: (query: string) => void
  className?: string
}

export function SearchBar({ placeholder = "Search...", onSearch, className }: SearchBarProps) {
  const [query, setQuery] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
    onSearch?.(e.target.value)
  }

  const handleClear = () => {
    setQuery("")
    onSearch?.("")
  }

  return (
    <div className={cn("relative flex items-center", className)}>
      <Search className="absolute left-4 w-4 h-4 text-[var(--v-muted)] pointer-events-none" />
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full h-11 pl-11 pr-10 rounded-xl border border-[var(--v-border)] bg-[var(--v-card)] text-sm text-[var(--v-heading)] placeholder:text-[var(--v-muted)] outline-none focus:border-[#5D7B3D] focus:ring-2 focus:ring-[#5D7B3D]/10 transition-all"
      />
      {query && (
        <button
          onClick={handleClear}
          className="absolute right-3 w-5 h-5 rounded-full bg-[var(--v-border)] hover-bg-v-hover flex items-center justify-center transition-colors"
        >
          <X className="w-3 h-3 text-[var(--v-body)]" />
        </button>
      )}
    </div>
  )
}
