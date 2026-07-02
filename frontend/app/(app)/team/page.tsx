"use client"

import { useState, useMemo, useEffect } from "react"
import { motion } from "framer-motion"
import { Users, Plus, Navigation } from "lucide-react"
import { TeamCard } from "@/components/shared/TeamCard"
import { StudentCard } from "@/components/shared/StudentCard"
import { SearchBar } from "@/components/shared/SearchBar"
import { NearbyMap } from "@/components/shared/NearbyMap"
import { CreateTeamModal } from "@/components/shared/CreateTeamModal"
import { teams as initialTeams } from "@/lib/data/teams"
import { students } from "@/lib/data/students"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const tabs = ["Open Teams", "Find Members", "Nearby Map"]

type LocationKey = "all" | "mumbai" | "navimumbai" | "pune" | "bangalore" | "delhi" | "maharashtra" | "south" | "north"

interface LocationFilter {
  key: LocationKey
  label: string
  cities: string[]
  center: [number, number]
  zoom: number
}

const locationFilters: LocationFilter[] = [
  { key: "all", label: "All India", cities: [], center: [78.9629, 22.5937], zoom: 4.5 },
  { key: "mumbai", label: "Mumbai", cities: ["Mumbai"], center: [19.076, 72.8777], zoom: 10 },
  { key: "navimumbai", label: "Navi Mumbai", cities: ["Mumbai"], center: [19.033, 73.029], zoom: 10 },
  { key: "pune", label: "Pune", cities: ["Pune"], center: [18.5204, 73.8567], zoom: 11 },
  { key: "bangalore", label: "Bangalore", cities: ["Bangalore"], center: [12.9716, 77.5946], zoom: 11 },
  { key: "delhi", label: "Delhi NCR", cities: ["Delhi", "Noida"], center: [28.6139, 77.209], zoom: 10 },
  { key: "maharashtra", label: "Maharashtra", cities: ["Mumbai", "Pune", "Nagpur", "Navi Mumbai"], center: [19.0, 76.0], zoom: 6.5 },
  { key: "south", label: "South India", cities: ["Bangalore", "Chennai", "Hyderabad", "Thiruvananthapuram", "Manipal", "Mangalore", "Tiruchirapalli", "Coimbatore"], center: [13.0, 78.0], zoom: 5.5 },
  { key: "north", label: "North India", cities: ["Delhi", "Noida", "Jaipur", "Lucknow", "Kanpur", "Chandigarh", "Ahmedabad", "Pilani", "Aligarh", "Roorkee", "Varanasi"], center: [26.0, 78.0], zoom: 5.5 },
]

const locationGroups = [
  { label: "Cities", filters: locationFilters.filter((f) => ["mumbai", "navimumbai", "pune", "bangalore", "delhi"].includes(f.key)) },
  { label: "Regions", filters: locationFilters.filter((f) => ["maharashtra", "south", "north"].includes(f.key)) },
]

