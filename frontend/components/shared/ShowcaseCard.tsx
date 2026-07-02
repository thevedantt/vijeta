"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Code2, ExternalLink, Eye, Heart, FileText } from "lucide-react"
import { Showcase } from "@/types"

interface ShowcaseCardProps {
  showcase: Showcase
}

export function ShowcaseCard({ showcase }: ShowcaseCardProps) {
  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.15 }}
      className="bg-[var(--v-card)] rounded-[18px] border border-[var(--v-border)] overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-200 group"
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={showcase.image}
          alt={showcase.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="px-2.5 py-1 rounded-full bg-[#F6C94D] text-[#1F2430] text-xs font-bold">
            {showcase.rank}
          </span>
        </div>
        <div className="absolute bottom-3 right-3 flex gap-2">
          {showcase.github && (
            <a
              href={showcase.github}
              target="_blank"
              rel="noopener noreferrer"
              className="w-7 h-7 rounded-lg bg-white/20 hover:bg-white/40 backdrop-blur-sm flex items-center justify-center transition-colors"
            >
              <Code2 className="w-3.5 h-3.5 text-white" />
            </a>
          )}
          {showcase.demo && (
            <a
              href={showcase.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="w-7 h-7 rounded-lg bg-white/20 hover:bg-white/40 backdrop-blur-sm flex items-center justify-center transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5 text-white" />
            </a>
          )}
          {showcase.ppt && (
            <a
              href={showcase.ppt}
              target="_blank"
              rel="noopener noreferrer"
              className="w-7 h-7 rounded-lg bg-white/20 hover:bg-white/40 backdrop-blur-sm flex items-center justify-center transition-colors"
            >
              <FileText className="w-3.5 h-3.5 text-white" />
            </a>
          )}
        </div>
      </div>

      <div className="p-5">
        <h3 className="font-bold text-[var(--v-heading)] mb-1 leading-snug line-clamp-2 group-hover:text-[#5D7B3D] transition-colors">
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

        <div className="flex items-center justify-between pt-3 border-t border-[var(--v-border)]">
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {showcase.members.slice(0, 3).map((m) => (
                <img
                  key={m.name}
                  src={m.avatar}
                  alt={m.name}
                  className="w-6 h-6 rounded-full border-2 border-[var(--v-card)] bg-[var(--v-bg-secondary)]"
                />
              ))}
            </div>
            <span className="text-xs text-[var(--v-muted)]">{showcase.team}</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-[var(--v-muted)]">
            <span className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {(showcase.views / 1000).toFixed(1)}k
            </span>
            <span className="flex items-center gap-1">
              <Heart className="w-3 h-3" />
              {showcase.likes}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
