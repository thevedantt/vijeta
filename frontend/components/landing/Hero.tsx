"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, Trophy, Users, BookOpen, Star } from "lucide-react"
import { Button } from "@/components/ui/button"

const floatingCards = [
  { icon: Trophy, iconColor: "#5D7B3D", iconBg: "#5D7B3D20", label: "SIH 2024 Winner", sub: "₹1,00,000 prize", pos: "top-8 right-8" },
  { icon: Users, iconColor: "#5D7B3D", iconBg: "#5D7B3D20", label: "Team Found", sub: "In 2 hours", pos: "top-1/3 -right-6" },
  { icon: BookOpen, iconColor: "#5D7B3D", iconBg: "#5D7B3D20", label: "Guidance Library", sub: "2,100+ projects", pos: "bottom-1/3 right-4" },
  { icon: Star, iconColor: "#5D7B3D", iconBg: "#5D7B3D20", label: "Showcase Published", sub: "14K views", pos: "bottom-8 right-16" },
]

const stats = [
  { value: "24K+", label: "Students" },
  { value: "1,200+", label: "Opportunities" },
  { value: "4,800+", label: "Teams" },
]

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-[var(--v-bg)]">
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
                  className="h-12 px-8 rounded-[14px] border-[var(--v-border)] text-[var(--v-heading)] text-base font-medium hover:border-[#5D7B3D] hover:text-[#5D7B3D]"
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
            className="relative h-[400px] sm:h-[480px] lg:h-[520px]"
          >
            <div className="absolute inset-4 sm:inset-6 lg:inset-8 rounded-3xl bg-[var(--v-card)] border border-[var(--v-border)] shadow-card" />

            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-48 h-48 sm:w-60 sm:h-60 lg:w-72 lg:h-72">
                <img src="/vijeta.png" alt="विजेता" className="w-full h-full rounded-full object-cover shadow-card border border-[var(--v-border)]" />
              </div>
            </div>

            {[
              { icon: "🏆", pos: "top-4 sm:top-6 lg:top-8 left-4 sm:left-6 lg:left-8" },
              { icon: "👥", pos: "top-4 sm:top-6 lg:top-8 right-4 sm:right-6 lg:right-8" },
              { icon: "📚", pos: "bottom-4 sm:bottom-6 lg:bottom-8 left-4 sm:left-6 lg:left-8" },
              { icon: "🚀", pos: "bottom-4 sm:bottom-6 lg:bottom-8 right-4 sm:right-6 lg:right-8" },
            ].map((node, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + i * 0.12 }}
                className={`absolute ${node.pos} w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-xl bg-[var(--v-card)] shadow-card border border-[var(--v-border)] flex items-center justify-center text-base sm:text-lg lg:text-xl`}
              >
                {node.icon}
              </motion.div>
            ))}

            {floatingCards.map((card, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + i * 0.15, duration: 0.5 }}
                className={`absolute ${card.pos} bg-[var(--v-card)] rounded-2xl border border-[var(--v-border)] shadow-card px-3 py-2 sm:px-4 sm:py-3 flex items-center gap-2 sm:gap-3`}
              >
                <div
                  className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: card.iconBg }}
                >
                  <card.icon className="w-3 h-3 sm:w-3.5 sm:h-3.5 lg:w-4 lg:h-4" style={{ color: card.iconColor }} />
                </div>
                <div>
                  <p className="text-[10px] sm:text-xs font-semibold text-[var(--v-heading)]">{card.label}</p>
                  <p className="text-[10px] sm:text-xs text-[var(--v-muted)]">{card.sub}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
