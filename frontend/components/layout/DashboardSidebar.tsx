"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Compass,
  Users,
  Star,
  User,
  Settings,
  Zap,
  Bell,
  ChevronRight,
} from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/discover", icon: Compass, label: "Discover" },
  { href: "/team", icon: Users, label: "Team Up" },
  { href: "/showcase", icon: Star, label: "Showcase" },
  { href: "/profile", icon: User, label: "Profile" },
  { href: "/settings", icon: Settings, label: "Settings" },
]

export function DashboardSidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-[#E8E8E8] flex flex-col z-40">
      <div className="flex items-center gap-2 px-6 h-16 border-b border-[#E8E8E8]">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#5D7B3D] flex items-center justify-center">
            <Zap className="w-4 h-4 text-white fill-white" />
          </div>
          <span className="text-lg font-bold text-[#1F2430]">Vijeta</span>
        </Link>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150",
                isActive
                  ? "bg-[#5D7B3D] text-white shadow-sm"
                  : "text-[#5E6677] hover:bg-gray-50 hover:text-[#1F2430]"
              )}
            >
              <item.icon className={cn("w-4 h-4", isActive ? "text-white" : "text-[#8B93A7]")} />
              {item.label}
              {isActive && <ChevronRight className="w-3 h-3 ml-auto text-white/70" />}
            </Link>
          )
        })}
      </nav>

      <div className="px-4 pb-6">
        <div className="rounded-xl bg-gradient-to-br from-[#5D7B3D]/10 to-[#A7C7E4]/10 border border-[#E8E8E8] p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-lg bg-[#F6C94D]/20 flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 text-[#F6C94D]" />
            </div>
            <span className="text-xs font-semibold text-[#1F2430]">AI Assistant</span>
          </div>
          <p className="text-xs text-[#8B93A7] mb-3">Ask anything about competitions, teams, or your roadmap.</p>
          <button className="w-full text-xs font-medium bg-[#5D7B3D] text-white py-2 rounded-lg hover:bg-[#4a6230] transition-colors">
            Start a Conversation
          </button>
        </div>

        <div className="mt-4 flex items-center gap-3 px-1">
          <div
            className="w-9 h-9 rounded-full bg-cover bg-center border-2 border-[#E8E8E8]"
            style={{ backgroundImage: `url(https://api.dicebear.com/9.x/avataaars/svg?seed=AaravSharma)` }}
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-[#1F2430] truncate">Aarav Sharma</p>
            <p className="text-xs text-[#8B93A7] truncate">IIT Bombay</p>
          </div>
          <button className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors">
            <Bell className="w-4 h-4 text-[#8B93A7]" />
          </button>
        </div>
      </div>
    </aside>
  )
}
