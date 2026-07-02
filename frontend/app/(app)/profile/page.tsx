"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Code2, Briefcase, Globe, Edit3, Trophy, Star, Users, MapPin, GraduationCap, ChevronDown, Bookmark, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { students } from "@/lib/data/students"
import { opportunities } from "@/lib/data/opportunities"
import { showcases } from "@/lib/data/showcases"
import { ShowcaseCard } from "@/components/shared/ShowcaseCard"
import { cn } from "@/lib/utils"

const me = students[0]
const savedOppIds = ["o1", "o3", "o5", "o7", "o9", "o11", "o2", "o4"]
const savedOpps = opportunities.filter((o) => savedOppIds.includes(o.id))

const badgeColors: Record<string, { bg: string; text: string }> = {
  green: { bg: "#5D7B3D10", text: "#5D7B3D" },
  yellow: { bg: "#F6C94D20", text: "#b8922c" },
  pink: { bg: "#E4568B10", text: "#E4568B" },
  blue: { bg: "#A7C7E420", text: "#4a90c0" },
}

export default function ProfilePage() {
  const [savedOpen, setSavedOpen] = useState(false)

  return (
    <div className="p-4 md:p-8 max-w-5xl">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <div className="bg-[var(--v-card)] rounded-[24px] border border-[var(--v-border)] shadow-card overflow-hidden mb-6">
          <div className="h-32 bg-gradient-to-r from-[#5D7B3D] via-[#A7C7E4] to-[#E4568B]" />
          <div className="px-8 pb-8">
            <div className="flex items-end justify-between -mt-14 mb-6">
              <div className="relative">
                <img
                  src={me.avatar}
                  alt={me.name}
                  className="w-24 h-24 rounded-2xl border-4 border-[var(--v-card)] bg-[var(--v-bg-secondary)] shadow-lg"
                />
                <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#5D7B3D] border-2 border-[var(--v-card)] flex items-center justify-center">
                  <Trophy className="w-3 h-3 text-white fill-white" />
                </div>
              </div>
              <Button variant="outline" className="rounded-[14px] border-[var(--v-border)] gap-2">
                <Edit3 className="w-4 h-4" /> Edit Profile
              </Button>
            </div>

            <div className="flex flex-wrap items-start gap-4">
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl font-bold text-[var(--v-heading)] mb-1">{me.name}</h1>
                <p className="text-[var(--v-body)] mb-3">{me.degree} · Year {me.year}</p>
                <p className="text-sm text-[var(--v-body)] leading-relaxed mb-4 max-w-xl">{me.bio}</p>

                <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--v-muted)] mb-4">
                  <div className="flex items-center gap-1.5">
                    <GraduationCap className="w-4 h-4" />
                    {me.college}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4" />
                    {me.city}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {me.badges.map((badge) => {
                    const c = badgeColors[badge.color] || badgeColors.green
                    return (
                      <span
                        key={badge.label}
                        className="text-xs font-semibold px-3 py-1 rounded-full"
                        style={{ backgroundColor: c.bg, color: c.text }}
                      >
                        {badge.label}
                      </span>
                    )
                  })}
                </div>
              </div>

              <div className="flex items-center gap-3">
                {me.github && (
                  <a href={me.github} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl border border-[var(--v-border)] bg-[var(--v-card)] hover-bg-v-hover flex items-center justify-center transition-colors">
                    <Code2 className="w-4 h-4 text-[var(--v-body)]" />
                  </a>
                )}
                {me.linkedin && (
                  <a href={me.linkedin} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl border border-[var(--v-border)] bg-[var(--v-card)] hover-bg-v-hover flex items-center justify-center transition-colors">
                    <Briefcase className="w-4 h-4 text-[var(--v-body)]" />
                  </a>
                )}
                {me.portfolio && (
                  <a href={me.portfolio} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl border border-[var(--v-border)] bg-[var(--v-card)] hover-bg-v-hover flex items-center justify-center transition-colors">
                    <Globe className="w-4 h-4 text-[var(--v-body)]" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 md:gap-4 mb-6">
          {[
            { icon: Trophy, label: "Competition Wins", value: me.wins, color: "#F6C94D", bg: "#F6C94D20" },
            { icon: Star, label: "Projects Built", value: me.projects, color: "#5D7B3D", bg: "#5D7B3D10" },
            { icon: Users, label: "Teams Joined", value: 4, color: "#E4568B", bg: "#E4568B10" },
          ].map((stat) => (
            <div key={stat.label} className="bg-[var(--v-card)] rounded-[18px] border border-[var(--v-border)] p-5 shadow-card text-center">
              <div className="w-10 h-10 rounded-xl mx-auto mb-3 flex items-center justify-center" style={{ backgroundColor: stat.bg }}>
                <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
              </div>
              <p className="text-2xl font-bold text-[var(--v-heading)]">{stat.value}</p>
              <p className="text-xs text-[var(--v-muted)] mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Saved Section — collapsible */}
        <div className="bg-[var(--v-card)] rounded-[18px] border border-[var(--v-border)] shadow-card mb-6 overflow-hidden">
          <button
            onClick={() => setSavedOpen(!savedOpen)}
            className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-[var(--v-bg-secondary)]/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#F6C94D]/20 flex items-center justify-center">
                <Bookmark className="w-4 h-4 text-[#b8922c]" />
              </div>
              <div>
                <span className="font-bold text-[var(--v-heading)]">Saved</span>
                <span className="text-xs text-[var(--v-muted)] ml-2">{savedOpps.length} opportunities</span>
              </div>
            </div>
            <ChevronDown className={cn("w-4 h-4 text-[var(--v-muted)] transition-transform duration-200", savedOpen && "rotate-180")} />
          </button>

          <div className={cn(
            "grid transition-all duration-200",
            savedOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
          )}>
            <div className="overflow-hidden">
              <div className="px-6 pb-4 pt-1 border-t border-[var(--v-border)]">
                <div className="space-y-2">
                  {savedOpps.slice(0, 4).map((opp) => (
                    <Link
                      key={opp.id}
                      href={`/opportunity/${opp.id}`}
                      className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-[var(--v-bg-secondary)] transition-colors group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-[#5D7B3D]/10 flex items-center justify-center flex-shrink-0">
                        <Trophy className="w-3.5 h-3.5 text-[#5D7B3D]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[var(--v-heading)] truncate group-hover:text-[#5D7B3D] transition-colors">{opp.title}</p>
                        <p className="text-xs text-[var(--v-muted)]">{opp.organizer} · {opp.type}</p>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-[var(--v-muted)] opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                    </Link>
                  ))}
                </div>
                <Link href="/discover" className="mt-3 flex items-center justify-center gap-1.5 py-2 text-xs font-medium text-[#5D7B3D] hover:underline">
                  View all saved <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-[var(--v-card)] rounded-[18px] border border-[var(--v-border)] shadow-card p-6">
            <h2 className="font-bold text-[var(--v-heading)] mb-4">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {me.skills.map((skill) => (
                <span key={skill} className="px-3 py-1.5 rounded-xl bg-[#5D7B3D]/8 border border-[#5D7B3D]/15 text-sm text-[#5D7B3D] font-medium">
                  {skill}
                </span>
              ))}
            </div>

            <h2 className="font-bold text-[var(--v-heading)] mt-6 mb-4">Interests</h2>
            <div className="flex flex-wrap gap-2">
              {me.interests.map((interest) => (
                <span key={interest} className="px-3 py-1.5 rounded-xl bg-[#A7C7E4]/20 border border-[#A7C7E4]/30 text-sm text-[#4a90c0] font-medium">
                  {interest}
                </span>
              ))}
            </div>

            <h2 className="font-bold text-[var(--v-heading)] mt-6 mb-4">Looking For</h2>
            <div className="flex flex-wrap gap-2">
              {me.lookingFor.map((role) => (
                <span key={role} className="px-3 py-1.5 rounded-xl border border-dashed border-[#E4568B]/40 text-sm text-[#E4568B]">
                  {role}
                </span>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2">
            <h2 className="font-bold text-[var(--v-heading)] mb-4">My Showcases</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {showcases.slice(0, 2).map((sc) => (
                <ShowcaseCard key={sc.id} showcase={sc} />
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
