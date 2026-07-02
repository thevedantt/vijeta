"use client"

import { Map, MapMarker, MarkerContent, MarkerPopup, MapControls } from "@/components/ui/map"
import { students } from "@/lib/data/students"
import { MapPin } from "lucide-react"

export function NearbyMap() {
  return (
    <div className="relative w-full h-[480px] rounded-[24px] overflow-hidden border border-[#E8E8E8] shadow-card">
      <Map
        center={[78.9629, 22.5937]}
        zoom={4.5}
        className="w-full h-full"
      >
        <MapControls showZoom position="bottom-right" />
        {students.map((student) => (
          <MapMarker
            key={student.id}
            longitude={student.lng}
            latitude={student.lat}
          >
            <MarkerContent>
              <div className="w-10 h-10 rounded-full border-2 border-[#5D7B3D] overflow-hidden bg-white shadow-lg cursor-pointer hover:scale-110 transition-transform">
                <img
                  src={student.avatar}
                  alt={student.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </MarkerContent>
            <MarkerPopup>
              <div className="w-52 p-3">
                <div className="flex items-center gap-3 mb-2">
                  <img
                    src={student.avatar}
                    alt={student.name}
                    className="w-10 h-10 rounded-xl border border-[#E8E8E8]"
                  />
                  <div>
                    <p className="font-bold text-sm text-[#1F2430]">{student.name}</p>
                    <p className="text-xs text-[#8B93A7]">{student.city}</p>
                  </div>
                </div>
                <p className="text-xs text-[#5E6677] mb-2 truncate">{student.college}</p>
                <div className="flex flex-wrap gap-1 mb-2">
                  {student.skills.slice(0, 3).map((s) => (
                    <span key={s} className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#5D7B3D]/10 text-[#5D7B3D] font-medium">
                      {s}
                    </span>
                  ))}
                </div>
                {student.lookingFor.length > 0 && (
                  <div>
                    <p className="text-[10px] text-[#8B93A7] mb-1">Looking for:</p>
                    <div className="flex flex-wrap gap-1">
                      {student.lookingFor.slice(0, 2).map((r) => (
                        <span key={r} className="text-[10px] px-1.5 py-0.5 rounded-full border border-dashed border-[#E4568B]/40 text-[#E4568B]">
                          {r}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </MarkerPopup>
          </MapMarker>
        ))}
      </Map>
    </div>
  )
}
