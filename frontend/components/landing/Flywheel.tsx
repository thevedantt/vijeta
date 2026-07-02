"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { Compass, Users, BookOpen, Hammer, Trophy, Upload, Lightbulb, RefreshCw } from "lucide-react"

const steps = [
  { icon: Compass, label: "Discover", description: "Find the right opportunity", color: "#5D7B3D", bg: "#5D7B3D15" },
  { icon: Users, label: "Team Up", description: "Find your dream team", color: "#E4568B", bg: "#E4568B15" },
  { icon: BookOpen, label: "Learn", description: "Read winning projects", color: "#A7C7E4", bg: "#A7C7E430" },
  { icon: Hammer, label: "Build", description: "Execute with focus", color: "#F6C94D", bg: "#F6C94D30" },
  { icon: Trophy, label: "Win", description: "Compete and excel", color: "#5D7B3D", bg: "#5D7B3D15" },
  { icon: Upload, label: "Publish", description: "Showcase your work", color: "#E4568B", bg: "#E4568B15" },
  { icon: Lightbulb, label: "Mentor", description: "Guide the next batch", color: "#A7C7E4", bg: "#A7C7E430" },
  { icon: RefreshCw, label: "Repeat", description: "The cycle continues", color: "#F6C94D", bg: "#F6C94D30" },
]

export function Flywheel() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })

  return (
    <section ref={ref} id="how-it-works" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-medium text-[#5D7B3D] uppercase tracking-widest mb-3 block">
            The Solution
          </span>
          <h2 className="text-4xl font-bold text-[#1F2430] mb-4">
            The Vijeta Flywheel
          </h2>
          <p className="text-lg text-[#5E6677] max-w-2xl mx-auto">
            One continuous journey from discovery to mentorship. Every winner creates the next generation of winners.
          </p>
        </motion.div>

        <div className="relative max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {steps.map((step, i) => (
              <motion.div
                key={step.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.4, delay: i * 0.07 }}
                className="relative flex flex-col items-center text-center"
              >
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-7 left-1/2 w-full h-px bg-gradient-to-r from-[#E8E8E8] to-transparent z-0" />
                )}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="relative z-10 w-14 h-14 rounded-2xl border border-[#E8E8E8] flex items-center justify-center mb-3 shadow-card"
                  style={{ backgroundColor: step.bg }}
                >
                  <step.icon className="w-6 h-6" style={{ color: step.color }} />
                  <div className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-white border border-[#E8E8E8] flex items-center justify-center">
                    <span className="text-[9px] font-bold text-[#8B93A7]">{i + 1}</span>
                  </div>
                </motion.div>
                <p className="font-semibold text-sm text-[#1F2430]">{step.label}</p>
                <p className="text-xs text-[#8B93A7] mt-0.5 leading-snug">{step.description}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="mt-16 p-8 rounded-[24px] bg-gradient-to-br from-[#5D7B3D]/5 via-[#F8F9FC] to-[#A7C7E4]/5 border border-[#E8E8E8] text-center"
          >
            <div className="text-2xl font-bold text-[#1F2430] mb-3">
              Recognition is not the finish line.
            </div>
            <div className="text-base text-[#5E6677]">
              Recognition is the fuel. Every winner becomes a guide. Every guide creates new winners.
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
