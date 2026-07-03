"use client"

import { useState, useMemo, useEffect } from "react"
import { motion } from "framer-motion"
import { Compass, SlidersHorizontal, X, MapPin } from "lucide-react"
import { OpportunityCard } from "@/components/shared/OpportunityCard"
import { SearchBar } from "@/components/shared/SearchBar"
import { Filters } from "@/components/shared/Filters"
import { DiscoverStats } from "@/components/shared/DiscoverStats"
import { AISuggestions } from "@/components/shared/AISuggestions"
import { OpportunityMap } from "@/components/shared/OpportunityMap"
import type { Opportunity } from "@/types"
import { cn } from "@/lib/utils"

const filterConfig = [
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
  const [opportunities, setOpportunities] = useState<Opportunity[]>([])
  const [studentsCount, setStudentsCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({})
  const [showFilters, setShowFilters] = useState(false)
  const [showInPerson, setShowInPerson] = useState(false)

  useEffect(() => {
    Promise.all([
      fetch("/api/opportunities").then((res) => res.json()),
      fetch("/api/users").then((res) => res.json()),
    ])
      .then(([opps, users]) => {
        setOpportunities(opps)
        setStudentsCount(users.length)
      })
      .finally(() => setLoading(false))
  }, [])

  const filtered = useMemo(
    () =>
      opportunities.filter((opp) => {
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
        const matchesMap = !showInPerson || (!opp.isRemote && opp.lat && opp.lng)
        return matchesSearch && matchesType && matchesDifficulty && matchesRemote && matchesMap
      }),
    [search, activeFilters, showInPerson],
  )

  const mapOpportunities = useMemo(
    () => opportunities.filter((o) => o.lat && o.lng && (showInPerson ? !o.isRemote : true)),
    [showInPerson],
  )

  return (
    <div className="p-4 md:p-8 max-w-7xl">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-9 h-9 rounded-xl bg-[#5D7B3D]/10 flex items-center justify-center">
            <Compass className="w-5 h-5 text-[#5D7B3D]" />
          </div>
          <h1 className="text-2xl font-bold text-[var(--v-heading)]">Discover</h1>
        </div>
        <p className="text-[var(--v-muted)] ml-12">Find opportunities across India — hackathons, scholarships, competitions, and more.</p>
      </motion.div>

      {/* Stats Row */}
      <div className="mb-6">
        <DiscoverStats opportunities={opportunities} studentsCount={studentsCount} />
      </div>

      {/* Search + Inline Filters Row */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="flex-1 flex gap-3">
          <SearchBar
            placeholder="Search by title, organizer, or tag..."
            onSearch={setSearch}
            className="flex-1"
          />
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              "w-11 h-11 rounded-xl border border-[var(--v-border)] bg-[var(--v-card)] flex items-center justify-center shadow-sm transition-colors",
              showFilters ? "bg-[#5D7B3D]/10 border-[#5D7B3D]" : "",
            )}
          >
            <SlidersHorizontal className={cn("w-4 h-4", showFilters ? "text-[#5D7B3D]" : "text-[var(--v-muted)]")} />
          </button>
        </div>
        <button
          onClick={() => setShowInPerson(!showInPerson)}
          className={cn(
            "flex items-center gap-2 px-4 h-11 rounded-xl border transition-colors text-sm font-medium shadow-sm whitespace-nowrap",
            showInPerson
              ? "bg-[#5D7B3D]/10 border-[#5D7B3D] text-[#5D7B3D]"
              : "bg-[var(--v-card)] border-[var(--v-border)] text-[var(--v-body)] hover:border-[#5D7B3D]",
          )}
        >
          <MapPin className="w-4 h-4" />
          On Map
        </button>
      </div>

      {/* Filters Drawer */}
      <div className={cn("mb-5 overflow-hidden transition-all duration-200", showFilters ? "max-h-96 opacity-100" : "max-h-0 opacity-0")}>
        <div className="bg-[var(--v-card)] rounded-[18px] border border-[var(--v-border)] p-5 shadow-card">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-sm text-[var(--v-heading)]">Filters</h3>
            <button onClick={() => setShowFilters(false)} className="w-6 h-6 rounded-md hover-bg-v-hover flex items-center justify-center">
              <X className="w-4 h-4 text-[var(--v-muted)]" />
            </button>
          </div>
          <Filters filters={filterConfig} onFilterChange={setActiveFilters} />
        </div>
      </div>

      {/* Main 2-Column Layout */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left - Opportunities */}
        <div className="flex-1 min-w-0 space-y-5">
          {/* AI Suggestions */}
          <AISuggestions />

          {/* Opportunities Grid */}
          <div id="opportunities">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-[var(--v-muted)]">
                <span className="font-semibold text-[var(--v-heading)]">{filtered.length}</span> opportunities found
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

            {loading && (
              <div className="text-center py-20 text-sm text-[var(--v-muted)]">Loading...</div>
            )}

            {!loading && filtered.length === 0 && (
              <div className="text-center py-20 text-[var(--v-muted)]">
                <Compass className="w-12 h-12 mx-auto mb-4 opacity-30" />
                <p className="font-medium">No opportunities found</p>
                <p className="text-sm mt-1">Try a different search or clear filters</p>
              </div>
            )}
          </div>
        </div>

        {/* Right - Opportunity Map (desktop) */}
        <div className="hidden lg:block lg:w-[360px] xl:w-[420px] flex-shrink-0">
          <div className="sticky top-4 space-y-4">
            <div className="flex items-center gap-2 mb-1">
              <MapPin className="w-4 h-4 text-[#5D7B3D]" />
              <span className="text-sm font-semibold text-[var(--v-heading)]">{mapOpportunities.length} opportunities on map</span>
            </div>
            <OpportunityMap opportunities={mapOpportunities} className="h-[500px]" />
          </div>
        </div>
      </div>

      {/* Opportunity Map - mobile */}
      <div className="mt-5 lg:hidden">
        <div className="flex items-center gap-2 mb-3">
          <MapPin className="w-4 h-4 text-[#5D7B3D]" />
          <span className="text-sm font-semibold text-[var(--v-heading)]">{mapOpportunities.length} opportunities on map</span>
        </div>
        <OpportunityMap opportunities={mapOpportunities} />
      </div>
    </div>
  )
}
