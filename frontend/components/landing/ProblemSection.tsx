"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { Search, Users, BookOpen, Briefcase, BarChart3, Archive } from "lucide-react"

const problems = [
  {
    icon: Search,
    color: "#E4568B",
    bg: "#E4568B10",
    title: "Can't find opportunities",
    description: "Hackathons, scholarships and competitions are scattered across 50+ websites. Students miss deadlines.",
  },
  {
    icon: Users,
    color: "#5D7B3D",
    bg: "#5D7B3D10",
    title: "No teammates",
    description: "Talented students skip competitions because they can't find the right people to build with.",
  },
  {
    icon: BookOpen,
    color: "#A7C7E4",
    bg: "#A7C7E420",
    title: "No guidance",
    description: "Students don't know where to start, how judging works, or what previous winners built.",
  },
  {
    icon: Briefcase,
    color: "#F6C94D",
    bg: "#F6C94D20",
    title: "Participation barrier",
    description: '"I don\'t know coding." Competitions need design, research, and presentation skills too.',
  },
  {
    icon: Archive,
    color: "#E4568B",
    bg: "#E4568B10",
    title: "Knowledge is lost",
    description: "Every winning project disappears after the competition. Future students start from zero.",
  },
  {
    icon: BarChart3,
    color: "#5D7B3D",
    bg: "#5D7B3D10",
    title: "No progress tracking",
    description: "Students have no way to build a portfolio of competitions and projects over their college years.",
  },
]

export function ProblemSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section ref={ref} id="problem" className="py-24 bg-[#F8F9FC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-medium text-[#E4568B] uppercase tracking-widest mb-3 block">
            The Problem
          </span>
          <h2 className="text-4xl font-bold text-[#1F2430] mb-4">
            Why students miss opportunities
          </h2>
          <p className="text-lg text-[#5E6677] max-w-2xl mx-auto">
            Every year, thousands of talented students never participate because of these five barriers.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {problems.map((problem, i) => (
            <motion.div
              key={problem.title}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="bg-white rounded-[18px] border border-[#E8E8E8] p-6 shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-200 group"
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                style={{ backgroundColor: problem.bg }}
              >
                <problem.icon className="w-5 h-5" style={{ color: problem.color }} />
              </div>
              <h3 className="font-semibold text-[#1F2430] mb-2">{problem.title}</h3>
              <p className="text-sm text-[#5E6677] leading-relaxed">{problem.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
