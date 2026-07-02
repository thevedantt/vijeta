"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import {
  Trophy,
  Users,
  Compass,
  ArrowRight,
  TrendingUp,
  Calendar,
  Sparkles,
  Bell,
} from "lucide-react"
import { opportunities } from "@/lib/data/opportunities"
import { teams } from "@/lib/data/teams"
import { OpportunityCard } from "@/components/shared/OpportunityCard"
import { StatCard } from "@/components/shared/StatCard"

const quickStats = [
  { icon: Compass, label: "Saved Opportunities", value: 8, color: "#5D7B3D", max: 20, context: "Bookmarked this week", trend: "up" as const, subtitle: "of 20" },
  { icon: Users, label: "Active Teams", value: 2, color: "#E4568B", max: 5, context: "2 need attention", trend: "down" as const, subtitle: "of 5" },
  { icon: Trophy, label: "Competitions Won", value: 3, color: "#F6C94D", context: "Personal best!", trend: "up" as const },
  { icon: TrendingUp, label: "Profile Views", value: 142, color: "#A7C7E4", context: "+18% this month", trend: "up" as const },
]

const upcomingDeadlines = [
  { title: "Smart India Hackathon 2025", deadline: "Aug 15, 2025", daysLeft: 44, color: "#5D7B3D" },
  { title: "Google Solution Challenge", deadline: "Mar 20, 2025", daysLeft: 7, color: "#E4568B" },
  { title: "Hack36", deadline: "Apr 1, 2025", daysLeft: 19, color: "#F6C94D" },
]

export default function DashboardPage() {
  return (
    <div className="p-4 md:p-8 max-w-7xl">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[var(--v-heading)]">Good morning, Aarav 👋</h1>
            <p className="text-[var(--v-muted)] mt-1">You have 3 upcoming deadlines this week.</p>
          </div>
          <Link href="/activity#notifications" className="relative w-9 h-9 rounded-xl border border-[var(--v-border)] bg-[var(--v-card)] flex items-center justify-center hover-bg-v-hover transition-colors shadow-sm">
            <Bell className="w-4 h-4 text-[var(--v-muted)]" />
            <div className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#E4568B]" />
          </Link>
        </div>
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {quickStats.map((stat, i) => (
          <StatCard key={stat.label} {...stat} index={i} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-[var(--v-card)] rounded-[18px] border border-[var(--v-border)] p-6 shadow-card"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-[var(--v-heading)]">Upcoming Deadlines</h2>
            <Calendar className="w-4 h-4 text-[var(--v-muted)]" />
          </div>
          <div className="space-y-3">
            {upcomingDeadlines.map((d) => (
              <div key={d.title} className="flex items-center gap-3">
                <div className="w-1 h-10 rounded-full flex-shrink-0" style={{ backgroundColor: d.color }} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[var(--v-heading)] truncate">{d.title}</p>
                  <p className="text-xs text-[var(--v-muted)]">{d.deadline}</p>
                </div>
                <span
                  className={`text-xs font-bold px-2 py-1 rounded-lg flex-shrink-0 ${d.daysLeft <= 7 ? "bg-[#E4568B]/10 text-[#E4568B]" : "bg-[var(--v-bg-secondary)] text-[var(--v-body)]"}`}
                >
                  {d.daysLeft}d
                </span>
              </div>
            ))}
          </div>
          <Link href="/discover">
            <button className="w-full mt-4 pt-4 border-t border-[var(--v-border)] flex items-center justify-between text-sm text-[#5D7B3D] font-medium hover:text-[#4a6230] transition-colors">
              View all opportunities
              <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-[var(--v-card)] rounded-[18px] border border-[var(--v-border)] p-6 shadow-card"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-[var(--v-heading)]">Active Teams</h2>
            <Users className="w-4 h-4 text-[var(--v-muted)]" />
          </div>
          <div className="space-y-4">
            {teams.slice(0, 2).map((team) => (
              <div key={team.id} className="flex items-start gap-3 pb-3 border-b border-[var(--v-border)] last:border-0">
                <div className="flex -space-x-2 flex-shrink-0">
                  {team.members.slice(0, 3).map((m) => (
                    <img key={m.id} src={m.avatar} alt={m.name} className="w-7 h-7 rounded-full border-2 border-[var(--v-card)]" />
                  ))}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-[var(--v-heading)] truncate">{team.name}</p>
                  <p className="text-xs text-[#5D7B3D] truncate">{team.opportunity}</p>
                  <div className="flex items-center gap-1 mt-1">
                    {team.rolesNeeded.slice(0, 2).map((r) => (
                      <span key={r} className="text-[10px] border border-dashed border-[#E4568B]/40 text-[#E4568B] px-1.5 py-0.5 rounded-full">
                        {r}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <Link href="/team">
            <button className="w-full mt-4 pt-4 border-t border-[var(--v-border)] flex items-center justify-between text-sm text-[#5D7B3D] font-medium hover:text-[#4a6230] transition-colors">
              Browse all teams
              <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-[#5D7B3D] to-[#4a6230] rounded-[18px] p-6 shadow-card text-white"
        >
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-[#F6C94D]" />
            <h2 className="font-bold">AI Suggestions</h2>
          </div>
          <div className="space-y-3">
            <div className="bg-white/10 rounded-xl p-3 text-sm">
              <p className="font-medium mb-0.5">Best match for you</p>
              <p className="text-white/70 text-xs">Google Solution Challenge — matches your AI/ML skills</p>
            </div>
            <div className="bg-white/10 rounded-xl p-3 text-sm">
              <p className="font-medium mb-0.5">Deadline coming up</p>
              <p className="text-white/70 text-xs">SIH 2025 registration closes in 44 days</p>
            </div>
            <div className="bg-white/10 rounded-xl p-3 text-sm">
              <p className="font-medium mb-0.5">Team looking for you</p>
              <p className="text-white/70 text-xs">Team Quantum needs a Backend Engineer</p>
            </div>
          </div>
          <Link href="/assistant" className="mt-4 w-full bg-white/10 hover:bg-white/20 rounded-xl py-2.5 text-sm font-medium transition-colors block text-center">
            Ask AI anything
          </Link>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-bold text-[var(--v-heading)]">Recommended for You</h2>
          <Link href="/discover" className="text-sm text-[#5D7B3D] font-medium hover:underline flex items-center gap-1">
            See all <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {opportunities.slice(0, 3).map((opp) => (
            <OpportunityCard key={opp.id} opportunity={opp} />
          ))}
        </div>
      </motion.div>
    </div>
  )
}
