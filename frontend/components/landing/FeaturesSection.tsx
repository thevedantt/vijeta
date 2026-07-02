"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { Compass, Users, BookOpen, Hammer, Star, Zap } from "lucide-react"

const features = [
  {
    icon: Compass,
    color: "#5D7B3D",
    bg: "#5D7B3D10",
    badge: "Discover",
    badgeBg: "#5D7B3D10",
    badgeColor: "#5D7B3D",
    title: "Never miss an opportunity again",
    description: "All scholarships, hackathons, fellowships, and competitions in one place. Smart filters by skill, deadline, difficulty, and team size. Bookmark opportunities and get deadline reminders.",
    highlights: ["Smart Search & Filters", "Deadline Reminders", "Eligibility Checker", "1,200+ Opportunities"],
    illustrationBg: "#F0F7EC",
    items: ["Smart India Hackathon", "Google Solution Challenge", "AICTE Scholarship", "Microsoft Imagine Cup"],
    itemColor: "#5D7B3D",
  },
  {
    icon: Users,
    color: "#E4568B",
    bg: "#E4568B10",
    badge: "Team Up",
    badgeBg: "#E4568B10",
    badgeColor: "#E4568B",
    title: "Find your perfect team in hours",
    description: "Browse students by skill, college, and city. Create team listings for your competition and invite applications. Every skill matters — coders, designers, researchers, presenters, video editors.",
    highlights: ["Skill-Based Matching", "Role Listings", "Location Filters", "4,800+ Teams Formed"],
    illustrationBg: "#FDF0F5",
    items: ["AI Engineer", "Frontend Dev", "UI/UX Designer", "Presenter"],
    itemColor: "#E4568B",
  },
  {
    icon: BookOpen,
    color: "#A7C7E4",
    bg: "#A7C7E420",
    badge: "Guidance Library",
    badgeBg: "#A7C7E420",
    badgeColor: "#4a90c0",
    title: "Learn from winners. Build faster.",
    description: "For every major competition, access winning PPTs, GitHub repos, architecture docs, timelines, and video walkthroughs. AI summarizes winning projects so you learn in minutes.",
    highlights: ["Winning PPTs & Code", "AI Summaries", "Common Mistakes", "2,100+ Projects"],
    illustrationBg: "#EFF5FB",
    items: ["VoxHealth — SIH Winner 2024", "SafeRoute — GSC Top 10", "FarmSense — BWI Winner", "EduChain — India Finalist"],
    itemColor: "#4a90c0",
  },
  {
    icon: Star,
    color: "#F6C94D",
    bg: "#F6C94D20",
    badge: "Showcase",
    badgeBg: "#F6C94D20",
    badgeColor: "#b8922c",
    title: "Your wins, forever in your portfolio",
    description: "Publish your winning project as a permanent showcase. Include demo, code, PPT, architecture, and learnings. Build a reputation that follows you beyond college.",
    highlights: ["Permanent Portfolio", "GitHub Integration", "Project Deep-Dives", "22K+ Total Views"],
    illustrationBg: "#FFFBEE",
    items: ["Project Demo", "GitHub Repo", "Architecture Doc", "Team Story"],
    itemColor: "#b8922c",
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 bg-[#F8F9FC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <span className="text-sm font-medium text-[#5D7B3D] uppercase tracking-widest mb-3 block">
            Features
          </span>
          <h2 className="text-4xl font-bold text-[#1F2430] mb-4">
            Everything you need to win
          </h2>
          <p className="text-lg text-[#5E6677] max-w-2xl mx-auto">
            Vijeta is the complete platform — from finding the right opportunity to publishing your winning showcase.
          </p>
        </div>

        <div className="space-y-24">
          {features.map((feature, i) => (
            <FeatureRow key={feature.badge} feature={feature} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

function FeatureRow({ feature, index }: { feature: typeof features[0]; index: number }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-100px" })
  const isEven = index % 2 === 0

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      className={`grid grid-cols-1 lg:grid-cols-2 gap-16 items-center ${isEven ? "" : "lg:flex-row-reverse"}`}
    >
      <div className={isEven ? "order-1" : "order-1 lg:order-2"}>
        <div
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-4"
          style={{ backgroundColor: feature.badgeBg, color: feature.badgeColor }}
        >
          <feature.icon className="w-3.5 h-3.5" />
          {feature.badge}
        </div>
        <h3 className="text-3xl font-bold text-[#1F2430] mb-4 leading-tight">
          {feature.title}
        </h3>
        <p className="text-[#5E6677] leading-relaxed mb-6">
          {feature.description}
        </p>
        <div className="grid grid-cols-2 gap-3">
          {feature.highlights.map((h) => (
            <div key={h} className="flex items-center gap-2 text-sm text-[#5E6677]">
              <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: feature.color }} />
              {h}
            </div>
          ))}
        </div>
      </div>

      <div className={isEven ? "order-2" : "order-2 lg:order-1"}>
        <motion.div
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
          className="rounded-[24px] border border-[#E8E8E8] shadow-card overflow-hidden"
          style={{ backgroundColor: feature.illustrationBg }}
        >
          <div className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: feature.bg }}
              >
                <feature.icon className="w-5 h-5" style={{ color: feature.color }} />
              </div>
              <div>
                <p className="font-semibold text-sm text-[#1F2430]">{feature.badge}</p>
                <p className="text-xs text-[#8B93A7]">{feature.items.length} items available</p>
              </div>
            </div>
            <div className="space-y-3">
              {feature.items.map((item, j) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, x: -10 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.3 + j * 0.1 }}
                  className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 shadow-sm border border-[#E8E8E8]"
                >
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: feature.color }} />
                  <span className="text-sm font-medium text-[#1F2430]">{item}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
