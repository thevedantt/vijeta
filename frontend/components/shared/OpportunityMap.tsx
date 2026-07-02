"use client"

import { Map, MapMarker, MarkerContent, MarkerPopup, MapControls } from "@/components/ui/map"
import { MapPin, Wifi } from "lucide-react"
import { Opportunity } from "@/types"
import { cn } from "@/lib/utils"

interface OpportunityMapProps {
  opportunities: Opportunity[]
  className?: string
}

export function OpportunityMap({ opportunities, className }: OpportunityMapProps) {
  const withCoords = opportunities.filter((o) => o.lat && o.lng)

  return (
    <div className={cn("relative w-full h-[400px] rounded-[18px] overflow-hidden border border-[var(--v-border)] shadow-card", className)}>
      <Map
        center={[78.9629, 22.5937]}
        zoom={4.5}
        className="w-full h-full"
      >
        <MapControls showZoom position="bottom-right" />
        {withCoords.map((opp) => (
          <MapMarker
            key={opp.id}
            longitude={opp.lng!}
            latitude={opp.lat!}
          >
            <MarkerContent>
              <div className="w-9 h-9 rounded-xl bg-[#5D7B3D] flex items-center justify-center shadow-lg cursor-pointer hover:scale-110 transition-transform border-2 border-white">
                <MapPin className="w-4 h-4 text-white fill-white" />
              </div>
            </MarkerContent>
            <MarkerPopup>
              <div className="w-56 p-0.5">
                <div className="mb-2.5">
                  <div className="flex items-start gap-2 mb-1.5">
                    <div className="w-2 h-2 rounded-full bg-[#5D7B3D] mt-1 flex-shrink-0" />
                    <p className="font-bold text-sm text-[var(--v-heading)] leading-snug">{opp.title}</p>
                  </div>
                  <p className="text-[11px] text-[var(--v-muted)] ml-4">{opp.organizer}</p>
                </div>

                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#5D7B3D]/10 text-[#5D7B3D]">
                    {opp.type}
                  </span>
                  {opp.isRemote && (
                    <span className="flex items-center gap-1 text-[10px] text-[#4a90c0] bg-[#A7C7E4]/20 px-2 py-0.5 rounded-full font-medium">
                      <Wifi className="w-2.5 h-2.5" /> Remote
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 text-[11px] text-[var(--v-body)] mb-2">
                  <MapPin className="w-3 h-3 text-[var(--v-muted)]" />
                  <span>{opp.location}</span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[var(--v-border)] text-[11px]">
                  <span className="font-bold text-[var(--v-heading)]">{opp.prize}</span>
                  <span className="text-[var(--v-muted)]">{opp.applicants.toLocaleString()} applicants</span>
                </div>
              </div>
            </MarkerPopup>
          </MapMarker>
        ))}
      </Map>
    </div>
  )
}
