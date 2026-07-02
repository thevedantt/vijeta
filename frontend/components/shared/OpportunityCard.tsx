"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Calendar, Users, MapPin, Bookmark, ArrowRight, Wifi } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Opportunity } from "@/types"
import { cn } from "@/lib/utils"

const typeColors: Record<string, { bg: string; text: string }> = {
  Hackathon: { bg: "#5D7B3D10", text: "#5D7B3D" },
  Scholarship: { bg: "#F6C94D20", text: "#b8922c" },
  Competition: { bg: "#E4568B10", text: "#E4568B" },
  Fellowship: { bg: "#A7C7E420", text: "#4a90c0" },
  Internship: { bg: "#5D7B3D10", text: "#5D7B3D" },
  Research: { bg: "#A7C7E420", text: "#4a90c0" },
}

const difficultyColors: Record<string, { text: string; dot: string }> = {
  Beginner: { text: "#5D7B3D", dot: "#5D7B3D" },
  Intermediate: { text: "#b8922c", dot: "#F6C94D" },
  Advanced: { text: "#E4568B", dot: "#E4568B" },
}

function formatDeadline(dateStr: string) {
  const date = new Date(dateStr)
  const now = new Date()
  const diff = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  if (diff < 0) return "Closed"
  if (diff === 0) return "Today!"
  if (diff <= 7) return `${diff}d left`
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "short" })
}

interface OpportunityCardProps {
  opportunity: Opportunity
  compact?: boolean
}

export function OpportunityCard({ opportunity: opp, compact }: OpportunityCardProps) {
  const typeColor = typeColors[opp.type] || typeColors.Competition
  const diffColor = difficultyColors[opp.difficulty] || difficultyColors.Beginner
  const deadlineText = formatDeadline(opp.deadline)
  const isUrgent = (() => {
    const diff = Math.ceil((new Date(opp.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    return diff >= 0 && diff <= 7
  })()

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.15 }}
      className="bg-[var(--v-card)] rounded-[18px] border border-[var(--v-border)] p-5 shadow-card hover:shadow-card-hover transition-all duration-200 flex flex-col group"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className="text-xs font-semibold px-2.5 py-1 rounded-full"
            style={{ backgroundColor: typeColor.bg, color: typeColor.text }}
          >
            {opp.type}
          </span>
          {opp.isRemote && (
            <span className="flex items-center gap-1 text-xs text-[#4a90c0] bg-[#A7C7E420] px-2.5 py-1 rounded-full font-medium">
              <Wifi className="w-3 h-3" /> Remote
            </span>
          )}
        </div>
        <button className="w-7 h-7 rounded-lg hover-bg-v-hover flex items-center justify-center transition-colors flex-shrink-0">
          <Bookmark className="w-3.5 h-3.5 text-[#8B93A7]" />
        </button>
      </div>

      <h3 className="font-bold text-[var(--v-heading)] mb-1 leading-snug line-clamp-2 group-hover:text-[#5D7B3D] transition-colors">
        {opp.title}
      </h3>
      <p className="text-xs text-[var(--v-muted)] mb-3">{opp.organizer}</p>

      {!compact && (
        <p className="text-sm text-[var(--v-body)] mb-4 line-clamp-2 leading-relaxed flex-1">
          {opp.description}
        </p>
      )}

      <div className="flex flex-wrap gap-1.5 mb-4">
        {opp.tags.slice(0, 3).map((tag) => (
          <span key={tag} className="px-2 py-0.5 rounded-full bg-[var(--v-bg-secondary)] border border-[var(--v-border)] text-xs text-[var(--v-body)]">
            {tag}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-x-3 gap-y-2 mb-4 text-xs text-[var(--v-muted)]">
        <div className="flex items-center gap-1.5">
          <Calendar className={cn("w-3.5 h-3.5", isUrgent ? "text-[#E4568B]" : "")} />
          <span className={cn(isUrgent ? "text-[#E4568B] font-semibold" : "")}>{deadlineText}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Users className="w-3.5 h-3.5" />
          <span>Team: {opp.teamSize}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: diffColor.dot }} />
          <span style={{ color: diffColor.text }} className="font-medium">{opp.difficulty}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5" />
          <span className="truncate">{opp.location}</span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-[var(--v-border)]">
        <div>
          <p className="text-sm font-bold text-[var(--v-heading)]">{opp.prize}</p>
          <p className="text-xs text-[var(--v-muted)]">{opp.applicants.toLocaleString()} applicants</p>
        </div>
        <Link href={`/opportunity/${opp.id}`}>
          <Button
            size="sm"
            className="bg-[#5D7B3D] hover:bg-[#4a6230] text-white rounded-[10px] gap-1.5 text-xs"
          >
            View <ArrowRight className="w-3 h-3" />
          </Button>
        </Link>
      </div>
    </motion.div>
  )
}
