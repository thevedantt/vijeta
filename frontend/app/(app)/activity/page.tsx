"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  History,
  Compass,
  Users,
  Star,
  LayoutDashboard,
  Trophy,
  UserPlus,
  Eye,
  Zap,
  Bot,
  Bell,
  UserCheck,
  Calendar,
  MessageSquare,
  AlertCircle,
  type LucideIcon,
} from "lucide-react"

interface ActivityRow {
  id: number
  type: string
  description: string
  referenceId: string | null
  referenceType: string | null
  createdAt: string
}

interface NotificationRow {
  id: number
  type: string
  title: string
  description: string
  isRead: boolean
  referenceId: string | null
  referenceType: string | null
  createdAt: string
}

const activityMeta: Record<string, { icon: LucideIcon; label: string; category: string; href: string }> = {
  saved_opportunity: { icon: Compass, label: "Saved an opportunity", category: "Discover", href: "/discover" },
  joined_team: { icon: Users, label: "Joined a team", category: "Team", href: "/team" },
  created_team: { icon: UserPlus, label: "Created a team", category: "Team", href: "/team" },
  applied_team: { icon: Users, label: "Applied to a team", category: "Team", href: "/team" },
  submitted_project: { icon: Star, label: "Submitted a project", category: "Showcase", href: "/showcase" },
  won_competition: { icon: Trophy, label: "Won a competition", category: "Showcase", href: "/showcase" },
  earned_badge: { icon: Star, label: "Earned a badge", category: "Profile", href: "/profile" },
  updated_profile: { icon: LayoutDashboard, label: "Updated profile", category: "Profile", href: "/profile" },
  connected_mentor: { icon: UserCheck, label: "Connected with a mentor", category: "Mentor", href: "/dashboard" },
  showcase_liked: { icon: Star, label: "Liked a showcase", category: "Showcase", href: "/showcase" },
  showcase_viewed: { icon: Eye, label: "Viewed a showcase", category: "Showcase", href: "/showcase" },
}

const notificationMeta: Record<string, { icon: LucideIcon; color: string }> = {
  team_invite: { icon: UserPlus, color: "#E4568B" },
  application_received: { icon: Users, color: "#5D7B3D" },
  application_accepted: { icon: UserCheck, color: "#5D7B3D" },
  application_rejected: { icon: AlertCircle, color: "#E4568B" },
  new_message: { icon: MessageSquare, color: "#4a90c0" },
  deadline_reminder: { icon: Calendar, color: "#b8922c" },
  opportunity_match: { icon: Compass, color: "#5D7B3D" },
  teammate_suggestion: { icon: UserPlus, color: "#4a90c0" },
  showcase_like: { icon: Eye, color: "#A7C7E4" },
  friend_request: { icon: UserPlus, color: "#E4568B" },
  friend_accepted: { icon: UserCheck, color: "#5D7B3D" },
}

function getNotificationHref(n: NotificationRow): string {
  switch (n.type) {
    case "friend_request":
    case "friend_accepted":
      return n.referenceId ? `/profile/${n.referenceId}` : "/team#find-members"
    case "teammate_suggestion":
      return "/team#find-members"
    case "team_invite":
    case "application_received":
    case "application_accepted":
    case "application_rejected":
      return "/team"
    case "new_message":
      return "/chat"
    case "deadline_reminder":
    case "opportunity_match":
      return "/discover"
    case "showcase_like":
      return "/showcase"
    default:
      return "/activity"
  }
}

