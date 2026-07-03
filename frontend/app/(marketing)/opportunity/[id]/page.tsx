"use client"

import { use, useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import {
  ArrowLeft,
  Calendar,
  Users,
  MapPin,
  Trophy,
  Wifi,
  Bookmark,
  Share2,
  CheckCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { ShowcaseCard } from "@/components/shared/ShowcaseCard"
import type { Opportunity, Showcase } from "@/types"

const typeColors: Record<string, { bg: string; text: string }> = {
  Hackathon: { bg: "#5D7B3D10", text: "#5D7B3D" },
  Scholarship: { bg: "#F6C94D20", text: "#b8922c" },
  Competition: { bg: "#E4568B10", text: "#E4568B" },
  Fellowship: { bg: "#A7C7E420", text: "#4a90c0" },
  Internship: { bg: "#5D7B3D10", text: "#5D7B3D" },
  Research: { bg: "#A7C7E420", text: "#4a90c0" },
}

export default function OpportunityDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [opp, setOpp] = useState<Opportunity | null>(null)
  const [relatedShowcases, setRelatedShowcases] = useState<Showcase[]>([])
  const [loading, setLoading] = useState(true)
  const [saved, setSaved] = useState(false)
  const [shareCopied, setShareCopied] = useState(false)

  useEffect(() => {
    let cancelled = false
    setLoading(true)

    fetch(`/api/opportunities/${id}`)
      .then((res) => (res.ok ? res.json() : null))
      .then(async (opportunity: Opportunity | null) => {
        if (cancelled) return
        setOpp(opportunity)
        if (!opportunity) return

        const showcasesRes = await fetch(
          `/api/showcases?tags=${opportunity.tags.slice(0, 3).join(",")}`,
        )
        const allShowcases: Showcase[] = showcasesRes.ok ? await showcasesRes.json() : []
        if (!cancelled) setRelatedShowcases(allShowcases.slice(0, 2))
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [id])

  async function handleSave() {
    const res = await fetch("/api/bookmarks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ opportunityId: id }),
    })
    if (res.status === 401) {
      router.push("/sign-in")
      return
    }
    if (res.ok) setSaved(true)
  }

  function handleShare() {
    navigator.clipboard.writeText(window.location.href)
    setShareCopied(true)
    setTimeout(() => setShareCopied(false), 2000)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F9FC] flex items-center justify-center pt-24">
        <p className="text-sm text-[#8B93A7]">Loading...</p>
      </div>
    )
  }

  if (!opp) {
    return (
      <div className="min-h-screen bg-[#F8F9FC] flex items-center justify-center pt-24">
        <p className="text-sm text-[#8B93A7]">Opportunity not found.</p>
      </div>
    )
  }

  const typeColor = typeColors[opp.type] || typeColors.Competition

  return (
    <div className="min-h-screen bg-[#F8F9FC]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        <Link
          href="/discover"
          className="inline-flex items-center gap-2 text-sm text-[#8B93A7] hover:text-[#1F2430] mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Discover
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2"
          >
            <div className="bg-white rounded-[24px] border border-[#E8E8E8] shadow-card p-8 mb-6">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#5D7B3D]/20 to-[#A7C7E4]/20 border border-[#E8E8E8] flex items-center justify-center text-2xl flex-shrink-0">
                  🏆
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className="text-xs font-semibold px-2.5 py-1 rounded-full"
                      style={{ backgroundColor: typeColor.bg, color: typeColor.text }}
                    >
                      {opp.type}
                    </span>
                    {opp.isRemote && (
                      <span className="flex items-center gap-1 text-xs text-[#4a90c0] bg-[#A7C7E420] px-2.5 py-1 rounded-full font-medium">
                        <Wifi className="w-3 h-3" /> Remote
                      </span>
                    )}
                  </div>
                  <h1 className="text-2xl font-bold text-[#1F2430] mb-1">{opp.title}</h1>
                  <p className="text-[#8B93A7]">{opp.organizer}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-[#F8F9FC] rounded-2xl mb-6">
                {[
                  { icon: Calendar, label: "Deadline", value: new Date(opp.deadline).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) },
                  { icon: Trophy, label: "Prize", value: opp.prize },
                  { icon: Users, label: "Team Size", value: opp.teamSize },
                  { icon: MapPin, label: "Location", value: opp.location },
                ].map((item) => (
                  <div key={item.label} className="text-center">
                    <item.icon className="w-4 h-4 text-[#8B93A7] mx-auto mb-1" />
                    <p className="text-[10px] text-[#8B93A7] uppercase tracking-wider mb-0.5">{item.label}</p>
                    <p className="font-semibold text-sm text-[#1F2430]">{item.value}</p>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {opp.tags.map((tag) => (
                  <span key={tag} className="px-3 py-1 rounded-full bg-[#F8F9FC] border border-[#E8E8E8] text-sm text-[#5E6677]">
                    {tag}
                  </span>
                ))}
              </div>

              <h2 className="font-bold text-[#1F2430] mb-3">About this opportunity</h2>
              <p className="text-[#5E6677] leading-relaxed mb-6">{opp.description}</p>

              <h2 className="font-bold text-[#1F2430] mb-3">Eligibility</h2>
              <ul className="space-y-2">
                {opp.eligibility.map((e) => (
                  <li key={e} className="flex items-start gap-2 text-sm text-[#5E6677]">
                    <CheckCircle className="w-4 h-4 text-[#5D7B3D] flex-shrink-0 mt-0.5" />
                    {e}
                  </li>
                ))}
              </ul>
            </div>

            {relatedShowcases.length > 0 && (
              <div>
                <h2 className="font-bold text-[#1F2430] mb-4">Previous Winners</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {relatedShowcases.map((sc) => (
                    <ShowcaseCard key={sc.id} showcase={sc} />
                  ))}
                </div>
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
            className="space-y-4"
          >
            <div className="bg-white rounded-[24px] border border-[#E8E8E8] shadow-card p-6">
              <div className="mb-4">
                <p className="text-2xl font-bold text-[#1F2430]">{opp.prize}</p>
                <p className="text-sm text-[#8B93A7]">Prize Pool</p>
              </div>
              <Link href={`/team?opportunityId=${opp.id}`}>
                <Button className="w-full h-11 bg-[#5D7B3D] hover:bg-[#4a6230] text-white rounded-[14px] text-sm font-medium mb-3">
                  Apply Now
                </Button>
              </Link>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={handleSave}
                  disabled={saved}
                  className="flex-1 h-11 rounded-[14px] border-[#E8E8E8] gap-2 text-sm"
                >
                  <Bookmark className="w-4 h-4" /> {saved ? "Saved" : "Save"}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleShare}
                  className="flex-1 h-11 rounded-[14px] border-[#E8E8E8] gap-2 text-sm"
                >
                  <Share2 className="w-4 h-4" /> {shareCopied ? "Copied!" : "Share"}
                </Button>
              </div>
            </div>

            <div className="bg-white rounded-[24px] border border-[#E8E8E8] shadow-card p-6">
              <h3 className="font-bold text-sm text-[#1F2430] mb-4">Quick Stats</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-[#8B93A7]">Applicants</span>
                  <span className="font-semibold text-[#1F2430]">{opp.applicants.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#8B93A7]">Difficulty</span>
                  <span className="font-semibold text-[#1F2430]">{opp.difficulty}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#8B93A7]">Mode</span>
                  <span className="font-semibold text-[#1F2430]">{opp.isRemote ? "Remote" : "In-Person"}</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#5D7B3D] to-[#4a6230] rounded-[24px] p-6 text-white">
              <p className="font-bold mb-2">Need a team?</p>
              <p className="text-sm text-white/70 mb-4">Browse students looking for teams for this competition.</p>
              <Link href="/team">
                <Button className="w-full bg-white/20 hover:bg-white/30 text-white border-0 rounded-xl text-sm">
                  Find Teammates
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
