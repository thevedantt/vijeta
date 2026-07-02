"use client"

import { motion } from "framer-motion"
import { MapPin, Clock, UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Team } from "@/types"

interface TeamCardProps {
  team: Team
}

export function TeamCard({ team }: TeamCardProps) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.15 }}
      className="bg-[var(--v-card)] rounded-[18px] border border-[var(--v-border)] p-5 shadow-card hover:shadow-card-hover transition-all duration-200"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <h3 className="font-bold text-[var(--v-heading)] mb-0.5">{team.name}</h3>
          <p className="text-xs text-[#5D7B3D] font-medium">{team.opportunity}</p>
        </div>
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0 ${team.isOpen ? "bg-[#5D7B3D]/10 text-[#5D7B3D]" : "bg-[var(--v-bg-secondary)] text-[var(--v-muted)]"}`}>
          {team.isOpen ? "Open" : "Full"}
        </span>
      </div>

      <p className="text-sm text-[var(--v-body)] mb-4 line-clamp-2 leading-relaxed">{team.description}</p>

      <div className="flex flex-wrap gap-1.5 mb-4">
        {team.skills.slice(0, 4).map((skill) => (
          <span key={skill} className="text-xs px-2 py-0.5 rounded-full bg-[var(--v-bg-secondary)] border border-[var(--v-border)] text-[var(--v-body)]">
            {skill}
          </span>
        ))}
      </div>

      <div className="flex -space-x-2 mb-3">
        {team.members.map((m) => (
          <img
            key={m.id}
            src={m.avatar}
            alt={m.name}
            title={`${m.name} — ${m.role}`}
            className="w-8 h-8 rounded-full border-2 border-[var(--v-card)] bg-[var(--v-bg-secondary)]"
          />
        ))}
        {team.rolesNeeded.length > 0 && (
          <div className="w-8 h-8 rounded-full border-2 border-dashed border-[var(--v-border)] bg-[var(--v-bg-secondary)] flex items-center justify-center">
            <span className="text-[10px] font-bold text-[var(--v-muted)]">+{team.rolesNeeded.length}</span>
          </div>
        )}
      </div>

      {team.rolesNeeded.length > 0 && (
        <div className="mb-4">
          <p className="text-xs font-medium text-[var(--v-muted)] mb-1.5">Roles needed:</p>
          <div className="flex flex-wrap gap-1.5">
            {team.rolesNeeded.map((role) => (
              <span key={role} className="text-xs px-2 py-0.5 rounded-full border border-dashed border-[#E4568B]/40 text-[#E4568B] bg-[#E4568B]/5">
                {role}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between pt-3 border-t border-[var(--v-border)]">
        <div className="flex items-center gap-3 text-xs text-[var(--v-muted)]">
          <div className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            {team.city}
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {new Date(team.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
          </div>
        </div>
        {team.isOpen && (
          <Button size="sm" className="bg-[#E4568B] hover:bg-[#cc3f79] text-white rounded-[10px] gap-1.5 text-xs">
            <UserPlus className="w-3 h-3" /> Apply
          </Button>
        )}
      </div>
    </motion.div>
  )
}
