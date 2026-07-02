"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, Check, X } from "lucide-react"
import {
  History,
  Compass,
  Users,
  Star,
  LayoutDashboard,
  Trophy,
  MapPin,
  UserPlus,
  Eye,
  Zap,
  Bot,
  Bell,
  UserCheck,
  Calendar,
  MessageSquare,
  AlertCircle,
} from "lucide-react"

const activityLog = [
  {
    id: "a1",
    icon: Users,
    label: "Explored Team Up",
    detail: "Filtered teammates by Mumbai location — found 4 students nearby",
    time: "2 minutes ago",
    category: "Team",
    href: "/team",
  },
  {
    id: "a2",
    icon: Compass,
    label: "Viewed Smart India Hackathon",
    detail: "Checked opportunity details, prize, and eligibility criteria",
    time: "15 minutes ago",
    category: "Discover",
    href: "/discover",
  },
  {
    id: "a3",
    icon: Star,
    label: "Checked Showcase",
    detail: "Browsed winning projects from SIH 2024 and Hack36",
    time: "1 hour ago",
    category: "Showcase",
    href: "/showcase",
  },
  {
    id: "a4",
    icon: LayoutDashboard,
    label: "Dashboard Overview",
    detail: "Reviewed 3 upcoming deadlines and 8 saved opportunities",
    time: "2 hours ago",
    category: "Dashboard",
    href: "/dashboard",
  },
  {
    id: "a5",
    icon: MapPin,
    label: "Location-based search",
    detail: "Searched for opportunities in Mumbai and Pune",
    time: "3 hours ago",
    category: "Discover",
    href: "/discover",
  },
  {
    id: "a6",
    icon: UserPlus,
    label: "Sent team invitation",
    detail: "Invited Priya Patel to join project team",
    time: "Yesterday",
    category: "Team",
    href: "/team",
  },
  {
    id: "a7",
    icon: Trophy,
    label: "Registered for competition",
    detail: "Signed up for Google Solution Challenge 2025",
    time: "Yesterday",
    category: "Discover",
    href: "/discover",
  },
  {
    id: "a8",
    icon: Eye,
    label: "Profile viewed",
    detail: "Your profile was viewed by 3 recruiters",
    time: "2 days ago",
    category: "Profile",
    href: "/profile",
  },
  {
    id: "a9",
    icon: Bot,
    label: "Asked Margdarshak",
    detail: "Queried about SIH team requirements and deadlines",
    time: "2 days ago",
    category: "Assistant",
    href: "/assistant",
  },
  {
    id: "a10",
    icon: Star,
    label: "Published showcase",
    detail: "Added 'CropSense' project to your showcase",
    time: "3 days ago",
    category: "Showcase",
    href: "/showcase",
  },
]

const notifications = [
  {
    id: "n1",
    icon: UserPlus,
    label: "Team invitation",
    detail: "Riya Verma invited you to join 'CodeCrafters' for SIH 2025",
    time: "5 minutes ago",
    type: "pending",
    color: "#E4568B",
  },
  {
    id: "n2",
    icon: Compass,
    label: "New opportunity match",
    detail: "Hack36 — Full-stack roles match your React expertise",
    time: "20 minutes ago",
    type: "pending",
    color: "#5D7B3D",
  },
  {
    id: "n3",
    icon: Calendar,
    label: "Deadline reminder",
    detail: "Google Solution Challenge closes in 7 days",
    time: "1 hour ago",
    type: "pending",
    color: "#b8922c",
  },
  {
    id: "n4",
    icon: MessageSquare,
    label: "New message",
    detail: "Arjun Mehta: 'Hey, interested in collaborating on a project?'",
    time: "3 hours ago",
    type: "read",
    color: "#4a90c0",
  },
  {
    id: "n5",
    icon: Eye,
    label: "Profile view",
    detail: "Your profile was viewed by 2 recruiters from Accenture",
    time: "Yesterday",
    type: "read",
    color: "#A7C7E4",
  },
  {
    id: "n6",
    icon: AlertCircle,
    label: "Opportunity expiring",
    detail: "Smart India Hackathon 2025 registration ends Aug 15",
    time: "Yesterday",
    type: "read",
    color: "#E4568B",
  },
  {
    id: "n7",
    icon: UserCheck,
    label: "Team request accepted",
    detail: "Priya Patel accepted your invitation to join 'Quantum Devs'",
    time: "2 days ago",
    type: "read",
    color: "#5D7B3D",
  },
]

