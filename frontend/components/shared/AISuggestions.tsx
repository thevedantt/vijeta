"use client"

import { motion } from "framer-motion"
import { Sparkles, ArrowRight, Zap, Target, Lightbulb } from "lucide-react"

const suggestions = [
  {
    icon: Zap,
    title: "Smart India Hackathon",
    subtitle: "Based on your React & Python skills",
    match: "95% match",
    color: "green",
  },
  {
    icon: Target,
    title: "Google Summer of Code",
    subtitle: "Your open source experience fits",
    match: "88% match",
    color: "blue",
  },
  {
    icon: Lightbulb,
    title: "RBI FinTech Hackathon",
    subtitle: "Aligns with your FinTech interest",
    match: "82% match",
    color: "yellow",
  },
]

const colorMap = {
  green: { bg: "bg-[#5D7B3D]/10", text: "text-[#5D7B3D]", badge: "bg-[#5D7B3D]" },
  blue: { bg: "bg-[#A7C7E4]/20", text: "text-[#4a90c0]", badge: "bg-[#4a90c0]" },
  yellow: { bg: "bg-[#F6C94D]/20", text: "text-[#b8922c]", badge: "bg-[#b8922c]" },
}

export function AISuggestions() {
  return (
    <div className="bg-[var(--v-card)] rounded-[18px] border border-[var(--v-border)] p-5 shadow-card">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-[#E4568B]/10 flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-[#E4568B]" />
        </div>
        <div>
          <h3 className="font-bold text-sm text-[var(--v-heading)]">AI Suggestions</h3>
          <p className="text-xs text-[var(--v-muted)]">Personalized for your profile</p>
        </div>
      </div>

      <div className="space-y-2.5">
        {suggestions.map((item, i) => {
          const colors = colorMap[item.color as keyof typeof colorMap]
          const Icon = item.icon
          return (
            <motion.button
              key={item.title}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ x: 2 }}
              className="w-full flex items-center gap-3 p-3 rounded-[14px] border border-[var(--v-border)] hover:border-[#5D7B3D]/30 transition-colors text-left group"
            >
              <div className={`w-9 h-9 rounded-xl ${colors.bg} flex items-center justify-center flex-shrink-0`}>
                <Icon className={`w-4 h-4 ${colors.text}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[var(--v-heading)] truncate">{item.title}</p>
                <p className="text-xs text-[var(--v-muted)] truncate">{item.subtitle}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${colors.bg} ${colors.text}`}>
                  {item.match}
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-[var(--v-muted)] group-hover:text-[#5D7B3D] transition-colors" />
              </div>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
