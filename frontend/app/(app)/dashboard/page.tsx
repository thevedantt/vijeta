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
import { showcases } from "@/lib/data/showcases"
import { teams } from "@/lib/data/teams"
import { OpportunityCard } from "@/components/shared/OpportunityCard"

const quickStats = [
  { icon: Compass, label: "Saved Opportunities", value: "8", color: "#5D7B3D", bg: "#5D7B3D10" },
  { icon: Users, label: "Active Teams", value: "2", color: "#E4568B", bg: "#E4568B10" },
  { icon: Trophy, label: "Competitions Won", value: "3", color: "#F6C94D", bg: "#F6C94D20" },
  { icon: TrendingUp, label: "Profile Views", value: "142", color: "#A7C7E4", bg: "#A7C7E420" },
]

const upcomingDeadlines = [
  { title: "Smart India Hackathon 2025", deadline: "Aug 15, 2025", daysLeft: 44, color: "#5D7B3D" },
  { title: "Google Solution Challenge", deadline: "Mar 20, 2025", daysLeft: 7, color: "#E4568B" },
  { title: "Hack36", deadline: "Apr 1, 2025", daysLeft: 19, color: "#F6C94D" },
]

export default function DashboardPage() {
  return (
    <div className="p-8 max-w-7xl">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#1F2430]">Good morning, Aarav 👋</h1>
            <p className="text-[#8B93A7] mt-1">You have 3 upcoming deadlines this week.</p>
          </div>
          <button className="relative w-9 h-9 rounded-xl border border-[#E8E8E8] bg-white flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm">
            <Bell className="w-4 h-4 text-[#8B93A7]" />
            <div className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#E4568B]" />
          </button>
        </div>
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {quickStats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white rounded-[18px] border border-[#E8E8E8] p-5 shadow-card"
          >
            <div className="flex items-center justify-between mb-3">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: stat.bg }}
              >
                <stat.icon className="w-4 h-4" style={{ color: stat.color }} />
              </div>
            </div>
            <p className="text-2xl font-bold text-[#1F2430]">{stat.value}</p>
            <p className="text-xs text-[#8B93A7] mt-0.5">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-[18px] border border-[#E8E8E8] p-6 shadow-card"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-[#1F2430]">Upcoming Deadlines</h2>
            <Calendar className="w-4 h-4 text-[#8B93A7]" />
          </div>
          <div className="space-y-3">
            {upcomingDeadlines.map((d) => (
              <div key={d.title} className="flex items-center gap-3">
                <div className="w-1 h-10 rounded-full flex-shrink-0" style={{ backgroundColor: d.color }} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#1F2430] truncate">{d.title}</p>
                  <p className="text-xs text-[#8B93A7]">{d.deadline}</p>
                </div>
                <span
                  className={`text-xs font-bold px-2 py-1 rounded-lg flex-shrink-0 ${d.daysLeft <= 7 ? "bg-[#E4568B]/10 text-[#E4568B]" : "bg-[#F8F9FC] text-[#5E6677]"}`}
                >
                  {d.daysLeft}d
                </span>
              </div>
            ))}
          </div>
          <Link href="/discover">
            <button className="w-full mt-4 pt-4 border-t border-[#E8E8E8] flex items-center justify-between text-sm text-[#5D7B3D] font-medium hover:text-[#4a6230] transition-colors">
              View all opportunities
              <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-white rounded-[18px] border border-[#E8E8E8] p-6 shadow-card"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-[#1F2430]">Active Teams</h2>
            <Users className="w-4 h-4 text-[#8B93A7]" />
          </div>
          <div className="space-y-4">
            {teams.slice(0, 2).map((team) => (
              <div key={team.id} className="flex items-start gap-3 pb-3 border-b border-[#E8E8E8] last:border-0">
                <div className="flex -space-x-2 flex-shrink-0">
                  {team.members.slice(0, 3).map((m) => (
                    <img key={m.id} src={m.avatar} alt={m.name} className="w-7 h-7 rounded-full border-2 border-white" />
                  ))}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-[#1F2430] truncate">{team.name}</p>
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
            <button className="w-full mt-4 pt-4 border-t border-[#E8E8E8] flex items-center justify-between text-sm text-[#5D7B3D] font-medium hover:text-[#4a6230] transition-colors">
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
          <button className="mt-4 w-full bg-white/10 hover:bg-white/20 rounded-xl py-2.5 text-sm font-medium transition-colors">
            Ask AI anything
          </button>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-bold text-[#1F2430]">Recommended for You</h2>
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
