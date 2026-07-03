"use client"

import Link from "next/link"
import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { ArrowRight, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"

export function CTASection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })

  return (
    <section ref={ref} className="py-24 bg-[var(--v-card)]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.5 }}
          className="relative rounded-[32px] bg-gradient-to-br from-[#1F2430] to-[#2d3748] p-12 md:p-16 text-center overflow-hidden"
        >
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-[#5D7B3D]/20 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-[#A7C7E4]/15 blur-3xl" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-[#F6C94D]/5 blur-3xl" />
          </div>

          <div className="relative">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#5D7B3D]/20 border border-[#5D7B3D]/30 mb-8"
            >
              <Zap className="w-4 h-4 text-[#5D7B3D]" />
              <span className="text-sm font-medium text-[#5D7B3D]">Free for all students</span>
            </motion.div>

            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
              Ready to become the next{" "}
              <span className="text-[#F6C94D]">विजेता?</span>
            </h2>
            <p className="text-lg text-white/60 mb-10 max-w-xl mx-auto">
              Join 24,000+ ambitious students discovering opportunities, building teams, and winning competitions.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/dashboard">
                <Button
                  className="h-12 px-8 rounded-[14px] bg-[#5D7B3D] hover:bg-[#4a6230] text-white text-base font-medium gap-2 group"
                >
                  Start Your Journey
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/showcase">
                <Button
                  variant="outline"
                  className="h-12 px-8 rounded-[14px] border-white/20 text-white hover:bg-white/10 hover:border-white/30 text-base font-medium"
                >
                  Explore Winners
                </Button>
              </Link>
            </div>

            <div className="mt-10 flex items-center justify-center gap-8 text-sm text-white/40">
              <span>✓ No credit card required</span>
              <span>✓ Free forever for students</span>
              <span>✓ Setup in 2 minutes</span>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="flex flex-col items-center gap-5 py-6 border-t border-[var(--v-border)]">
          <p className="text-xl text-[var(--v-muted)] font-medium">
            Developed by <span className="text-[var(--v-heading)] font-semibold">Mindflayers</span>
          </p>
          <div className="flex items-center gap-6">
            {[
              { username: "saniyacodes06", href: "https://github.com/saniyacodes06" },
              { username: "thevedantt", href: "https://github.com/thevedantt" },
              { username: "m-spunky", href: "https://github.com/m-spunky" },
            ].map((dev) => (
              <a
                key={dev.username}
                href={dev.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative"
                title={dev.username}
              >
                <img
                  src={`https://github.com/${dev.username}.png`}
                  alt={dev.username}
                  className="w-16 h-16 rounded-full border-2 border-[var(--v-border)] group-hover:border-[#5D7B3D] transition-colors"
                />
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
