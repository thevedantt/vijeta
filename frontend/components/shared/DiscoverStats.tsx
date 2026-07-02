"use client"

import { Briefcase, Users, Trophy, Sparkles } from "lucide-react"
import { StatCard } from "./StatCard"
import { opportunities } from "@/lib/data/opportunities"
import { students } from "@/lib/data/students"

const stats = [
  {
    icon: Briefcase,
    label: "Live Opportunities",
    value: opportunities.filter((o) => new Date(o.deadline) > new Date()).length,
    color: "#5D7B3D",
    max: 20,
    context: "Closing soon: 3 this week",
    trend: "up" as const,
    subtitle: "active",
  },
  {
    icon: Users,
    label: "Active Students",
    value: students.length,
    color: "#4a90c0",
    max: 100,
    context: "12 joined this week",
    trend: "up" as const,
    subtitle: "on platform",
  },
  {
    icon: Trophy,
    label: "Teams Formed",
    value: 48,
    color: "#b8922c",
    max: 60,
    context: "83% milestone reached",
    trend: "up" as const,
    subtitle: "this month",
  },
  {
    icon: Sparkles,
    label: "AI Matches",
    value: 156,
    color: "#E4568B",
    context: "+42 since last week",
    trend: "up" as const,
    subtitle: "recommended",
  },
]

export function DiscoverStats() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {stats.map((stat, i) => (
        <StatCard key={stat.label} {...stat} index={i} />
      ))}
    </div>
  )
}
