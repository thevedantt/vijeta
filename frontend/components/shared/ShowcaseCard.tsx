"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Github, ExternalLink, Eye, Heart, FileText } from "lucide-react"
import { Showcase } from "@/types"

interface ShowcaseCardProps {
  showcase: Showcase
}

export function ShowcaseCard({ showcase }: ShowcaseCardProps) {
  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.15 }}
      className="bg-white rounded-[18px] border border-[#E8E8E8] overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-200 group"
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
              <Github className="w-3.5 h-3.5 text-white" />
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
        <h3 className="font-bold text-[#1F2430] mb-1 leading-snug line-clamp-2 group-hover:text-[#5D7B3D] transition-colors">
          {showcase.title}
        </h3>
        <p className="text-xs text-[#8B93A7] mb-3">{showcase.competition} · {showcase.year}</p>
        <p className="text-sm text-[#5E6677] mb-4 line-clamp-2 leading-relaxed">
          {showcase.description}
        </p>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {showcase.techStack.slice(0, 3).map((tech) => (
            <span key={tech} className="px-2 py-0.5 rounded-full bg-[#F8F9FC] border border-[#E8E8E8] text-xs text-[#5E6677]">
              {tech}
            </span>
          ))}
          {showcase.techStack.length > 3 && (
            <span className="px-2 py-0.5 rounded-full bg-[#F8F9FC] border border-[#E8E8E8] text-xs text-[#8B93A7]">
              +{showcase.techStack.length - 3}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-[#E8E8E8]">
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {showcase.members.slice(0, 3).map((m) => (
                <img
                  key={m.name}
                  src={m.avatar}
                  alt={m.name}
                  className="w-6 h-6 rounded-full border-2 border-white bg-gray-100"
                />
              ))}
            </div>
            <span className="text-xs text-[#8B93A7]">{showcase.team}</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-[#8B93A7]">
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
