"use client"

import { motion } from "framer-motion"
import { Github, Linkedin, Globe, Edit3, Trophy, Star, Users, MapPin, GraduationCap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { students } from "@/lib/data/students"
import { showcases } from "@/lib/data/showcases"
import { ShowcaseCard } from "@/components/shared/ShowcaseCard"

const me = students[0]

const badgeColors: Record<string, { bg: string; text: string }> = {
  green: { bg: "#5D7B3D10", text: "#5D7B3D" },
  yellow: { bg: "#F6C94D20", text: "#b8922c" },
  pink: { bg: "#E4568B10", text: "#E4568B" },
  blue: { bg: "#A7C7E420", text: "#4a90c0" },
}

export default function ProfilePage() {
  return (
    <div className="p-8 max-w-5xl">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <div className="bg-white rounded-[24px] border border-[#E8E8E8] shadow-card overflow-hidden mb-6">
          <div className="h-32 bg-gradient-to-r from-[#5D7B3D] via-[#A7C7E4] to-[#E4568B]" />
          <div className="px-8 pb-8">
            <div className="flex items-end justify-between -mt-14 mb-6">
              <div className="relative">
                <img
                  src={me.avatar}
                  alt={me.name}
                  className="w-24 h-24 rounded-2xl border-4 border-white bg-gray-100 shadow-lg"
                />
                <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#5D7B3D] border-2 border-white flex items-center justify-center">
                  <Trophy className="w-3 h-3 text-white fill-white" />
                </div>
              </div>
              <Button variant="outline" className="rounded-[14px] border-[#E8E8E8] gap-2">
                <Edit3 className="w-4 h-4" /> Edit Profile
              </Button>
            </div>

            <div className="flex flex-wrap items-start gap-4">
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl font-bold text-[#1F2430] mb-1">{me.name}</h1>
                <p className="text-[#5E6677] mb-3">{me.degree} · Year {me.year}</p>
                <p className="text-sm text-[#5E6677] leading-relaxed mb-4 max-w-xl">{me.bio}</p>

                <div className="flex flex-wrap items-center gap-4 text-sm text-[#8B93A7] mb-4">
                  <div className="flex items-center gap-1.5">
                    <GraduationCap className="w-4 h-4" />
                    {me.college}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4" />
                    {me.city}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {me.badges.map((badge) => {
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
                {me.github && (
                  <a href={me.github} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl border border-[#E8E8E8] bg-white hover:bg-gray-50 flex items-center justify-center transition-colors">
                    <Github className="w-4 h-4 text-[#5E6677]" />
                  </a>
                )}
                {me.linkedin && (
                  <a href={me.linkedin} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl border border-[#E8E8E8] bg-white hover:bg-gray-50 flex items-center justify-center transition-colors">
                    <Linkedin className="w-4 h-4 text-[#5E6677]" />
                  </a>
                )}
                {me.portfolio && (
                  <a href={me.portfolio} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl border border-[#E8E8E8] bg-white hover:bg-gray-50 flex items-center justify-center transition-colors">
                    <Globe className="w-4 h-4 text-[#5E6677]" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { icon: Trophy, label: "Competition Wins", value: me.wins, color: "#F6C94D", bg: "#F6C94D20" },
            { icon: Star, label: "Projects Built", value: me.projects, color: "#5D7B3D", bg: "#5D7B3D10" },
            { icon: Users, label: "Teams Joined", value: 4, color: "#E4568B", bg: "#E4568B10" },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-[18px] border border-[#E8E8E8] p-5 shadow-card text-center">
              <div className="w-10 h-10 rounded-xl mx-auto mb-3 flex items-center justify-center" style={{ backgroundColor: stat.bg }}>
                <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
              </div>
              <p className="text-2xl font-bold text-[#1F2430]">{stat.value}</p>
              <p className="text-xs text-[#8B93A7] mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-[18px] border border-[#E8E8E8] shadow-card p-6">
            <h2 className="font-bold text-[#1F2430] mb-4">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {me.skills.map((skill) => (
                <span key={skill} className="px-3 py-1.5 rounded-xl bg-[#5D7B3D]/8 border border-[#5D7B3D]/15 text-sm text-[#5D7B3D] font-medium">
                  {skill}
                </span>
              ))}
            </div>

            <h2 className="font-bold text-[#1F2430] mt-6 mb-4">Interests</h2>
            <div className="flex flex-wrap gap-2">
              {me.interests.map((interest) => (
                <span key={interest} className="px-3 py-1.5 rounded-xl bg-[#A7C7E4]/20 border border-[#A7C7E4]/30 text-sm text-[#4a90c0] font-medium">
                  {interest}
                </span>
              ))}
            </div>

            <h2 className="font-bold text-[#1F2430] mt-6 mb-4">Looking For</h2>
            <div className="flex flex-wrap gap-2">
              {me.lookingFor.map((role) => (
                <span key={role} className="px-3 py-1.5 rounded-xl border border-dashed border-[#E4568B]/40 text-sm text-[#E4568B]">
                  {role}
                </span>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2">
            <h2 className="font-bold text-[#1F2430] mb-4">My Showcases</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {showcases.slice(0, 2).map((sc) => (
                <ShowcaseCard key={sc.id} showcase={sc} />
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
