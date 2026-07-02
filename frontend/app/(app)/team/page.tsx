"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Users, Plus, MapPin } from "lucide-react"
import { TeamCard } from "@/components/shared/TeamCard"
import { StudentCard } from "@/components/shared/StudentCard"
import { SearchBar } from "@/components/shared/SearchBar"
import { NearbyMap } from "@/components/shared/NearbyMap"
import { teams } from "@/lib/data/teams"
import { students } from "@/lib/data/students"
import { Button } from "@/components/ui/button"

const tabs = ["Open Teams", "Find Members", "Nearby Map"]

export default function TeamPage() {
  const [activeTab, setActiveTab] = useState(0)
  const [search, setSearch] = useState("")

  const filteredTeams = teams.filter(
    (t) =>
      t.isOpen &&
      (!search ||
        t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.opportunity.toLowerCase().includes(search.toLowerCase()))
  )

  const filteredStudents = students.filter(
    (s) =>
      !search ||
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.skills.some((sk) => sk.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <div className="p-8 max-w-7xl">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-xl bg-[#E4568B]/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-[#E4568B]" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#1F2430]">Team Up</h1>
              <p className="text-[#8B93A7] text-sm">Find the perfect team or recruit great teammates.</p>
            </div>
          </div>
          <Button className="bg-[#E4568B] hover:bg-[#cc3f79] text-white rounded-[14px] gap-2">
            <Plus className="w-4 h-4" /> Create Team
          </Button>
        </div>
      </motion.div>

      <div className="flex gap-2 mb-6 p-1 bg-white rounded-xl border border-[#E8E8E8] w-fit shadow-sm">
        {tabs.map((tab, i) => (
          <button
            key={tab}
            onClick={() => setActiveTab(i)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
              activeTab === i
                ? "bg-[#E4568B] text-white shadow-sm"
                : "text-[#5E6677] hover:text-[#1F2430] hover:bg-gray-50"
            }`}
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

      {activeTab === 0 && (
        <>
          <p className="text-sm text-[#8B93A7] mb-4">
            <span className="font-semibold text-[#1F2430]">{filteredTeams.length}</span> open teams
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

      {activeTab === 1 && (
        <>
          <p className="text-sm text-[#8B93A7] mb-4">
            <span className="font-semibold text-[#1F2430]">{filteredStudents.length}</span> students available
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

      {activeTab === 2 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="w-4 h-4 text-[#8B93A7]" />
            <p className="text-sm text-[#8B93A7]">
              Students across India — click a marker to view profile
            </p>
          </div>
          <NearbyMap />
        </motion.div>
      )}
    </div>
  )
}
