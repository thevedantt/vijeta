"use client"

import { Map, MapMarker, MarkerContent, MarkerPopup, MapControls } from "@/components/ui/map"
import { students as allStudents } from "@/lib/data/students"
import { Student } from "@/types"
import { Trophy, MapPin } from "lucide-react"
import { cn } from "@/lib/utils"

interface NearbyMapProps {
  students?: Student[]
  center?: [number, number]
  zoom?: number
  className?: string
}

const badgeColors: Record<string, { bg: string; text: string }> = {
  green: { bg: "#5D7B3D10", text: "#5D7B3D" },
  yellow: { bg: "#F6C94D20", text: "#b8922c" },
  pink: { bg: "#E4568B10", text: "#E4568B" },
  blue: { bg: "#A7C7E420", text: "#4a90c0" },
}

export function NearbyMap({ students, center, zoom, className }: NearbyMapProps) {
  const displayStudents = students ?? allStudents

  return (
    <div className={cn("relative w-full h-[520px] rounded-[18px] overflow-hidden border border-[var(--v-border)] shadow-card", className)}>
      <Map
        center={center ?? [78.9629, 22.5937]}
        zoom={zoom ?? 4.5}
        className="w-full h-full"
      >
        <MapControls showZoom position="bottom-right" />
        {displayStudents.map((student) => (
          <MapMarker
            key={student.id}
            longitude={student.lng}
            latitude={student.lat}
          >
            <MarkerContent>
              <div className="w-10 h-10 rounded-full border-2 border-[#5D7B3D] overflow-hidden bg-[var(--v-card)] shadow-lg cursor-pointer hover:scale-110 transition-transform">
                <img
                  src={student.avatar}
                  alt={student.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </MarkerContent>
            <MarkerPopup>
              <div className="w-56 p-0.5">
                <div className="flex items-start gap-3 mb-3">
                  <img
                    src={student.avatar}
                    alt={student.name}
                    className="w-11 h-11 rounded-xl border border-[var(--v-border)] bg-[var(--v-card)] flex-shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-sm text-[var(--v-heading)] truncate">{student.name}</p>
                    <p className="text-xs text-[var(--v-muted)] truncate">{student.college}</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-[var(--v-muted)]" />
                      <span className="text-[10px] text-[var(--v-muted)]">{student.city}</span>
                    </div>
                  </div>
                  {student.wins > 0 && (
                    <div className="w-6 h-6 rounded-full bg-[#F6C94D]/20 flex items-center justify-center flex-shrink-0">
                      <Trophy className="w-3 h-3 text-[#b8922c]" />
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-1 mb-2.5">
                  {student.skills.slice(0, 4).map((s) => (
                    <span
                      key={s}
                      className="text-[10px] px-1.5 py-0.5 rounded-full bg-[var(--v-bg-secondary)] border border-[var(--v-border)] text-[var(--v-body)] font-medium"
                    >
                      {s}
                    </span>
                  ))}
                </div>

                {student.badges.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-2.5">
                    {student.badges.map((badge) => {
                      const color = badgeColors[badge.color] || badgeColors.green
                      return (
                        <span
                          key={badge.label}
                          className="text-[9px] font-semibold px-2 py-0.5 rounded-full"
                          style={{ backgroundColor: color.bg, color: color.text }}
                        >
                          {badge.label}
                        </span>
                      )
                    })}
                  </div>
                )}

                {student.currentOpportunity && (
                  <div className="mb-2.5">
                    <p className="text-[10px] text-[var(--v-muted)] mb-0.5">Currently working on:</p>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#5D7B3D]/10 text-[#5D7B3D] font-medium">
                      {student.currentOpportunity}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between pt-2 border-t border-[var(--v-border)]">
                  <div className="flex items-center gap-3 text-[10px] text-[var(--v-muted)]">
                    <span>
                      <span className="font-bold text-[var(--v-heading)]">{student.wins}</span> wins
                    </span>
                    <span>
                      <span className="font-bold text-[var(--v-heading)]">{student.projects}</span> projects
                    </span>
                  </div>
                  {student.availability && (
                    <span className={cn(
                      "text-[9px] font-semibold px-2 py-0.5 rounded-full",
                      student.availability === "Full-time" ? "bg-[#5D7B3D]/10 text-[#5D7B3D]" : "bg-[#A7C7E4]/20 text-[#4a90c0]"
                    )}>
                      {student.availability}
                    </span>
                  )}
                </div>
              </div>
            </MarkerPopup>
          </MapMarker>
        ))}
      </Map>
    </div>
  )
}
