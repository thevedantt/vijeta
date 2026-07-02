"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ShowcaseCard } from "@/components/shared/ShowcaseCard"
import { SearchBar } from "@/components/shared/SearchBar"
import { showcases } from "@/lib/data/showcases"
import { Trophy, Eye, Heart } from "lucide-react"

const tagFilters = ["All", "AI", "IoT", "Mobile", "Blockchain", "AR", "Social Impact"]

export default function ShowcasePage() {
  const [search, setSearch] = useState("")
  const [activeTag, setActiveTag] = useState("All")

  const filtered = showcases.filter((s) => {
    const matchesSearch =
      !search ||
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.competition.toLowerCase().includes(search.toLowerCase())
    const matchesTag = activeTag === "All" || s.tags.some((t) => t.includes(activeTag))
    return matchesSearch && matchesTag
  })

  return (
    <div className="min-h-screen bg-[var(--v-bg)] pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <span className="text-sm font-medium text-[#F6C94D] uppercase tracking-widest mb-3 block">
            Showcase
          </span>
          <h1 className="text-4xl font-bold text-[var(--v-heading)] mb-4">
            Student wins, permanently on display
          </h1>
          <p className="text-lg text-[var(--v-body)] max-w-xl mx-auto">
            Real projects from real competitions. Learn from winners. Get inspired. Build the next one.
          </p>

          <div className="flex items-center justify-center gap-8 mt-8">
            {[
              { icon: Trophy, label: "National Winners", value: "42+" },
              { icon: Eye, label: "Total Views", value: "180K+" },
              { icon: Heart, label: "Likes", value: "12K+" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-2xl font-bold text-[var(--v-heading)]">{s.value}</p>
                <p className="text-xs text-[var(--v-muted)] mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <SearchBar
            placeholder="Search showcases, competitions..."
            onSearch={setSearch}
            className="flex-1"
          />
          <div className="flex gap-2 flex-wrap">
            {tagFilters.map((tag) => (
              <button
                key={tag}
                onClick={() => setActiveTag(tag)}
                className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                  activeTag === tag
                    ? "bg-[#5D7B3D] border-[#5D7B3D] text-white"
                    : "bg-[var(--v-card)] border-[var(--v-border)] text-[var(--v-body)] hover:border-[#5D7B3D]"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((showcase, i) => (
            <motion.div
              key={showcase.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
            >
              <ShowcaseCard showcase={showcase} />
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20 text-[var(--v-muted)]">
            <Trophy className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p className="font-medium">No showcases found</p>
            <p className="text-sm mt-1">Try a different search or filter</p>
          </div>
        )}
      </div>
    </div>
  )
}
