"use client"

import { useState, useMemo, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { useUser } from "@clerk/nextjs"
import { Users, Plus, Navigation } from "lucide-react"
import { TeamCard } from "@/components/shared/TeamCard"
import { StudentCard } from "@/components/shared/StudentCard"
import { SearchBar } from "@/components/shared/SearchBar"
import { NearbyMap } from "@/components/shared/NearbyMap"
import { CreateTeamModal } from "@/components/shared/CreateTeamModal"
import type { Team, Student, Opportunity } from "@/types"
import type { FriendStatus } from "@/backend/db/queries/friends"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface PendingRequestDTO {
  id: number
  student: Student
}

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

const mockStudentsByCity: Record<string, Student[]> = {
  Mumbai: [
    { id: "mock-mum-1", name: "Ananya Sharma", avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=AnanyaM", college: "IIT Bombay", degree: "B.Tech CSE", year: 3, city: "Mumbai", skills: ["React", "Python", "AI/ML"], interests: ["Hackathons", "Finance"], lookingFor: ["Team Lead", "Mentor"], bio: "Full-stack developer passionate about AI", wins: 3, projects: 8, badges: [{ label: "Top Performer", color: "yellow" }], lat: 19.076, lng: 72.8777, github: "", linkedin: "", availability: "Full-time" },
    { id: "mock-mum-2", name: "Rohit Patel", avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=RohitM", college: "VJTI Mumbai", degree: "B.Tech IT", year: 4, city: "Mumbai", skills: ["Node.js", "AWS", "Docker"], interests: ["Open Source", "Cloud"], lookingFor: ["Co-founder", "Developer"], bio: "Backend expert with 5+ projects", wins: 2, projects: 12, badges: [{ label: "Builder", color: "blue" }], lat: 19.025, lng: 72.865, github: "", linkedin: "", availability: "Part-time" },
    { id: "mock-mum-3", name: "Priya Singh", avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=PriyaM", college: "NMIMS Mumbai", degree: "MCA", year: 2, city: "Mumbai", skills: ["UI/UX", "Figma", "React Native"], interests: ["Design", "Mobile Dev"], lookingFor: ["Designer", "Frontend"], bio: "Design-minded developer", wins: 1, projects: 5, badges: [], lat: 19.117, lng: 72.906, github: "", linkedin: "", availability: "Full-time" },
    { id: "mock-mum-4", name: "Saniya Kapoor", avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=SaniyaM", college: "Mithibai College Mumbai", degree: "B.Sc. IT", year: 3, city: "Mumbai", skills: ["React", "Node.js", "MongoDB"], interests: ["Full Stack", "Startups"], lookingFor: ["Frontend Dev", "Backend Dev"], bio: "Full stack developer building cool stuff", wins: 2, projects: 6, badges: [], lat: 19.11, lng: 72.865, github: "", linkedin: "", availability: "Full-time" },
  ],
  "Navi Mumbai": [
    { id: "mock-nm-1", name: "Arjun Nair", avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=ArjunNM", college: "DY Patil Navi Mumbai", degree: "B.Tech ME", year: 3, city: "Mumbai", skills: ["IoT", "Arduino", "Python"], interests: ["Hardware", "Automation"], lookingFor: ["Hardware Lead"], bio: "IoT enthusiast building smart devices", wins: 2, projects: 6, badges: [], lat: 19.033, lng: 73.029, github: "", linkedin: "", availability: "Full-time" },
    { id: "mock-nm-2", name: "Kavya Desai", avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=KavyaNM", college: "RAIT Navi Mumbai", degree: "B.E. IT", year: 4, city: "Mumbai", skills: ["Java", "Spring Boot", "SQL"], interests: ["Backend", "System Design"], lookingFor: ["Backend Dev"], bio: "Java developer with microservices experience", wins: 1, projects: 7, badges: [], lat: 19.047, lng: 73.015, github: "", linkedin: "", availability: "Part-time" },
    { id: "mock-nm-3", name: "Siddharth Rao", avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=SiddharthNM", college: "Terna Engineering College", degree: "B.E. CSE", year: 3, city: "Mumbai", skills: ["React", "TypeScript", "Next.js"], interests: ["Web Dev", "Startups"], lookingFor: ["Frontend Lead"], bio: "Frontend specialist building scalable apps", wins: 3, projects: 9, badges: [{ label: "Winner", color: "green" }], lat: 19.021, lng: 73.041, github: "", linkedin: "", availability: "Full-time" },
  ],
  Pune: [
    { id: "mock-pun-1", name: "Neha Joshi", avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=NehaP", college: "COEP Pune", degree: "B.Tech CSE", year: 4, city: "Pune", skills: ["Python", "Django", "ML"], interests: ["AI/ML", "Research"], lookingFor: ["ML Engineer"], bio: "Machine learning researcher", wins: 4, projects: 10, badges: [{ label: "Top Performer", color: "yellow" }, { label: "Builder", color: "blue" }], lat: 18.52, lng: 73.856, github: "", linkedin: "", availability: "Full-time" },
    { id: "mock-pun-2", name: "Vikram Patil", avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=VikramP", college: "PICT Pune", degree: "B.E. IT", year: 3, city: "Pune", skills: ["Flutter", "Firebase", "Dart"], interests: ["Mobile Dev", "UI/UX"], lookingFor: ["Mobile Developer"], bio: "Flutter developer with 5 published apps", wins: 2, projects: 5, badges: [], lat: 18.457, lng: 73.857, github: "", linkedin: "", availability: "Part-time" },
    { id: "mock-pun-3", name: "Aditi Kulkarni", avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=AditiP", college: "SIT Pune", degree: "B.Tech AI", year: 2, city: "Pune", skills: ["TensorFlow", "NLP", "Python"], interests: ["Deep Learning", "NLP"], lookingFor: ["AI Researcher"], bio: "NLP enthusiast building language models", wins: 1, projects: 4, badges: [], lat: 18.583, lng: 73.742, github: "", linkedin: "", availability: "Full-time" },
  ],
  Bangalore: [
    { id: "mock-blr-1", name: "Rahul Verma", avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=RahulB", college: "IIIT Bangalore", degree: "B.Tech CSE", year: 4, city: "Bangalore", skills: ["Go", "Kubernetes", "Microservices"], interests: ["Cloud", "DevOps"], lookingFor: ["DevOps Engineer"], bio: "Cloud infrastructure specialist", wins: 3, projects: 11, badges: [{ label: "Winner", color: "green" }], lat: 12.971, lng: 77.594, github: "", linkedin: "", availability: "Full-time" },
    { id: "mock-blr-2", name: "Sneha Reddy", avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=SnehaB", college: "RV College Bangalore", degree: "B.E. CSE", year: 3, city: "Bangalore", skills: ["React", "GraphQL", "Tailwind"], interests: ["Frontend", "Web3"], lookingFor: ["Frontend Dev"], bio: "Creative frontend developer", wins: 2, projects: 7, badges: [], lat: 12.936, lng: 77.606, github: "", linkedin: "", availability: "Part-time" },
    { id: "mock-blr-3", name: "Aryan Gupta", avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=AryanB", college: "BMS College Bangalore", degree: "B.Tech IT", year: 4, city: "Bangalore", skills: ["Solidity", "Blockchain", "Web3"], interests: ["Blockchain", "DeFi"], lookingFor: ["Blockchain Dev"], bio: "Blockchain developer building dApps", wins: 1, projects: 6, badges: [], lat: 12.981, lng: 77.583, github: "", linkedin: "", availability: "Full-time" },
  ],
  Delhi: [
    { id: "mock-del-1", name: "Ishita Mehta", avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=IshitaD", college: "DTU Delhi", degree: "B.Tech CSE", year: 3, city: "Delhi", skills: ["C++", "DSA", "Competitive"], interests: ["CP", "Algorithms"], lookingFor: ["Competitive Programmer"], bio: "ACM finalist with strong DS&A", wins: 5, projects: 3, badges: [{ label: "Top Performer", color: "yellow" }], lat: 28.613, lng: 77.209, github: "", linkedin: "", availability: "Full-time" },
    { id: "mock-del-2", name: "Amit Saxena", avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=AmitD", college: "NSUT Delhi", degree: "B.E. ECE", year: 4, city: "Delhi", skills: ["Vue.js", "Node.js", "MongoDB"], interests: ["Full Stack", "Startups"], lookingFor: ["Full Stack Dev"], bio: "Full stack developer and startup founder", wins: 2, projects: 8, badges: [], lat: 28.59, lng: 77.2, github: "", linkedin: "", availability: "Part-time" },
    { id: "mock-del-3", name: "Pooja Aggarwal", avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=PoojaD", college: "IIIT Delhi", degree: "B.Tech CSAM", year: 3, city: "Delhi", skills: ["Python", "Data Science", "Tableau"], interests: ["Data Science", "Analytics"], lookingFor: ["Data Analyst"], bio: "Data scientist with 3 research papers", wins: 1, projects: 5, badges: [], lat: 28.578, lng: 77.187, github: "", linkedin: "", availability: "Full-time" },
  ],
}

const cityCoords: Record<string, [number, number]> = {
  Mumbai: [19.076, 72.8777],
  "Navi Mumbai": [19.033, 73.029],
  Pune: [18.52, 73.856],
  Bangalore: [12.971, 77.594],
  Delhi: [28.613, 77.209],
  Chennai: [13.082, 80.275],
  Hyderabad: [17.385, 78.486],
  Ahmedabad: [23.022, 72.571],
  Kolkata: [22.572, 88.363],
  Jaipur: [26.912, 75.787],
  Lucknow: [26.846, 80.946],
}

// Real signed-up users (Clerk auth) whose profile city/coords aren't clean yet —
// hardcode their Clerk avatar + a Mumbai-area pin so they show up on the map.
const realUserOverrides: Record<string, { avatar: string; lat: number; lng: number }> = {
  "61cf1cd3-f6b6-4953-bbf8-de37a299c344": {
    // Vedantt Talekar
    avatar: "https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvb2F1dGhfZ29vZ2xlL2ltZ18zRnpUbFhvOERSbTgzbGx4dG44aExBTllnZkoifQ",
    lat: 19.08,
    lng: 72.88,
  },
  "f2be75f4-df7c-4496-a08a-b2a945dd6d07": {
    // Saniya Wagh
    avatar: "https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvb2F1dGhfZ29vZ2xlL2ltZ18zRnpJTXRNQUg0U3J1aFd4QWdsQ3c0eHZ6d2EifQ",
    lat: 19.07,
    lng: 72.865,
  },
}

function ensureCoords(s: Student): Student {
  const override = realUserOverrides[s.id]
  if (override) {
    return { ...s, avatar: s.avatar || override.avatar, lat: override.lat, lng: override.lng, city: s.city || "Mumbai" }
  }
  if (s.lat && s.lng) return s
  const coords = cityCoords[s.city]
  if (coords) return { ...s, lat: coords[0], lng: coords[1] }
  return s
}

export default function TeamPage() {
  const [activeTab, setActiveTab] = useState(0)
  const [search, setSearch] = useState("")
  const [activeLocation, setActiveLocation] = useState<LocationKey>("all")
  const [createOpen, setCreateOpen] = useState(false)
  const [teamsList, setTeamsList] = useState<Team[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [opportunities, setOpportunities] = useState<Opportunity[]>([])
  const [loading, setLoading] = useState(true)
  const [meId, setMeId] = useState<string | null>(null)
  const [meProfile, setMeProfile] = useState<Student | null>(null)
  const [friendStatusMap, setFriendStatusMap] = useState<Record<string, FriendStatus>>({})
  const [incomingIdMap, setIncomingIdMap] = useState<Record<string, number>>({})
  const clerkUser = useUser()
  const clerkAvatarUrl = clerkUser?.user?.imageUrl

  useEffect(() => {
    const hash = window.location.hash.replace("#", "")
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (hash === "find-members") setActiveTab(1)
    else if (hash === "open-teams") setActiveTab(0)
  }, [])

  useEffect(() => {
    Promise.all([
      fetch("/api/teams").then((res) => res.json()),
      fetch("/api/users").then((res) => res.json()),
      fetch("/api/opportunities").then((res) => res.json()),
      fetch("/api/users/me").then((res) => res.json()),
    ])
      .then(([teamsData, usersData, oppsData, me]) => {
        setTeamsList(teamsData)
        const mumbaiCoords: [number, number] = [19.076, 72.8777]
        const hardcodedMe: Student = {
          ...me,
          avatar: clerkAvatarUrl || me.avatar || "",
          lat: mumbaiCoords[0],
          lng: mumbaiCoords[1],
          city: me.city || "Mumbai",
        }
        setMeId(me.id)
        setMeProfile(hardcodedMe)
        setStudents(
          usersData.map((s: Student) => {
            if (s.lat && s.lng) return s
            const c = cityCoords[s.city]
            if (c) return { ...s, lat: c[0], lng: c[1] }
            return s
          }),
        )
        setOpportunities(oppsData)
      })
      .finally(() => setLoading(false))
  }, [])

  const refreshFriends = useCallback(() => {
    fetch("/api/friends")
      .then((res) => res.json())
      .then((data: { friends: Student[]; incoming: PendingRequestDTO[]; outgoing: PendingRequestDTO[] }) => {
        const map: Record<string, FriendStatus> = {}
        const incMap: Record<string, number> = {}
        data.friends.forEach((s) => { map[s.id] = "friends" })
        data.outgoing.forEach((p) => { map[p.student.id] = "pending_outgoing" })
        data.incoming.forEach((p) => { map[p.student.id] = "pending_incoming"; incMap[p.student.id] = p.id })
        setFriendStatusMap(map)
        setIncomingIdMap(incMap)
      })
  }, [])

  useEffect(() => {
    refreshFriends()
  }, [refreshFriends])

  const handleSendRequest = async (studentId: string) => {
    setFriendStatusMap((prev) => ({ ...prev, [studentId]: "pending_outgoing" }))
    const res = await fetch("/api/friends", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ addresseeId: studentId }),
    })
    if (res.ok) {
      const friendship = await res.json()
      setFriendStatusMap((prev) => ({
        ...prev,
        [studentId]: friendship.status === "accepted" ? "friends" : "pending_outgoing",
      }))
    }
  }

  const handleAccept = async (studentId: string) => {
    const friendshipId = incomingIdMap[studentId]
    if (!friendshipId) return
    const res = await fetch(`/api/friends/${friendshipId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "accept" }),
    })
    if (res.ok) setFriendStatusMap((prev) => ({ ...prev, [studentId]: "friends" }))
  }

  const handleDecline = async (studentId: string) => {
    const friendshipId = incomingIdMap[studentId]
    if (!friendshipId) return
    const res = await fetch(`/api/friends/${friendshipId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "reject" }),
    })
    if (res.ok) setFriendStatusMap((prev) => ({ ...prev, [studentId]: "none" }))
  }

  const currentFilter = locationFilters.find((f) => f.key === activeLocation)!

  const filteredStudents = students.filter(
    (s) => s.id !== meId,
  ).filter(
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
    let result = students.map(ensureCoords)
    if (meProfile) {
      const userWithCoords = ensureCoords(meProfile)
      const exists = result.some((s) => s.id === userWithCoords.id)
      if (!exists) result = [userWithCoords, ...result]
    }
    if (activeLocation !== "all") {
      const wantedCities = currentFilter.cities.map((c) => c.trim().toLowerCase())
      result = result.filter((s) => wantedCities.includes(s.city.trim().toLowerCase()))
      const mockKey = currentFilter.cities[0]
      const mockData = mockStudentsByCity[mockKey] ?? []
      const usedIds = new Set(result.map((s) => s.id))
      const usedNames = new Set(result.map((s) => s.name.toLowerCase()))
      for (const mock of mockData) {
        if (!usedIds.has(mock.id) && !usedNames.has(mock.name.toLowerCase()) && result.length < 3) {
          const withAvatar = { ...mock, avatar: mock.avatar || "" }
          result.push(withAvatar)
          usedIds.add(mock.id)
          usedNames.add(mock.name.toLowerCase())
        }
      }
    }
    return result
  }, [activeLocation, currentFilter.cities, students, meProfile])

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
          {loading ? (
            <div className="text-center py-20 text-sm text-[var(--v-muted)]">Loading...</div>
          ) : (
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
        </>
      )}

      {/* Find Members Tab */}
      {activeTab === 1 && (
        <>
          {loading ? (
            <div className="text-center py-20 text-sm text-[var(--v-muted)]">Loading...</div>
          ) : (
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
                <StudentCard
                  student={student}
                  friendStatus={friendStatusMap[student.id] ?? "none"}
                  onSendRequest={handleSendRequest}
                  onAccept={handleAccept}
                  onDecline={handleDecline}
                />
              </motion.div>
            ))}
          </div>
          </>
          )}
        </>
      )}

      <CreateTeamModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreate={(team) => setTeamsList((prev) => [team, ...prev])}
        opportunities={opportunities}
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
            meId={meId}
          />
        </motion.div>
      )}
    </div>
  )
}
