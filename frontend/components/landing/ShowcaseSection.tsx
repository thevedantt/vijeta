"use client"

import Link from "next/link"
import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { ArrowRight, ExternalLink, Eye, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { showcases } from "@/lib/data/showcases"

export function ShowcaseSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })

  return (
    <section ref={ref} id="showcase" className="py-24 bg-[var(--v-card)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-16 gap-4"
        >
          <div>
            <span className="text-sm font-medium text-[#5D7B3D] uppercase tracking-widest mb-3 block">
              Showcase
            </span>
            <h2 className="text-4xl font-bold text-[var(--v-heading)]">
              Student wins, on display
            </h2>
            <p className="text-[var(--v-body)] mt-2 max-w-xl">
              Real projects. Real wins. Explore what ambitious Indian students have built and learn from the best.
            </p>
          </div>
          <Link href="/showcase">
            <Button variant="outline" className="rounded-[14px] border-[var(--v-border)] text-[var(--v-heading)] hover:border-[#5D7B3D] hover:text-[#5D7B3D] gap-2 flex-shrink-0">
              View All <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {showcases.slice(0, 3).map((showcase, i) => (
            <motion.div
              key={showcase.id}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="group bg-[var(--v-card)] rounded-[18px] border border-[var(--v-border)] overflow-hidden shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-200"
            >
              <div className="relative h-44 overflow-hidden">
                <img
                  src={showcase.image}
                  alt={showcase.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-3 left-3">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#F6C94D] text-[#1F2430] dark:text-[#1F2430] text-xs font-semibold">
                    {showcase.rank}
                  </span>
                </div>
              </div>

              <div className="p-5">
                <h3 className="font-bold text-[var(--v-heading)] mb-1 leading-snug line-clamp-2">
                  {showcase.title}
                </h3>
                <p className="text-xs text-[var(--v-muted)] mb-3">{showcase.competition} · {showcase.year}</p>
                <p className="text-sm text-[var(--v-body)] mb-4 line-clamp-2 leading-relaxed">
                  {showcase.description}
                </p>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  {showcase.techStack.slice(0, 3).map((tech) => (
                    <span key={tech} className="px-2 py-0.5 rounded-full bg-[var(--v-bg-secondary)] border border-[var(--v-border)] text-xs text-[var(--v-body)]">
                      {tech}
                    </span>
                  ))}
                  {showcase.techStack.length > 3 && (
                    <span className="px-2 py-0.5 rounded-full bg-[var(--v-bg-secondary)] border border-[var(--v-border)] text-xs text-[var(--v-muted)]">
                      +{showcase.techStack.length - 3}
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-2">
                      {showcase.members.slice(0, 3).map((m) => (
                        <img
                          key={m.name}
                          src={m.avatar}
                          alt={m.name}
                          className="w-7 h-7 rounded-full border-2 border-[var(--v-card)] bg-[var(--v-bg-secondary)]"
                        />
                      ))}
                    </div>
                    <span className="text-xs text-[var(--v-muted)]">{showcase.team}</span>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-[var(--v-muted)]">
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3" /> {(showcase.views / 1000).toFixed(1)}k
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart className="w-3 h-3" /> {showcase.likes}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
