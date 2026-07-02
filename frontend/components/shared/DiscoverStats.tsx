"use client"

import { useCallback } from "react"
import { Briefcase, Users, Trophy, Sparkles } from "lucide-react"
import { StatCard } from "./StatCard"
import { opportunities } from "@/lib/data/opportunities"
import { students } from "@/lib/data/students"

export function DiscoverStats() {
  const scrollToOpportunities = useCallback(() => {
    const el = document.getElementById("opportunities")
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }, [])

  const stats = [
    {
      icon: Briefcase,
      label: "Live Opportunities",
      value: opportunities.filter((o) => new Date(o.deadline) > new Date()).length,
      color: "#5D7B3D",
      max: 20,
      context: "Scroll to browse",
      trend: "up" as const,
      subtitle: "active",
      onClick: scrollToOpportunities,
    },
    {
      icon: Users,
      label: "Active Students",
      value: students.length,
      color: "#4a90c0",
      max: 100,
      context: "Find your teammate",
      trend: "up" as const,
      subtitle: "on platform",
      href: "/team#find-members",
    },
    {
      icon: Trophy,
      label: "Teams Formed",
      value: 48,
      color: "#b8922c",
      max: 60,
      context: "View all teams",
      trend: "up" as const,
      subtitle: "this month",
      href: "/team#open-teams",
    },
    {
      icon: Sparkles,
      label: "AI Matches",
      value: 156,
      color: "#E4568B",
      context: "Ask Margdarshak",
      trend: "up" as const,
      subtitle: "recommended",
      href: "/assistant",
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {stats.map((stat, i) => (
        <StatCard key={stat.label} {...stat} index={i} />
      ))}
    </div>
  )
}
