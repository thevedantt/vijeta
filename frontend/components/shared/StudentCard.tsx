"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { MapPin, Code2, Briefcase, Globe, Trophy, MessageCircle } from "lucide-react"
import { Student } from "@/types"

const badgeColors: Record<string, { bg: string; text: string }> = {
  green: { bg: "#5D7B3D10", text: "#5D7B3D" },
  yellow: { bg: "#F6C94D20", text: "#b8922c" },
  pink: { bg: "#E4568B10", text: "#E4568B" },
  blue: { bg: "#A7C7E420", text: "#4a90c0" },
}

interface StudentCardProps {
  student: Student
  compact?: boolean
}

export function StudentCard({ student, compact }: StudentCardProps) {
  return (
    <Link href={`/profile/${student.id}`}>
      <motion.div
        whileHover={{ y: -2 }}
        transition={{ duration: 0.15 }}
        className="bg-[var(--v-card)] rounded-[18px] border border-[var(--v-border)] p-5 shadow-card hover:shadow-card-hover transition-all duration-200 cursor-pointer"
      >
        <div className="flex items-start gap-4 mb-4">
          <div className="relative flex-shrink-0">
            <img
              src={student.avatar}
              alt={student.name}
              className="w-12 h-12 rounded-2xl border border-[var(--v-border)] bg-[var(--v-bg-secondary)]"
            />
            {student.wins > 0 && (
              <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#F6C94D] flex items-center justify-center">
                <Trophy className="w-2.5 h-2.5 text-white fill-white" />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-sm text-[var(--v-heading)] truncate">{student.name}</p>
            <p className="text-xs text-[var(--v-muted)] truncate">{student.college}</p>
            <div className="flex items-center gap-1 mt-1">
              <MapPin className="w-3 h-3 text-[var(--v-muted)]" />
              <span className="text-xs text-[var(--v-muted)]">{student.city}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-3">
          {student.badges.map((badge) => {
            const color = badgeColors[badge.color] || badgeColors.green
            return (
              <span
                key={badge.label}
                className="text-xs font-semibold px-2 py-0.5 rounded-full"
                style={{ backgroundColor: color.bg, color: color.text }}
              >
                {badge.label}
              </span>
            )
          })}
        </div>

        {!compact && (
          <p className="text-xs text-[var(--v-body)] mb-3 line-clamp-2 leading-relaxed">{student.bio}</p>
        )}

        <div className="flex flex-wrap gap-1 mb-4">
          {student.skills.slice(0, 4).map((skill) => (
            <span key={skill} className="text-xs px-2 py-0.5 rounded-full bg-[var(--v-bg-secondary)] border border-[var(--v-border)] text-[var(--v-body)]">
              {skill}
            </span>
          ))}
          {student.skills.length > 4 && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--v-bg-secondary)] border border-[var(--v-border)] text-[var(--v-muted)]">
              +{student.skills.length - 4}
            </span>
          )}
        </div>

        <div className="border-t border-[var(--v-border)] pt-3 flex items-center justify-between">
          <div className="flex items-center gap-4 text-xs text-[var(--v-muted)]">
            <span><span className="font-bold text-[var(--v-heading)]">{student.wins}</span> wins</span>
            <span><span className="font-bold text-[var(--v-heading)]">{student.projects}</span> projects</span>
          </div>
        <div className="flex items-center gap-1.5">
          {student.github && (
            <button onClick={(e) => { e.preventDefault(); window.open(student.github, "_blank") }} className="w-6 h-6 rounded-md hover-bg-v-hover flex items-center justify-center transition-colors">
              <Code2 className="w-3.5 h-3.5 text-[var(--v-muted)]" />
            </button>
          )}
          {student.linkedin && (
            <button onClick={(e) => { e.preventDefault(); window.open(student.linkedin, "_blank") }} className="w-6 h-6 rounded-md hover-bg-v-hover flex items-center justify-center transition-colors">
              <Briefcase className="w-3.5 h-3.5 text-[var(--v-muted)]" />
            </button>
          )}
          {student.portfolio && (
            <button onClick={(e) => { e.preventDefault(); window.open(student.portfolio, "_blank") }} className="w-6 h-6 rounded-md hover-bg-v-hover flex items-center justify-center transition-colors">
              <Globe className="w-3.5 h-3.5 text-[var(--v-muted)]" />
            </button>
          )}
        </div>
        </div>
      </motion.div>
    </Link>
  )
}
