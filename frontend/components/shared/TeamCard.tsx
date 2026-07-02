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
      className="bg-white rounded-[18px] border border-[#E8E8E8] p-5 shadow-card hover:shadow-card-hover transition-all duration-200"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <h3 className="font-bold text-[#1F2430] mb-0.5">{team.name}</h3>
          <p className="text-xs text-[#5D7B3D] font-medium">{team.opportunity}</p>
        </div>
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0 ${team.isOpen ? "bg-[#5D7B3D]/10 text-[#5D7B3D]" : "bg-gray-100 text-[#8B93A7]"}`}>
          {team.isOpen ? "Open" : "Full"}
        </span>
      </div>

      <p className="text-sm text-[#5E6677] mb-4 line-clamp-2 leading-relaxed">{team.description}</p>

      <div className="flex flex-wrap gap-1.5 mb-4">
        {team.skills.slice(0, 4).map((skill) => (
          <span key={skill} className="text-xs px-2 py-0.5 rounded-full bg-[#F8F9FC] border border-[#E8E8E8] text-[#5E6677]">
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
            className="w-8 h-8 rounded-full border-2 border-white bg-gray-100"
          />
        ))}
        {team.rolesNeeded.length > 0 && (
          <div className="w-8 h-8 rounded-full border-2 border-dashed border-[#E8E8E8] bg-[#F8F9FC] flex items-center justify-center">
            <span className="text-[10px] font-bold text-[#8B93A7]">+{team.rolesNeeded.length}</span>
          </div>
        )}
      </div>

      {team.rolesNeeded.length > 0 && (
        <div className="mb-4">
          <p className="text-xs font-medium text-[#8B93A7] mb-1.5">Roles needed:</p>
          <div className="flex flex-wrap gap-1.5">
            {team.rolesNeeded.map((role) => (
              <span key={role} className="text-xs px-2 py-0.5 rounded-full border border-dashed border-[#E4568B]/40 text-[#E4568B] bg-[#E4568B]/5">
                {role}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between pt-3 border-t border-[#E8E8E8]">
        <div className="flex items-center gap-3 text-xs text-[#8B93A7]">
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
