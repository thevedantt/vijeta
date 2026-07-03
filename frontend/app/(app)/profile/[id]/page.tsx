"use client"

import { use, useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, Code2, Briefcase, Globe, Trophy, Star, MapPin, GraduationCap, MessageCircle, UserPlus, Check, X, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ShowcaseCard } from "@/components/shared/ShowcaseCard"
import { findDirectConversation, createConversation } from "@/lib/firestore/chat"
import type { Student, Showcase } from "@/types"
import type { FriendStatus } from "@/backend/db/queries/friends"

const badgeColors: Record<string, { bg: string; text: string }> = {
  green: { bg: "#5D7B3D10", text: "#5D7B3D" },
  yellow: { bg: "#F6C94D20", text: "#b8922c" },
  pink: { bg: "#E4568B10", text: "#E4568B" },
  blue: { bg: "#A7C7E420", text: "#4a90c0" },
}

export default function StudentProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [student, setStudent] = useState<Student | null>(null)
  const [studentShowcases, setStudentShowcases] = useState<Showcase[]>([])
  const [meId, setMeId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [startingChat, setStartingChat] = useState(false)
  const [friendStatus, setFriendStatus] = useState<FriendStatus>("none")
  const [friendshipId, setFriendshipId] = useState<number | null>(null)
  const [friendActionPending, setFriendActionPending] = useState(false)

  useEffect(() => {
    let cancelled = false
    setLoading(true)

    Promise.all([
      fetch(`/api/users/${id}`).then((res) => (res.ok ? res.json() : null)),
      fetch("/api/users/me").then((res) => (res.ok ? res.json() : null)),
    ]).then(async ([target, me]: [Student | null, Student | null]) => {
      if (cancelled) return
      setStudent(target)
      setMeId(me?.id ?? null)
      if (target) {
        const showcasesRes = await fetch(`/api/showcases?college=${encodeURIComponent(target.college)}`)
        const showcases: Showcase[] = showcasesRes.ok ? await showcasesRes.json() : []
        if (!cancelled) setStudentShowcases(showcases.slice(0, 2))

        if (me && me.id !== target.id) {
          const [statusRes, friendsRes] = await Promise.all([
            fetch(`/api/friends/status/${target.id}`),
            fetch("/api/friends"),
          ])
          const { status } = statusRes.ok ? await statusRes.json() : { status: "none" }
          if (cancelled) return
          setFriendStatus(status)
          if (status === "pending_incoming" && friendsRes.ok) {
            const { incoming } = await friendsRes.json()
            const match = incoming.find((r: { id: number; student: Student }) => r.student.id === target.id)
            if (!cancelled) setFriendshipId(match?.id ?? null)
          }
        }
      }
    }).finally(() => {
      if (!cancelled) setLoading(false)
    })

    return () => {
      cancelled = true
    }
  }, [id])

  async function handleChat() {
    if (!meId || !student || startingChat) return
    setStartingChat(true)
    try {
      const existing = await findDirectConversation(meId, student.id)
      const chatId = existing ? existing.id : await createConversation("direct", [meId, student.id])
      router.push(`/chat?conv=${chatId}`)
    } finally {
      setStartingChat(false)
    }
  }

  async function handleSendRequest() {
    if (!student || friendActionPending) return
    setFriendActionPending(true)
    try {
      const res = await fetch("/api/friends", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ addresseeId: student.id }),
      })
      if (res.ok) {
        const friendship = await res.json()
        setFriendStatus(friendship.status === "accepted" ? "friends" : "pending_outgoing")
      }
    } finally {
      setFriendActionPending(false)
    }
  }

  async function handleRespond(action: "accept" | "reject") {
    if (!friendshipId || friendActionPending) return
    setFriendActionPending(true)
    try {
      const res = await fetch(`/api/friends/${friendshipId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      })
      if (res.ok) setFriendStatus(action === "accept" ? "friends" : "none")
    } finally {
      setFriendActionPending(false)
    }
  }

  if (loading) {
    return (
      <div className="p-4 md:p-8 max-w-5xl">
        <div className="text-center py-20 text-sm text-[var(--v-muted)]">Loading...</div>
      </div>
    )
  }

  if (!student) {
    return (
      <div className="p-4 md:p-8 max-w-5xl">
        <div className="text-center py-20 text-sm text-[var(--v-muted)]">Student not found.</div>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-8 max-w-5xl">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <Link href="/team" className="inline-flex items-center gap-2 text-sm text-[var(--v-muted)] hover:text-[var(--v-heading)] mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Team Up
        </Link>

        <div className="bg-[var(--v-card)] rounded-[24px] border border-[var(--v-border)] shadow-card overflow-hidden mb-6">
          <div className="h-32 bg-gradient-to-r from-[#5D7B3D] via-[#A7C7E4] to-[#E4568B]" />
          <div className="px-8 pb-8">
            <div className="flex items-end justify-between -mt-14 mb-6">
              <div className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={student.avatar}
                  alt={student.name}
                  className="w-24 h-24 rounded-2xl border-4 border-[var(--v-card)] bg-[var(--v-bg-secondary)] shadow-lg"
                />
                {student.wins > 0 && (
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#5D7B3D] border-2 border-[var(--v-card)] flex items-center justify-center">
                    <Trophy className="w-3 h-3 text-white fill-white" />
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                {friendStatus === "friends" && (
                  <Button
                    onClick={handleChat}
                    disabled={startingChat || !meId}
                    className="bg-[#5D7B3D] hover:bg-[#4a6230] text-white rounded-[14px] gap-2"
                  >
                    <MessageCircle className="w-4 h-4" /> {startingChat ? "Starting..." : "Chat"}
                  </Button>
                )}
                {friendStatus === "none" && meId && (
                  <Button
                    onClick={handleSendRequest}
                    disabled={friendActionPending}
                    className="bg-[#5D7B3D] hover:bg-[#4a6230] text-white rounded-[14px] gap-2"
                  >
                    <UserPlus className="w-4 h-4" /> Add Friend
                  </Button>
                )}
                {friendStatus === "pending_outgoing" && (
                  <Button disabled variant="outline" className="rounded-[14px] gap-2 border-[var(--v-border)]">
                    <Clock className="w-4 h-4" /> Requested
                  </Button>
                )}
                {friendStatus === "pending_incoming" && (
                  <>
                    <Button
                      onClick={() => handleRespond("accept")}
                      disabled={friendActionPending}
                      className="bg-[#5D7B3D] hover:bg-[#4a6230] text-white rounded-[14px] gap-2"
                    >
                      <Check className="w-4 h-4" /> Accept
                    </Button>
                    <Button
                      onClick={() => handleRespond("reject")}
                      disabled={friendActionPending}
                      variant="outline"
                      className="rounded-[14px] gap-2 border-[var(--v-border)]"
                    >
                      <X className="w-4 h-4" /> Decline
                    </Button>
                  </>
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-start gap-4">
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl font-bold text-[var(--v-heading)] mb-1">{student.name}</h1>
                <p className="text-[var(--v-body)] mb-3">{student.degree} · Year {student.year}</p>
                <p className="text-sm text-[var(--v-body)] leading-relaxed mb-4 max-w-xl">{student.bio}</p>

                <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--v-muted)] mb-4">
                  <div className="flex items-center gap-1.5">
                    <GraduationCap className="w-4 h-4" />
                    {student.college}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4" />
                    {student.city}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {student.badges.map((badge) => {
                    const c = badgeColors[badge.color] || badgeColors.green
                    return (
                      <span
                        key={badge.label}
                        className="text-xs font-semibold px-3 py-1 rounded-full"
                        style={{ backgroundColor: c.bg, color: c.text }}
                      >
                        {badge.label}
                      </span>
                    )
                  })}
                </div>
              </div>

              <div className="flex items-center gap-3">
                {student.github && (
                  <a href={student.github} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl border border-[var(--v-border)] bg-[var(--v-card)] hover-bg-v-hover flex items-center justify-center transition-colors">
                    <Code2 className="w-4 h-4 text-[var(--v-body)]" />
                  </a>
                )}
                {student.linkedin && (
                  <a href={student.linkedin} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl border border-[var(--v-border)] bg-[var(--v-card)] hover-bg-v-hover flex items-center justify-center transition-colors">
                    <Briefcase className="w-4 h-4 text-[var(--v-body)]" />
                  </a>
                )}
                {student.portfolio && (
                  <a href={student.portfolio} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl border border-[var(--v-border)] bg-[var(--v-card)] hover-bg-v-hover flex items-center justify-center transition-colors">
                    <Globe className="w-4 h-4 text-[var(--v-body)]" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 md:gap-4 mb-6">
          {[
            { icon: Trophy, label: "Competition Wins", value: student.wins, color: "#F6C94D", bg: "#F6C94D20" },
            { icon: Star, label: "Projects Built", value: student.projects, color: "#5D7B3D", bg: "#5D7B3D10" },
          ].map((stat) => (
            <div key={stat.label} className="bg-[var(--v-card)] rounded-[18px] border border-[var(--v-border)] p-5 shadow-card text-center">
              <div className="w-10 h-10 rounded-xl mx-auto mb-3 flex items-center justify-center" style={{ backgroundColor: stat.bg }}>
                <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
              </div>
              <p className="text-2xl font-bold text-[var(--v-heading)]">{stat.value}</p>
              <p className="text-xs text-[var(--v-muted)] mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-[var(--v-card)] rounded-[18px] border border-[var(--v-border)] shadow-card p-6">
            <h2 className="font-bold text-[var(--v-heading)] mb-4">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {student.skills.map((skill) => (
                <span key={skill} className="px-3 py-1.5 rounded-xl bg-[#5D7B3D]/8 border border-[#5D7B3D]/15 text-sm text-[#5D7B3D] font-medium">
                  {skill}
                </span>
              ))}
            </div>

            <h2 className="font-bold text-[var(--v-heading)] mt-6 mb-4">Interests</h2>
            <div className="flex flex-wrap gap-2">
              {student.interests.map((interest) => (
                <span key={interest} className="px-3 py-1.5 rounded-xl bg-[#A7C7E4]/20 border border-[#A7C7E4]/30 text-sm text-[#4a90c0] font-medium">
                  {interest}
                </span>
              ))}
            </div>

            <h2 className="font-bold text-[var(--v-heading)] mt-6 mb-4">Looking For</h2>
            <div className="flex flex-wrap gap-2">
              {student.lookingFor.map((role) => (
                <span key={role} className="px-3 py-1.5 rounded-xl border border-dashed border-[#E4568B]/40 text-sm text-[#E4568B]">
                  {role}
                </span>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2">
            <h2 className="font-bold text-[var(--v-heading)] mb-4">Showcases</h2>
            {studentShowcases.length === 0 ? (
              <p className="text-sm text-[var(--v-muted)]">No showcases yet.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {studentShowcases.map((sc) => (
                  <ShowcaseCard key={sc.id} showcase={sc} />
                ))}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
