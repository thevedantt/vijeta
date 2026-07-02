"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, Trophy, Users, BookOpen, Star } from "lucide-react"
import { Button } from "@/components/ui/button"

const floatingCards = [
  {
    icon: Trophy,
    iconColor: "#F6C94D",
    iconBg: "#F6C94D20",
    label: "SIH 2024 Winner",
    sub: "₹1,00,000 prize",
    pos: "top-8 right-8",
  },
  {
    icon: Users,
    iconColor: "#5D7B3D",
    iconBg: "#5D7B3D20",
    label: "Team Found",
    sub: "In 2 hours",
    pos: "top-1/3 -right-6",
  },
  {
    icon: BookOpen,
    iconColor: "#A7C7E4",
    iconBg: "#A7C7E420",
    label: "Guidance Library",
    sub: "2,100+ projects",
    pos: "bottom-1/3 right-4",
  },
  {
    icon: Star,
    iconColor: "#E4568B",
    iconBg: "#E4568B20",
    label: "Showcase Published",
    sub: "14K views",
    pos: "bottom-8 right-16",
  },
]

const stats = [
  { value: "24K+", label: "Students" },
  { value: "1,200+", label: "Opportunities" },
  { value: "4,800+", label: "Teams" },
]

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-[var(--v-bg-secondary)] via-[var(--v-card)] to-[#F0F7EC]">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-[#5D7B3D]/8 to-[#A7C7E4]/8 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-[#F6C94D]/6 to-[#E4568B]/6 blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 pt-32">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#5D7B3D]/10 border border-[#5D7B3D]/20 mb-6"
            >
              <span className="w-2 h-2 rounded-full bg-[#5D7B3D] animate-pulse" />
              <span className="text-sm font-medium text-[#5D7B3D]">
                India's Student Competition Platform
              </span>
            </motion.div>

              <h1 className="text-5xl sm:text-6xl font-bold text-[var(--v-heading)] leading-[1.1] tracking-tight mb-6">
              Become the student{" "}
              <span className="text-[#5D7B3D]">everyone</span>{" "}
              remembers.
            </h1>

            <p className="text-xl text-[var(--v-body)] leading-relaxed mb-8 max-w-lg">
              Discover opportunities. Build with great teammates.
              Win competitions. Guide the next generation.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Link href="/dashboard">
                <Button className="h-12 px-8 rounded-[14px] bg-[#5D7B3D] hover:bg-[#4a6230] text-white text-base font-medium gap-2 group">
                  Start Your Journey
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/showcase">
                <Button
                  variant="outline"
                  className="h-12 px-8 rounded-[14px] border-[#E8E8E8] text-[#1F2430] text-base font-medium hover:border-[#5D7B3D] hover:text-[#5D7B3D]"
                >
                  Explore Winners
                </Button>
              </Link>
            </div>

            <div className="flex items-center gap-8">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <p className="text-2xl font-bold text-[var(--v-heading)]">{stat.value}</p>
                  <p className="text-sm text-[var(--v-muted)]">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative hidden lg:block h-[520px]"
          >
            <div className="absolute inset-8 rounded-3xl bg-gradient-to-br from-[#5D7B3D]/15 via-[#A7C7E4]/10 to-[#F6C94D]/10 border border-[#E8E8E8]" />

            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-72 h-72">
                <div className="absolute inset-0 rounded-full border-2 border-dashed border-[#5D7B3D]/20 animate-spin" style={{ animationDuration: "20s" }} />
                <div className="absolute inset-8 rounded-full border-2 border-dashed border-[#A7C7E4]/30 animate-spin" style={{ animationDuration: "15s", animationDirection: "reverse" }} />

                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-24 h-24 rounded-2xl bg-[var(--v-card)] shadow-card border border-[var(--v-border)] flex items-center justify-center">
                    <div className="text-4xl font-bold text-[#5D7B3D]">V</div>
                  </div>
                </div>

                {[
                  { angle: 0, color: "#5D7B3D", bg: "#5D7B3D20", icon: "🏆" },
                  { angle: 90, color: "#F6C94D", bg: "#F6C94D20", icon: "👥" },
                  { angle: 180, color: "#A7C7E4", bg: "#A7C7E420", icon: "📚" },
                  { angle: 270, color: "#E4568B", bg: "#E4568B20", icon: "🚀" },
                ].map((node, i) => {
                  const rad = (node.angle * Math.PI) / 180
                  const x = 50 + 42 * Math.cos(rad - Math.PI / 2)
                  const y = 50 + 42 * Math.sin(rad - Math.PI / 2)
                  return (
                    <motion.div
                      key={i}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.5 + i * 0.1 }}
                      style={{ left: `${x}%`, top: `${y}%`, transform: "translate(-50%, -50%)" }}
                      className="absolute w-12 h-12 rounded-xl bg-[var(--v-card)] shadow-card border border-[var(--v-border)] flex items-center justify-center text-xl"
                    >
                      {node.icon}
                    </motion.div>
                  )
                })}
              </div>
            </div>

            {floatingCards.map((card, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + i * 0.15, duration: 0.5 }}
                className={`absolute ${card.pos} bg-[var(--v-card)] rounded-2xl border border-[var(--v-border)] shadow-card px-4 py-3 flex items-center gap-3`}
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: card.iconBg }}
                >
                  <card.icon className="w-4 h-4" style={{ color: card.iconColor }} />
                </div>
                <div>
                  <p className="text-xs font-semibold text-[var(--v-heading)]">{card.label}</p>
                  <p className="text-xs text-[var(--v-muted)]">{card.sub}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
