"use client"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { useUser } from "@clerk/nextjs"
import {
  Trophy,
  Users,
  Compass,
  ArrowRight,
  TrendingUp,
  Calendar,
  Sparkles,
  Bell,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { OpportunityCard } from "@/components/shared/OpportunityCard"
import { StatCard } from "@/components/shared/StatCard"
import type { Opportunity, Team } from "@/types"
import { cn } from "@/lib/utils"

interface DashboardData {
  stats: { savedCount: number; activeTeamCount: number; wins: number; profileViews: number }
  deadlines: Opportunity[]
  activeTeams: Team[]
  recommended: Opportunity[]
  unreadNotifications: number
}

const DEADLINE_COLORS = ["#5D7B3D", "#E4568B", "#F6C94D"]

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

interface DeadlineItem {
  title: string
  deadline: string
  daysLeft: number
  color: string
  oppId: string
  month: number
  day: number
}

function CalendarPopup({ deadlines, onClose }: { deadlines: DeadlineItem[]; onClose: () => void }) {
  const today = new Date()
  const [viewMonth, setViewMonth] = useState(today.getMonth())
  const [viewYear, setViewYear] = useState(today.getFullYear())
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose()
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [onClose])

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()
  const firstDay = new Date(viewYear, viewMonth, 1).getDay()
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)

  const colorMap: Record<string, string> = {
    "#5D7B3D": "bg-[#5D7B3D]",
    "#E4568B": "bg-[#E4568B]",
    "#F6C94D": "bg-[#F6C94D]",
  }

  const deadlineDots: Record<number, string[]> = {}
  deadlines.forEach((d) => {
    const date = new Date(d.deadline)
    if (date.getMonth() === viewMonth && date.getFullYear() === viewYear) {
      const day = date.getDate()
      if (!deadlineDots[day]) deadlineDots[day] = []
      deadlineDots[day].push(d.color)
    }
  })

  const prev = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(viewYear - 1) }
    else setViewMonth(viewMonth - 1)
  }
  const next = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(viewYear + 1) }
    else setViewMonth(viewMonth + 1)
  }

  return (
    <div ref={ref} className="absolute top-full right-0 mt-2 z-50 bg-[var(--v-card)] border border-[var(--v-border)] rounded-2xl shadow-xl p-4 w-[280px]">
      <div className="flex items-center justify-between mb-3">
        <button onClick={prev} className="w-7 h-7 rounded-lg hover-bg-v-hover flex items-center justify-center">
          <ChevronLeft className="w-4 h-4 text-[var(--v-muted)]" />
        </button>
        <span className="text-sm font-bold text-[var(--v-heading)]">{MONTHS[viewMonth]} {viewYear}</span>
        <button onClick={next} className="w-7 h-7 rounded-lg hover-bg-v-hover flex items-center justify-center">
          <ChevronRight className="w-4 h-4 text-[var(--v-muted)]" />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-0.5 text-center mb-2">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
          <span key={d} className="text-[10px] font-semibold text-[var(--v-muted)] py-1">{d}</span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-0.5">
        {Array.from({ length: firstDay }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}
        {days.map((day) => {
          const isToday = viewMonth === today.getMonth() && viewYear === today.getFullYear() && day === today.getDate()
          const dots = deadlineDots[day] || []
          return (
            <div
              key={day}
              className={cn(
                "relative text-xs w-8 h-8 rounded-lg flex items-center justify-center",
                isToday ? "bg-[#5D7B3D] text-white font-bold" : "text-[var(--v-body)] hover:bg-[var(--v-bg-secondary)]",
              )}
            >
              {day}
              {dots.length > 0 && (
                <div className="absolute -bottom-0.5 flex gap-0.5">
                  {dots.map((c, i) => (
                    <span key={i} className={`w-1.5 h-1.5 rounded-full ${colorMap[c]}`} />
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
      {/* Legend */}
      <div className="mt-3 pt-3 border-t border-[var(--v-border)] space-y-1.5">
        {deadlines.map((d) => (
          <Link key={d.title} href={`/opportunity/${d.oppId}`} className="flex items-center gap-2 text-xs hover:bg-[var(--v-bg-secondary)] rounded-lg p-1.5 transition-colors">
            <span className={`w-2 h-2 rounded-full`} style={{ backgroundColor: d.color }} />
            <span className="flex-1 text-[var(--v-heading)] truncate">{d.title}</span>
            <span className="font-semibold" style={{ color: d.color }}>{d.daysLeft}d</span>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const { user } = useUser()
  const [calOpen, setCalOpen] = useState(false)
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/dashboard")
      .then((res) => res.json())
      .then(setData)
      .finally(() => setLoading(false))
  }, [])

  const deadlineItems: DeadlineItem[] = (data?.deadlines ?? []).map((opp, i) => {
    const deadlineDate = new Date(opp.deadline)
    const daysLeft = Math.max(0, Math.ceil((deadlineDate.getTime() - Date.now()) / 86400000))
    return {
      title: opp.title,
      deadline: opp.deadline,
      daysLeft,
      color: DEADLINE_COLORS[i % DEADLINE_COLORS.length],
      oppId: opp.id,
      month: deadlineDate.getMonth(),
      day: deadlineDate.getDate(),
    }
  })

  const quickStats = data
    ? [
        { icon: Compass, label: "Saved Opportunities", value: data.stats.savedCount, color: "#5D7B3D", context: "Browse to save more", trend: "up" as const, href: "/discover" },
        { icon: Users, label: "Active Teams", value: data.stats.activeTeamCount, color: "#E4568B", context: "Manage your teams", trend: "up" as const, href: "/team" },
        { icon: Trophy, label: "Competitions Won", value: data.stats.wins, color: "#F6C94D", context: "View your showcase", trend: "up" as const, href: "/showcase" },
        { icon: TrendingUp, label: "Profile Views", value: data.stats.profileViews, color: "#A7C7E4", context: "See your profile", trend: "up" as const, href: "/profile" },
      ]
    : []

  return (
    <div className="p-4 md:p-8 max-w-7xl">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[var(--v-heading)]">
              Good morning, {user?.firstName ?? "there"} 👋
            </h1>
            <p className="text-[var(--v-muted)] mt-1">
              You have {deadlineItems.length} upcoming deadline{deadlineItems.length === 1 ? "" : "s"} this week.
            </p>
          </div>
          <Link href="/activity#notifications" className="relative w-9 h-9 rounded-xl border border-[var(--v-border)] bg-[var(--v-card)] flex items-center justify-center hover-bg-v-hover transition-colors shadow-sm">
            <Bell className="w-4 h-4 text-[var(--v-muted)]" />
            {(data?.unreadNotifications ?? 0) > 0 && (
              <div className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#E4568B]" />
            )}
          </Link>
        </div>
      </motion.div>

      {loading ? (
        <div className="text-center py-20 text-sm text-[var(--v-muted)]">Loading...</div>
      ) : (
      <>
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
            <div className="relative">
              <button
                onClick={() => setCalOpen(!calOpen)}
                className="w-8 h-8 rounded-lg hover-bg-v-hover flex items-center justify-center transition-colors"
              >
                <Calendar className="w-4 h-4 text-[var(--v-muted)]" />
              </button>
              {calOpen && <CalendarPopup deadlines={deadlineItems} onClose={() => setCalOpen(false)} />}
            </div>
          </div>
          <div className="space-y-3">
            {deadlineItems.length === 0 && (
              <p className="text-sm text-[var(--v-muted)]">No upcoming deadlines.</p>
            )}
            {deadlineItems.map((d) => (
              <Link key={d.title} href={`/opportunity/${d.oppId}`} className="flex items-center gap-3 group">
                <div className="w-1 h-10 rounded-full flex-shrink-0" style={{ backgroundColor: d.color }} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[var(--v-heading)] truncate group-hover:text-[#5D7B3D] transition-colors">{d.title}</p>
                  <p className="text-xs text-[var(--v-muted)]">{new Date(d.deadline).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
                </div>
                <span
                  className={`text-xs font-bold px-2 py-1 rounded-lg flex-shrink-0 ${d.daysLeft <= 7 ? "bg-[#E4568B]/10 text-[#E4568B]" : d.daysLeft <= 30 ? "bg-[#F6C94D]/20 text-[#b8922c]" : "bg-[var(--v-bg-secondary)] text-[var(--v-body)]"}`}
                >
                  {d.daysLeft}d
                </span>
              </Link>
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
            {(data?.activeTeams ?? []).length === 0 && (
              <p className="text-sm text-[var(--v-muted)]">No active teams yet.</p>
            )}
            {(data?.activeTeams ?? []).map((team) => (
              // eslint-disable-next-line @next/next/no-img-element
              <Link key={team.id} href="/team" className="flex items-start gap-3 pb-3 border-b border-[var(--v-border)] last:border-0 group">
                <div className="flex -space-x-2 flex-shrink-0">
                  {team.members.slice(0, 3).map((m) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img key={m.id} src={m.avatar} alt={m.name} className="w-7 h-7 rounded-full border-2 border-[var(--v-card)]" />
                  ))}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-[var(--v-heading)] truncate group-hover:text-[#5D7B3D] transition-colors">{team.name}</p>
                  <p className="text-xs text-[#5D7B3D] truncate">{team.opportunity}</p>
                  <div className="flex items-center gap-1 mt-1">
                    {team.rolesNeeded.slice(0, 2).map((r) => (
                      <span key={r} className="text-[10px] border border-dashed border-[#E4568B]/40 text-[#E4568B] px-1.5 py-0.5 rounded-full">
                        {r}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
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
            <Link href="/discover" className="block bg-white/10 hover:bg-white/20 rounded-xl p-3 text-sm transition-colors">
              <p className="font-medium mb-0.5">Best match for you</p>
              <p className="text-white/70 text-xs">Browse opportunities matching your skills</p>
            </Link>
            <Link href="/discover" className="block bg-white/10 hover:bg-white/20 rounded-xl p-3 text-sm transition-colors">
              <p className="font-medium mb-0.5">Deadline coming up</p>
              <p className="text-white/70 text-xs">Check your saved opportunities for closing dates</p>
            </Link>
            <Link href="/team" className="block bg-white/10 hover:bg-white/20 rounded-xl p-3 text-sm transition-colors">
              <p className="font-medium mb-0.5">Team looking for you</p>
              <p className="text-white/70 text-xs">Browse open teams needing your skills</p>
            </Link>
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
          {(data?.recommended ?? []).map((opp) => (
            <OpportunityCard key={opp.id} opportunity={opp} />
          ))}
        </div>
      </motion.div>
      </>
      )}
    </div>
  )
}
