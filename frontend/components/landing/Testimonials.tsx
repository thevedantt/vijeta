"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { Quote } from "lucide-react"
import { testimonials } from "@/lib/data/testimonials"

const badgeColors: Record<string, { bg: string; text: string }> = {
  Winner: { bg: "#F6C94D20", text: "#b8922c" },
  Scholar: { bg: "#A7C7E420", text: "#4a90c0" },
  Builder: { bg: "#5D7B3D10", text: "#5D7B3D" },
}

export function Testimonials() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })

  return (
    <section ref={ref} className="py-24 bg-[var(--v-bg-secondary)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <span className="text-sm font-medium text-[#5D7B3D] uppercase tracking-widest mb-3 block">
            Student Stories
          </span>
          <h2 className="text-4xl font-bold text-[var(--v-heading)] mb-4">
            Real students. Real wins.
          </h2>
          <p className="text-lg text-[var(--v-body)] max-w-2xl mx-auto">
            Hear from students who discovered, competed, and won on Vijeta.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, i) => {
            const badge = badgeColors[t.badge] || badgeColors.Builder
            return (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="bg-[var(--v-card)] rounded-[18px] border border-[var(--v-border)] p-6 shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-200"
              >
                <div className="flex items-start justify-between mb-4">
                  <Quote className="w-8 h-8 text-[var(--v-border)]" />
                  <span
                    className="text-xs font-semibold px-2.5 py-1 rounded-full"
                    style={{ backgroundColor: badge.bg, color: badge.text }}
                  >
                    {t.badge}
                  </span>
                </div>

                <p className="text-sm text-[var(--v-body)] leading-relaxed mb-5 italic">
                  "{t.text}"
                </p>

                <div className="border-t border-[var(--v-border)] pt-4 flex items-center gap-3">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="w-10 h-10 rounded-full border border-[var(--v-border)] bg-gray-100"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-[var(--v-heading)]">{t.name}</p>
                    <p className="text-xs text-[var(--v-muted)] truncate">{t.year}</p>
                    <p className="text-xs text-[var(--v-muted)] truncate">{t.college}</p>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-[var(--v-border)]">
                  <p className="text-xs text-[var(--v-body)]">
                    <span className="font-medium">{t.competition}</span>
                  </p>
                  <p className="text-xs text-[#5D7B3D] font-medium mt-0.5">{t.outcome}</p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
