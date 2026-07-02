"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Compass, SlidersHorizontal, X } from "lucide-react"
import { OpportunityCard } from "@/components/shared/OpportunityCard"
import { SearchBar } from "@/components/shared/SearchBar"
import { Filters } from "@/components/shared/Filters"
import { opportunities } from "@/lib/data/opportunities"

const filters = [
  {
    label: "Type",
    key: "type",
    options: [
      { label: "Hackathon", value: "Hackathon" },
      { label: "Scholarship", value: "Scholarship" },
      { label: "Competition", value: "Competition" },
      { label: "Fellowship", value: "Fellowship" },
      { label: "Internship", value: "Internship" },
      { label: "Research", value: "Research" },
    ],
  },
  {
    label: "Difficulty",
    key: "difficulty",
    options: [
      { label: "Beginner", value: "Beginner" },
      { label: "Intermediate", value: "Intermediate" },
      { label: "Advanced", value: "Advanced" },
    ],
  },
  {
    label: "Mode",
    key: "remote",
    options: [
      { label: "Remote", value: "remote" },
      { label: "In-Person", value: "inperson" },
    ],
  },
]

export default function DiscoverPage() {
  const [search, setSearch] = useState("")
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({})
  const [showFilters, setShowFilters] = useState(false)

  const filtered = opportunities.filter((opp) => {
    const matchesSearch =
      !search ||
      opp.title.toLowerCase().includes(search.toLowerCase()) ||
      opp.organizer.toLowerCase().includes(search.toLowerCase()) ||
      opp.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()))
    const matchesType = !activeFilters.type || opp.type === activeFilters.type
    const matchesDifficulty = !activeFilters.difficulty || opp.difficulty === activeFilters.difficulty
    const matchesRemote =
      !activeFilters.remote ||
      (activeFilters.remote === "remote" && opp.isRemote) ||
      (activeFilters.remote === "inperson" && !opp.isRemote)
    return matchesSearch && matchesType && matchesDifficulty && matchesRemote
  })

  return (
    <div className="p-8 max-w-7xl">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-9 h-9 rounded-xl bg-[#5D7B3D]/10 flex items-center justify-center">
            <Compass className="w-5 h-5 text-[#5D7B3D]" />
          </div>
          <h1 className="text-2xl font-bold text-[#1F2430]">Discover</h1>
        </div>
        <p className="text-[#8B93A7] ml-12">Find the right opportunity for your skills and goals.</p>
      </motion.div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className={`lg:w-64 flex-shrink-0 ${showFilters ? "block" : "hidden lg:block"}`}>
          <div className="bg-white rounded-[18px] border border-[#E8E8E8] p-5 shadow-card sticky top-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-sm text-[#1F2430]">Filters</h3>
              <button
                onClick={() => setShowFilters(false)}
                className="lg:hidden w-6 h-6 rounded-md hover:bg-gray-100 flex items-center justify-center"
              >
                <X className="w-4 h-4 text-[#8B93A7]" />
              </button>
            </div>
            <Filters filters={filters} onFilterChange={setActiveFilters} />
          </div>
        </div>

        <div className="flex-1">
          <div className="flex gap-3 mb-6">
            <SearchBar
              placeholder="Search opportunities, tags, organizers..."
              onSearch={setSearch}
              className="flex-1"
            />
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden w-11 h-11 rounded-xl border border-[#E8E8E8] bg-white flex items-center justify-center shadow-sm"
            >
              <SlidersHorizontal className="w-4 h-4 text-[#5E6677]" />
            </button>
          </div>

          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-[#8B93A7]">
              <span className="font-semibold text-[#1F2430]">{filtered.length}</span> opportunities found
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((opp, i) => (
              <motion.div
                key={opp.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <OpportunityCard opportunity={opp} />
              </motion.div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20 text-[#8B93A7]">
              <Compass className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p className="font-medium">No opportunities found</p>
              <p className="text-sm mt-1">Try a different search or clear filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
