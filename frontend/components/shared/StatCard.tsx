"use client"

import { type ElementType } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { TrendingUp, TrendingDown, Minus, ArrowUpRight } from "lucide-react"
import { AnimatedCounter } from "./AnimatedCounter"
import { cn } from "@/lib/utils"

interface StatCardProps {
  value: number
  label: string
  icon: ElementType
  color: string
  max?: number
  context?: string
  trend?: "up" | "down" | "neutral"
  subtitle?: string
  index?: number
  href?: string
  onClick?: () => void
}

export function StatCard({
  value,
  label,
  icon: Icon,
  color,
  max,
  context,
  trend,
  subtitle,
  index = 0,
  href,
  onClick,
}: StatCardProps) {
  const percentage = max ? Math.round((value / max) * 100) : undefined
  const TrendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus
  const trendColor =
    trend === "up"
      ? "text-[#5D7B3D]"
      : trend === "down"
        ? "text-[#E4568B]"
        : "text-[var(--v-muted)]"

  const card = (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      {...(onClick ? { onClick, role: "button", tabIndex: 0, onKeyDown: (e: React.KeyboardEvent) => { if (e.key === "Enter") onClick() } } : {})}
      className={cn(
        "relative bg-[var(--v-card)] rounded-[18px] border border-[var(--v-border)] p-5 shadow-card overflow-hidden group",
        (href || onClick) && "cursor-pointer hover:border-[var(--v-heading)]/20 transition-colors",
      )}
    >
      {/* Top accent bar */}
      <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ backgroundColor: color }} />

      {/* Arrow indicator */}
      {(href || onClick) && (
        <div className="absolute top-3 right-3 w-6 h-6 rounded-lg bg-[var(--v-bg-secondary)] opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
          <ArrowUpRight className="w-3.5 h-3.5 text-[var(--v-muted)]" />
        </div>
      )}

      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: `${color}18` }}
          >
            <Icon className="w-4 h-4" style={{ color }} />
          </div>
          <span className="text-xs font-medium text-[var(--v-muted)]">{label}</span>
        </div>

        {percentage !== undefined && (
          <svg className="w-8 h-8 -rotate-90 flex-shrink-0" viewBox="0 0 36 36">
            <circle cx="18" cy="18" r="15.5" fill="none" stroke="var(--v-border)" strokeWidth="2.5" />
            <circle
              cx="18" cy="18" r="15.5" fill="none"
              stroke={color} strokeWidth="2.5" strokeLinecap="round"
              strokeDasharray={`${percentage * 0.973} 97.3`}
              opacity="0.7"
            />
          </svg>
        )}
      </div>

      <div className="flex items-baseline gap-1.5">
        <span className="text-3xl font-bold text-[var(--v-heading)] tabular-nums tracking-tight">
          <AnimatedCounter end={value} />
        </span>
        {subtitle && (
          <span className="text-xs text-[var(--v-muted)] font-medium">{subtitle}</span>
        )}
      </div>

      {(trend || context || percentage !== undefined) && (
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-[var(--v-border)]">
          <div className="flex items-center gap-1.5">
            {trend && <TrendIcon className={`w-3.5 h-3.5 ${trendColor}`} />}
            {context && <span className="text-[11px] text-[var(--v-muted)]">{context}</span>}
          </div>
          {percentage !== undefined && (
            <span className="text-[11px] font-semibold" style={{ color }}>
              {percentage}%
            </span>
          )}
        </div>
      )}
    </motion.div>
  )

  if (href) {
    return <Link href={href}>{card}</Link>
  }

  return card
}