function timeAgo(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime()
  const minutes = Math.floor(diffMs / 60000)
  if (minutes < 1) return "Just now"
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? "" : "s"} ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`
  const days = Math.floor(hours / 24)
  if (days === 1) return "Yesterday"
  return `${days} days ago`
}

export default function ActivityPage() {
  const [activities, setActivities] = useState<ActivityRow[]>([])
  const [notifications, setNotifications] = useState<NotificationRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch("/api/activities").then((res) => res.json()),
      fetch("/api/notifications").then((res) => res.json()),
    ])
      .then(([a, n]) => {
        setActivities(a)
        setNotifications(n)
      })
      .finally(() => setLoading(false))
  }, [])

  async function markRead(id: number) {
    const res = await fetch(`/api/notifications/${id}`, { method: "PATCH" })
    if (res.ok) {
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)))
    }
  }

  const unreadCount = notifications.filter((n) => !n.isRead).length

  const stats = [
    {
      label: "Saved Opportunities",
      value: activities.filter((a) => a.type === "saved_opportunity").length,
      icon: Compass,
      color: "#5D7B3D",
    },
    {
      label: "Teams Engaged",
      value: activities.filter((a) => ["joined_team", "created_team", "applied_team"].includes(a.type)).length,
      icon: Users,
      color: "#E4568B",
    },
    {
      label: "Showcases Liked",
      value: activities.filter((a) => a.type === "showcase_liked").length,
      icon: Star,
      color: "#b8922c",
    },
    {
      label: "Total Activity",
      value: activities.length,
      icon: Zap,
      color: "#4a90c0",
    },
  ]

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

      {loading ? (
        <div className="text-center py-20 text-sm text-[var(--v-muted)]">Loading...</div>
      ) : (
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Column — Activity Timeline (60%) */}
        <div className="w-full lg:w-[60%]">
          {/* Stats summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            {stats.map((s) => (
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

            {activities.length === 0 ? (
              <p className="text-sm text-[var(--v-muted)] py-10 text-center">No activity yet.</p>
            ) : (
            <div className="space-y-1">
              {activities.map((item, i) => {
                const meta = activityMeta[item.type] ?? {
                  icon: History,
                  label: item.type,
                  category: "Activity",
                  href: "/dashboard",
                }
                return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <Link
                    href={meta.href}
                    className="relative flex items-start gap-4 md:gap-5 p-3 md:p-4 rounded-2xl hover:bg-[var(--v-card)] transition-colors group"
                  >
                    <div className="hidden md:flex w-[34px] h-[34px] rounded-xl bg-[var(--v-bg-secondary)] border border-[var(--v-border)] items-center justify-center flex-shrink-0 z-10 group-hover:border-[#5D7B3D]/40 transition-colors">
                      <meta.icon className="w-4 h-4 text-[var(--v-muted)] group-hover:text-[#5D7B3D] transition-colors" />
                    </div>

                    <div className="md:hidden w-8 h-8 rounded-lg bg-[var(--v-bg-secondary)] border border-[var(--v-border)] flex items-center justify-center flex-shrink-0 group-hover:border-[#5D7B3D]/40 transition-colors">
                      <meta.icon className="w-3.5 h-3.5 text-[var(--v-muted)] group-hover:text-[#5D7B3D] transition-colors" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-sm font-semibold text-[var(--v-heading)] group-hover:text-[#5D7B3D] transition-colors">{meta.label}</p>
                          <p className="text-xs text-[var(--v-body)] mt-0.5">{item.description}</p>
                        </div>
                        <span className="text-[10px] text-[var(--v-muted)] flex-shrink-0 whitespace-nowrap">{timeAgo(item.createdAt)}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[var(--v-bg-secondary)] border border-[var(--v-border)] text-[var(--v-muted)]">
                          {meta.category}
                        </span>
                        <ArrowRight className="w-3 h-3 text-[var(--v-muted)] opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
                )
              })}
            </div>
            )}
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
                {unreadCount > 0 && (
                  <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-[#E4568B]/10 text-[#E4568B]">
                    {unreadCount} new
                  </span>
                )}
              </div>
            </div>

            {notifications.length === 0 ? (
              <p className="text-sm text-[var(--v-muted)] py-10 text-center">No notifications yet.</p>
            ) : (
            <div className="space-y-2">
              {notifications.map((n, i) => {
                const meta = notificationMeta[n.type] ?? { icon: Bell, color: "#8B93A7" }
                return (
                <motion.div
                  key={n.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.04 }}
                >
                  <Link
                    href={getNotificationHref(n)}
                    onClick={() => { if (!n.isRead) markRead(n.id) }}
                    className={cn(
                      "block bg-[var(--v-card)] rounded-2xl border p-3.5 shadow-card hover:border-[#5D7B3D]/40 transition-colors",
                      !n.isRead ? "border-[#5D7B3D]/30" : "border-[var(--v-border)]",
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div className="relative flex-shrink-0 mt-0.5">
                        <div
                          className="w-9 h-9 rounded-xl flex items-center justify-center"
                          style={{ backgroundColor: `${meta.color}15` }}
                        >
                          <meta.icon className="w-4 h-4" style={{ color: meta.color }} />
                        </div>
                        {!n.isRead && (
                          <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#E4568B] border-2 border-[var(--v-card)]" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="text-sm font-semibold text-[var(--v-heading)]">{n.title}</p>
                            <p className="text-xs text-[var(--v-body)] mt-0.5">{n.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-1.5">
                          <span className="text-[10px] text-[var(--v-muted)]">{timeAgo(n.createdAt)}</span>
                          {!n.isRead ? (
                            <button
                              onClick={(e) => { e.preventDefault(); e.stopPropagation(); markRead(n.id) }}
                              className="text-[10px] font-medium text-[#5D7B3D] hover:underline flex items-center gap-0.5"
                            >
                              <Check className="w-3 h-3" /> Mark read
                            </button>
                          ) : (
                            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[var(--v-bg-secondary)] text-[var(--v-muted)]">Read</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
                )
              })}
            </div>
            )}
          </motion.div>
        </div>
      </div>
      )}
    </div>
  )
}
