"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

interface FilterOption {
  label: string
  value: string
  color?: string
}

interface FiltersProps {
  filters: {
    label: string
    key: string
    options: FilterOption[]
  }[]
  onFilterChange?: (filters: Record<string, string>) => void
  className?: string
}

export function Filters({ filters, onFilterChange, className }: FiltersProps) {
  const [selected, setSelected] = useState<Record<string, string>>({})

  const handleSelect = (key: string, value: string) => {
    const updated = {
      ...selected,
      [key]: selected[key] === value ? "" : value,
    }
    setSelected(updated)
    onFilterChange?.(updated)
  }

  return (
    <div className={cn("space-y-4", className)}>
      {filters.map((filter) => (
        <div key={filter.key}>
          <p className="text-xs font-semibold text-[#8B93A7] uppercase tracking-wider mb-2">
            {filter.label}
          </p>
          <div className="flex flex-wrap gap-2">
            {filter.options.map((opt) => {
              const isActive = selected[filter.key] === opt.value
              return (
                <button
                  key={opt.value}
                  onClick={() => handleSelect(filter.key, opt.value)}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-150",
                    isActive
                      ? "bg-[#5D7B3D] border-[#5D7B3D] text-white"
                      : "bg-white border-[#E8E8E8] text-[#5E6677] hover:border-[#5D7B3D] hover:text-[#5D7B3D]"
                  )}
                >
                  {opt.label}
                </button>
              )
            })}
          </div>
        </div>
      ))}

      {Object.values(selected).some(Boolean) && (
        <button
          onClick={() => {
            setSelected({})
            onFilterChange?.({})
          }}
          className="text-xs text-[#E4568B] hover:underline"
        >
          Clear all filters
        </button>
      )}
    </div>
  )
}