export default function ActivityPage() {
  return (
    <div className="p-4 md:p-8">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-9 h-9 rounded-xl bg-[#F6C94D]/20 flex items-center justify-center">
            <History className="w-5 h-5 text-[#b8922c]" />
          </div>
          <h1 className="text-2xl font-bold text-[var(--v-heading)]">Activity</h1>
        </div>
        <p className="text-[var(--v-muted)] ml-12">Your digital footprint and notifications across Vijeta.</p>
      </motion.div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Column — Activity Timeline (60%) */}
        <div className="w-full lg:w-[60%]">
          {/* Stats summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            {[
              { label: "Opportunities Viewed", value: "12", icon: Compass, color: "#5D7B3D" },
              { label: "Teams Engaged", value: "4", icon: Users, color: "#E4568B" },
              { label: "Projects Saved", value: "6", icon: Star, color: "#b8922c" },
              { label: "AI Queries", value: "9", icon: Zap, color: "#4a90c0" },
            ].map((s) => (
              <div key={s.label} className="bg-[var(--v-card)] rounded-[16px] border border-[var(--v-border)] p-4 shadow-card">
                <div className="flex items-center gap-2 mb-1.5">
                  <s.icon className="w-3.5 h-3.5" style={{ color: s.color }} />
                  <span className="text-xs text-[var(--v-muted)]">{s.label}</span>
                </div>
                <p className="text-xl font-bold text-[var(--v-heading)]">{s.value}</p>
              </div>
            ))}
          </div>

          {/* Timeline */}
          <div className="relative">
            <div className="absolute left-[17px] top-0 bottom-0 w-px bg-[var(--v-border)] hidden md:block" />

            <div className="space-y-1">
              {activityLog.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <Link
                    href={item.href}
                    className="relative flex items-start gap-4 md:gap-5 p-3 md:p-4 rounded-2xl hover:bg-[var(--v-card)] transition-colors group"
                  >
                    <div className="hidden md:flex w-[34px] h-[34px] rounded-xl bg-[var(--v-bg-secondary)] border border-[var(--v-border)] items-center justify-center flex-shrink-0 z-10 group-hover:border-[#5D7B3D]/40 transition-colors">
                      <item.icon className="w-4 h-4 text-[var(--v-muted)] group-hover:text-[#5D7B3D] transition-colors" />
                    </div>

                    <div className="md:hidden w-8 h-8 rounded-lg bg-[var(--v-bg-secondary)] border border-[var(--v-border)] flex items-center justify-center flex-shrink-0 group-hover:border-[#5D7B3D]/40 transition-colors">
                      <item.icon className="w-3.5 h-3.5 text-[var(--v-muted)] group-hover:text-[#5D7B3D] transition-colors" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-sm font-semibold text-[var(--v-heading)] group-hover:text-[#5D7B3D] transition-colors">{item.label}</p>
                          <p className="text-xs text-[var(--v-body)] mt-0.5">{item.detail}</p>
                        </div>
                        <span className="text-[10px] text-[var(--v-muted)] flex-shrink-0 whitespace-nowrap">{item.time}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[var(--v-bg-secondary)] border border-[var(--v-border)] text-[var(--v-muted)]">
                          {item.category}
                        </span>
                        <ArrowRight className="w-3 h-3 text-[var(--v-muted)] opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column — Notifications (40%) */}
        <div id="notifications" className="w-full lg:w-[40%]">
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-[var(--v-muted)]" />
                <h2 className="font-bold text-[var(--v-heading)]">Notifications</h2>
                <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-[#E4568B]/10 text-[#E4568B]">3 new</span>
              </div>
            </div>

            <div className="space-y-2">
              {notifications.map((n, i) => (
                <motion.div
                  key={n.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.04 }}
                  className="bg-[var(--v-card)] rounded-2xl border border-[var(--v-border)] p-3.5 shadow-card hover:border-[var(--v-border)]/80 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ backgroundColor: `${n.color}15` }}
                    >
                      <n.icon className="w-4 h-4" style={{ color: n.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-sm font-semibold text-[var(--v-heading)]">{n.label}</p>
                          <p className="text-xs text-[var(--v-body)] mt-0.5">{n.detail}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-1.5">
                        <span className="text-[10px] text-[var(--v-muted)]">{n.time}</span>
                        <div className="flex items-center gap-2">
                          {n.type === "pending" ? (
                            <>
                              <span className="w-1.5 h-1.5 rounded-full bg-[#E4568B]" />
                              <button className="text-[10px] font-medium text-[#5D7B3D] hover:underline flex items-center gap-0.5">
                                <Check className="w-3 h-3" /> Mark read
                              </button>
                            </>
                          ) : (
                            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[var(--v-bg-secondary)] text-[var(--v-muted)]">Read</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
