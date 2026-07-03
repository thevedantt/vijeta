"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { Users, Trophy, Users2, FolderOpen, GraduationCap, IndianRupee } from "lucide-react"
import { stats } from "@/lib/data/stats"

const iconMap: Record<string, React.ElementType> = {
  Users,
  Trophy,
  Users2,
  FolderOpen,
  GraduationCap,
  IndianRupee,
}

const cardColors = [
  { bg: "#5D7B3D10", border: "#5D7B3D20", icon: "#5D7B3D" },
  { bg: "#F6C94D15", border: "#F6C94D30", icon: "#b8922c" },
  { bg: "#E4568B10", border: "#E4568B20", icon: "#E4568B" },
  { bg: "#A7C7E420", border: "#A7C7E440", icon: "#4a90c0" },
  { bg: "#5D7B3D10", border: "#5D7B3D20", icon: "#5D7B3D" },
  { bg: "#F6C94D15", border: "#F6C94D30", icon: "#b8922c" },
]

export function StatsSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })

  return (
    <section ref={ref} className="py-24 bg-[var(--v-card)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <span className="text-sm font-medium text-[#5D7B3D] uppercase tracking-widest mb-3 block">
            Community
          </span>
          <h2 className="text-4xl font-bold text-[var(--v-heading)] mb-4">
            A growing community of winners
          </h2>
          <p className="text-lg text-[var(--v-body)] max-w-xl mx-auto">
            Join thousands of ambitious students building their future on विजेता.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {stats.map((stat, i) => {
            const Icon = iconMap[stat.icon]
            const color = cardColors[i % cardColors.length]
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.4, delay: i * 0.07 }}
                whileHover={{ scale: 1.03 }}
                className="rounded-[18px] p-5 text-center border"
                style={{ backgroundColor: color.bg, borderColor: color.border }}
              >
                <div
                  className="w-10 h-10 rounded-xl mx-auto mb-3 flex items-center justify-center bg-[var(--v-card)] shadow-sm"
                >
                  {Icon && <Icon className="w-5 h-5" style={{ color: color.icon }} />}
                </div>
                <p className="text-2xl font-bold text-[var(--v-heading)] mb-0.5">
                  {stat.value}{stat.suffix}
                </p>
                <p className="text-xs font-semibold text-[var(--v-body)]">{stat.label}</p>
                <p className="text-xs text-[var(--v-muted)] mt-1 leading-snug">{stat.description}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