export default function TeamPage() {
  const [activeTab, setActiveTab] = useState(0)
  const [search, setSearch] = useState("")
  const [activeLocation, setActiveLocation] = useState<LocationKey>("all")
  const [createOpen, setCreateOpen] = useState(false)
  const [teamsList, setTeamsList] = useState(initialTeams)

  useEffect(() => {
    const hash = window.location.hash.replace("#", "")
    if (hash === "find-members") setActiveTab(1)
    else if (hash === "open-teams") setActiveTab(0)
  }, [])

  const currentFilter = locationFilters.find((f) => f.key === activeLocation)!

  const filteredStudents = students.filter(
    (s) =>
      (!search ||
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.skills.some((sk) => sk.toLowerCase().includes(search.toLowerCase())))
  )

  const filteredTeams = teamsList.filter(
    (t) =>
      t.isOpen &&
      (!search ||
        t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.opportunity.toLowerCase().includes(search.toLowerCase()))
  )

  const mapStudents = useMemo(() => {
    if (activeLocation === "all") return students
    return students.filter((s) => currentFilter.cities.includes(s.city))
  }, [activeLocation, currentFilter.cities])

  return (
    <div className="p-4 md:p-8 max-w-7xl">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-xl bg-[#E4568B]/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-[#E4568B]" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[var(--v-heading)]">Team Up</h1>
              <p className="text-[var(--v-muted)] text-sm">Find the perfect team or recruit great teammates.</p>
            </div>
          </div>
          <Button onClick={() => setCreateOpen(true)} className="bg-[#E4568B] hover:bg-[#cc3f79] text-white rounded-[14px] gap-2">
            <Plus className="w-4 h-4" /> Create Team
          </Button>
        </div>
      </motion.div>

      {/* Tab Bar */}
      <div className="flex gap-2 mb-6 p-1 bg-[var(--v-card)] rounded-xl border border-[var(--v-border)] w-fit shadow-sm">
        {tabs.map((tab, i) => (
          <button
            key={tab}
            onClick={() => setActiveTab(i)}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150",
              activeTab === i
                ? "bg-[#E4568B] text-white shadow-sm"
                : "text-[var(--v-body)] hover:text-[var(--v-heading)] hover-bg-v-hover",
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab !== 2 && (
        <div className="mb-6">
          <SearchBar
            placeholder={activeTab === 0 ? "Search teams, competitions..." : "Search by name or skill..."}
            onSearch={setSearch}
            className="max-w-xl"
          />
        </div>
      )}

      {/* Open Teams Tab */}
      {activeTab === 0 && (
        <>
          <p className="text-sm text-[var(--v-muted)] mb-4">
            <span className="font-semibold text-[var(--v-heading)]">{filteredTeams.length}</span> open teams
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredTeams.map((team, i) => (
              <motion.div
                key={team.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
              >
                <TeamCard team={team} />
              </motion.div>
            ))}
          </div>
        </>
      )}

      {/* Find Members Tab */}
      {activeTab === 1 && (
        <>
          <p className="text-sm text-[var(--v-muted)] mb-4">
            <span className="font-semibold text-[var(--v-heading)]">{filteredStudents.length}</span> students available
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredStudents.map((student, i) => (
              <motion.div
                key={student.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <StudentCard student={student} />
              </motion.div>
            ))}
          </div>
        </>
      )}

      <CreateTeamModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreate={(team) => setTeamsList((prev) => [team, ...prev])}
      />

      {/* Nearby Map Tab */}
      {activeTab === 2 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="flex items-center gap-2 mb-3">
            <Navigation className="w-4 h-4 text-[#E4568B]" />
            <p className="text-sm text-[var(--v-muted)]">
              Students near{" "}
              <span className="font-semibold text-[var(--v-heading)]">{currentFilter.label}</span>
              {" — "}
              <span className="font-semibold text-[var(--v-heading)]">{mapStudents.length}</span> students found
            </p>
          </div>

          {/* Location Filters */}
          <div className="flex flex-col gap-2 mb-4">
            {locationGroups.map((group) => (
              <div key={group.label} className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-semibold text-[var(--v-muted)] uppercase tracking-wider w-14 flex-shrink-0">
                  {group.label}
                </span>
                <div className="flex gap-1.5 flex-wrap">
                  {group.filters.map((f) => (
                    <button
                      key={f.key}
                      onClick={() => setActiveLocation(f.key)}
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-xs font-medium border transition-all",
                        activeLocation === f.key
                          ? "bg-[#E4568B] border-[#E4568B] text-white shadow-sm"
                          : "bg-[var(--v-card)] border-[var(--v-border)] text-[var(--v-body)] hover:border-[#E4568B] hover:text-[#E4568B]",
                      )}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Map */}
          <NearbyMap
            key={activeLocation}
            students={mapStudents}
            center={currentFilter.center}
            zoom={currentFilter.zoom}
          />
        </motion.div>
      )}
    </div>
  )
}
