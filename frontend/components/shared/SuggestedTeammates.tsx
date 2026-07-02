"use client"

import { motion } from "framer-motion"
import { MapPin, UserPlus } from "lucide-react"
import { students } from "@/lib/data/students"

function getCompatibility(student: (typeof students)[0]): number {
  return 65 + Math.floor(Math.random() * 30)
}

function getDistance(student: (typeof students)[0]): string {
  const distances = ["0.3 km", "0.8 km", "1.2 km", "1.8 km", "2.5 km", "3.1 km", "4.0 km", "5.5 km"]
  return distances[Math.floor(Math.random() * distances.length)]
}

export function SuggestedTeammates() {
  const suggestions = students.slice(0, 8)

  return (
    <div className="bg-[var(--v-card)] rounded-[18px] border border-[var(--v-border)] p-5 shadow-card">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-bold text-sm text-[var(--v-heading)]">Suggested Teammates</h3>
          <p className="text-xs text-[var(--v-muted)]">People near you looking for teams</p>
        </div>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-none">
        {suggestions.map((student, i) => {
          const compatibility = getCompatibility(student)
          return (
            <motion.div
              key={student.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className="flex-shrink-0 w-[200px] bg-[var(--v-bg-secondary)] rounded-[14px] border border-[var(--v-border)] p-3 hover:border-[#5D7B3D]/30 transition-colors"
            >
              <div className="flex items-start gap-2.5 mb-2.5">
                <img
                  src={student.avatar}
                  alt={student.name}
                  className="w-9 h-9 rounded-xl border border-[var(--v-border)] flex-shrink-0 bg-[var(--v-card)]"
                />
                <div className="min-w-0">
                  <p className="text-xs font-bold text-[var(--v-heading)] truncate">{student.name}</p>
                  <p className="text-[10px] text-[var(--v-muted)] truncate">{student.college}</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <MapPin className="w-2.5 h-2.5 text-[var(--v-muted)]" />
                    <span className="text-[10px] text-[var(--v-muted)]">{getDistance(student)}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-1 mb-2.5">
                {student.skills.slice(0, 3).map((s) => (
                  <span
                    key={s}
                    className="text-[9px] px-1.5 py-0.5 rounded-full bg-[var(--v-card)] border border-[var(--v-border)] text-[var(--v-body)]"
                  >
                    {s}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#5D7B3D]" />
                    <span className="text-[10px] font-semibold text-[#5D7B3D]">{compatibility}% match</span>
                  </div>
                </div>
                <button className="w-7 h-7 rounded-lg bg-[#5D7B3D] hover:bg-[#4a6230] flex items-center justify-center transition-colors">
                  <UserPlus className="w-3.5 h-3.5 text-white" />
                </button>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
