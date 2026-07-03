"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect } from "react"
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
  ChevronLeft,
  X,
  History,
  Bot,
  MessageCircle,
  Sparkles,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { ThemeToggle } from "@/components/theme/ThemeToggle"

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/discover", icon: Compass, label: "Discover" },
  { href: "/team", icon: Users, label: "Team Up" },
  { href: "/showcase", icon: Star, label: "Showcase" },
  { href: "/profile", icon: User, label: "Profile" },
  { href: "/settings", icon: Settings, label: "Settings" },
]

interface DashboardSidebarProps {
  isOpen: boolean
  onClose: () => void
  collapsed: boolean
  onToggleCollapse: () => void
}

export function DashboardSidebar({ isOpen, onClose, collapsed, onToggleCollapse }: DashboardSidebarProps) {
  const pathname = usePathname()

  useEffect(() => {
    onClose()
  }, [pathname])

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={onClose} />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 h-full bg-[var(--v-card)] border-r border-[var(--v-border)] flex flex-col z-40 transition-all duration-200 overflow-x-hidden",
          collapsed ? "w-16" : "w-64",
          "lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {/* Header with collapse toggle */}
        <div className={cn(
          "flex items-center h-16 border-b border-[var(--v-border)] flex-shrink-0",
          collapsed ? "justify-center px-2 gap-1" : "justify-between px-4",
        )}>
          {collapsed ? (
            <>
              <div className="w-8 h-8 rounded-lg bg-[#5D7B3D] flex items-center justify-center flex-shrink-0">
                <Zap className="w-4 h-4 text-white fill-white" />
              </div>
              <button
                onClick={onToggleCollapse}
                className="w-7 h-7 rounded-lg hover-bg-v-hover flex items-center justify-center"
                title="Expand sidebar"
              >
                <ChevronRight className="w-4 h-4 text-[var(--v-muted)]" />
              </button>
            </>
          ) : (
            <>
              <Link href="/" className="flex items-center gap-2 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-[#5D7B3D] flex items-center justify-center flex-shrink-0">
                  <Zap className="w-4 h-4 text-white fill-white" />
                </div>
                <span className="text-lg font-bold text-[var(--v-heading)]">Vijeta</span>
              </Link>
              <div className="flex items-center gap-1">
                <button
                  onClick={onToggleCollapse}
                  className="hidden lg:flex w-7 h-7 rounded-lg hover-bg-v-hover items-center justify-center"
                  title="Collapse sidebar"
                >
                  <ChevronLeft className="w-4 h-4 text-[var(--v-muted)]" />
                </button>
                <button
                  onClick={onClose}
                  className="w-7 h-7 rounded-lg hover-bg-v-hover flex items-center justify-center lg:hidden"
                >
                  <X className="w-4 h-4 text-[var(--v-muted)]" />
                </button>
              </div>
            </>
          )}
        </div>

        {/* Navigation */}
        <nav className={cn(
          "flex-1 overflow-y-auto",
          collapsed ? "px-2 py-4 space-y-1" : "px-4 py-6 space-y-1",
        )}>
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center rounded-xl transition-all duration-150",
                  collapsed
                    ? "justify-center w-12 h-12 mx-auto"
                    : "gap-3 px-3 py-2.5 text-sm font-medium",
                  isActive
                    ? "bg-[#5D7B3D] text-white shadow-sm"
                    : "text-[var(--v-body)] hover-bg-v-hover hover:text-[var(--v-heading)]"
                )}
                title={collapsed ? item.label : undefined}
              >
                <item.icon className={cn("w-4 h-4 flex-shrink-0", isActive ? "text-white" : "text-[var(--v-muted)]")} />
                {!collapsed && (
                  <>
                    {item.label}
                    {isActive && <ChevronRight className="w-3 h-3 ml-auto text-white/70" />}
                  </>
                )}
              </Link>
            )
          })}

          {/* Margdarshak */}
          <Link
            href="/assistant"
            className={cn(
              "flex items-center rounded-xl transition-all duration-150",
              collapsed
                ? "justify-center w-12 h-12 mx-auto"
                : "gap-3 px-3 py-2.5 text-sm font-medium",
              pathname === "/assistant"
                ? "bg-gradient-to-r from-[#5D7B3D] to-[#4a6230] text-white shadow-sm"
                : "text-[var(--v-body)] hover-bg-v-hover hover:text-[var(--v-heading)]"
            )}
            title={collapsed ? "Margdarshak" : undefined}
          >
            <Bot className={cn(
              "w-4 h-4 flex-shrink-0",
              pathname === "/assistant" ? "text-white" : "text-[var(--v-muted)]"
            )} />
            {!collapsed && (
              <>
                <span className="flex items-center gap-1.5">
                  Margdarshak
                  <Sparkles className="w-3 h-3 text-[#F6C94D]" />
                </span>
                {pathname === "/assistant" && <ChevronRight className="w-3 h-3 ml-auto text-white/70" />}
              </>
            )}
          </Link>

          {/* Chat */}
          <Link
            href="/chat"
            className={cn(
              "flex items-center rounded-xl transition-all duration-150",
              collapsed
                ? "justify-center w-12 h-12 mx-auto"
                : "gap-3 px-3 py-2.5 text-sm font-medium",
              pathname === "/chat"
                ? "bg-[#5D7B3D] text-white shadow-sm"
                : "text-[var(--v-body)] hover-bg-v-hover hover:text-[var(--v-heading)]"
            )}
            title={collapsed ? "Chat" : undefined}
          >
            <MessageCircle className={cn("w-4 h-4 flex-shrink-0", pathname === "/chat" ? "text-white" : "text-[var(--v-muted)]")} />
            {!collapsed && (
              <>
                Chat
                {pathname === "/chat" && <ChevronRight className="w-3 h-3 ml-auto text-white/70" />}
              </>
            )}
          </Link>

          {/* Activity - separate route */}
          <Link
            href="/activity"
            className={cn(
              "flex items-center rounded-xl transition-all duration-150",
              collapsed
                ? "justify-center w-12 h-12 mx-auto"
                : "gap-3 px-3 py-2.5 text-sm font-medium",
              pathname === "/activity"
                ? "bg-[#5D7B3D] text-white shadow-sm"
                : "text-[var(--v-body)] hover-bg-v-hover hover:text-[var(--v-heading)]"
            )}
            title={collapsed ? "Activity" : undefined}
          >
            <History className={cn("w-4 h-4 flex-shrink-0", pathname === "/activity" ? "text-white" : "text-[var(--v-muted)]")} />
            {!collapsed && (
              <>
                Activity
                {pathname === "/activity" && <ChevronRight className="w-3 h-3 ml-auto text-white/70" />}
              </>
            )}
          </Link>
        </nav>

        {/* Bottom Section */}
        <div className={cn(
          "border-t border-[var(--v-border)] flex-shrink-0",
          collapsed ? "px-1 py-3" : "px-4 pb-6 pt-4",
        )}>
          <div className={cn(
            "flex items-center",
            collapsed ? "flex-col gap-2" : "gap-2 px-1",
          )}>
            <ThemeToggle />
            {collapsed ? (
              <div className="w-9 h-9 rounded-full bg-cover bg-center border-2 border-[var(--v-border)] flex-shrink-0"
                style={{ backgroundImage: `url(https://api.dicebear.com/9.x/avataaars/svg?seed=AaravSharma)` }}
              />
            ) : (
              <>
                <div className="w-9 h-9 rounded-full bg-cover bg-center border-2 border-[var(--v-border)] flex-shrink-0"
                  style={{ backgroundImage: `url(https://api.dicebear.com/9.x/avataaars/svg?seed=AaravSharma)` }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[var(--v-heading)] truncate">Aarav Sharma</p>
                  <p className="text-xs text-[var(--v-muted)] truncate">IIT Bombay</p>
                </div>
                <Link href="/activity#notifications" className="w-8 h-8 rounded-lg hover-bg-v-hover flex items-center justify-center transition-colors">
                  <Bell className="w-4 h-4 text-[var(--v-muted)]" />
                </Link>
              </>
            )}
          </div>
        </div>
      </aside>
    </>
  )
}
