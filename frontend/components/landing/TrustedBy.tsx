"use client"

import { motion } from "framer-motion"

const colleges = [
  "IIT Bombay",
  "IIT Delhi",
  "IIT Madras",
  "NIT Trichy",
  "BITS Pilani",
  "VJTI Mumbai",
  "COEP Pune",
  "IIIT Hyderabad",
  "DTU Delhi",
  "VNIT Nagpur",
  "Anna University",
  "Jadavpur University",
]

const hackathons = [
  "Smart India Hackathon",
  "Google Solution Challenge",
  "Microsoft Imagine Cup",
  "Hack36",
  "Flipkart Grid",
  "Build With India",
]

export function TrustedBy() {
  return (
    <section className="py-16 border-y border-[var(--v-border)] bg-[var(--v-card)] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
        <p className="text-center text-sm font-medium text-[var(--v-muted)] uppercase tracking-widest">
          Students from India's top colleges
        </p>
      </div>

      <div className="relative">
        <div className="flex gap-8 animate-[scroll_30s_linear_infinite]" style={{ width: "max-content" }}>
          {[...colleges, ...colleges].map((college, i) => (
            <div
              key={i}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[var(--v-bg-secondary)] border border-[var(--v-border)] whitespace-nowrap flex-shrink-0"
            >
              <span className="w-2 h-2 rounded-full bg-[#5D7B3D]" />
              <span className="text-sm font-medium text-[var(--v-body)]">{college}</span>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <p className="text-center text-sm font-medium text-[var(--v-muted)] uppercase tracking-widest mb-8">
          Supporting competitions
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          {hackathons.map((h) => (
            <span
              key={h}
              className="px-4 py-2 rounded-full bg-[#5D7B3D]/5 border border-[#5D7B3D]/15 text-sm font-medium text-[#5D7B3D]"
            >
              {h}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
