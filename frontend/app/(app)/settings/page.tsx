"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Settings, User, Bell, Shield, Palette, Save } from "lucide-react"
import { Button } from "@/components/ui/button"

const sections = [
  { icon: User, label: "Profile" },
  { icon: Bell, label: "Notifications" },
  { icon: Shield, label: "Privacy" },
  { icon: Palette, label: "Appearance" },
]

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState("Profile")
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="p-8 max-w-5xl">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#8B93A7]/10 flex items-center justify-center">
            <Settings className="w-5 h-5 text-[#8B93A7]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#1F2430]">Settings</h1>
            <p className="text-[#8B93A7] text-sm">Manage your account preferences</p>
          </div>
        </div>
      </motion.div>

      <div className="flex gap-6">
        <div className="w-52 flex-shrink-0">
          <nav className="space-y-1">
            {sections.map((s) => (
              <button
                key={s.label}
                onClick={() => setActiveSection(s.label)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  activeSection === s.label
                    ? "bg-[#5D7B3D]/10 text-[#5D7B3D]"
                    : "text-[#5E6677] hover:bg-gray-50 hover:text-[#1F2430]"
                }`}
              >
                <s.icon className="w-4 h-4" />
                {s.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex-1">
          {activeSection === "Profile" && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-[24px] border border-[#E8E8E8] shadow-card p-8 space-y-6"
            >
              <h2 className="font-bold text-[#1F2430]">Profile Settings</h2>

              <div className="flex items-center gap-4">
                <img
                  src="https://api.dicebear.com/9.x/avataaars/svg?seed=AaravSharma"
                  alt="Avatar"
                  className="w-16 h-16 rounded-2xl border border-[#E8E8E8]"
                />
                <Button variant="outline" size="sm" className="rounded-xl border-[#E8E8E8]">
                  Change Photo
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: "Full Name", value: "Aarav Sharma" },
                  { label: "Email", value: "aarav@iitb.ac.in" },
                  { label: "College", value: "IIT Bombay" },
                  { label: "City", value: "Mumbai" },
                  { label: "Degree", value: "B.Tech Computer Science" },
                  { label: "Year", value: "3rd Year" },
                ].map((field) => (
                  <div key={field.label}>
                    <label className="block text-xs font-medium text-[#8B93A7] uppercase tracking-wider mb-1.5">
                      {field.label}
                    </label>
                    <input
                      defaultValue={field.value}
                      className="w-full h-10 px-4 rounded-xl border border-[#E8E8E8] text-sm text-[#1F2430] bg-white outline-none focus:border-[#5D7B3D] focus:ring-2 focus:ring-[#5D7B3D]/10 transition-all"
                    />
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-xs font-medium text-[#8B93A7] uppercase tracking-wider mb-1.5">Bio</label>
                <textarea
                  rows={3}
                  defaultValue="Passionate about building AI-powered products that solve real problems. 2x SIH finalist."
                  className="w-full px-4 py-3 rounded-xl border border-[#E8E8E8] text-sm text-[#1F2430] bg-white outline-none focus:border-[#5D7B3D] focus:ring-2 focus:ring-[#5D7B3D]/10 transition-all resize-none"
                />
              </div>

              <Button
                onClick={handleSave}
                className={`gap-2 rounded-[14px] transition-all ${saved ? "bg-[#5D7B3D]" : "bg-[#5D7B3D] hover:bg-[#4a6230]"} text-white`}
              >
                <Save className="w-4 h-4" />
                {saved ? "Saved!" : "Save Changes"}
              </Button>
            </motion.div>
          )}

          {activeSection === "Notifications" && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-[24px] border border-[#E8E8E8] shadow-card p-8"
            >
              <h2 className="font-bold text-[#1F2430] mb-6">Notification Preferences</h2>
              <div className="space-y-4">
                {[
                  "Deadline reminders for saved opportunities",
                  "Team application updates",
                  "New opportunities matching your skills",
                  "Showcase comments and likes",
                  "AI suggestions",
                  "Weekly digest",
                ].map((pref) => (
                  <div key={pref} className="flex items-center justify-between py-3 border-b border-[#E8E8E8] last:border-0">
                    <span className="text-sm text-[#5E6677]">{pref}</span>
                    <button className="w-10 h-5 rounded-full bg-[#5D7B3D] relative flex-shrink-0">
                      <div className="absolute right-0.5 top-0.5 w-4 h-4 rounded-full bg-white shadow" />
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {(activeSection === "Privacy" || activeSection === "Appearance") && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-[24px] border border-[#E8E8E8] shadow-card p-8"
            >
              <h2 className="font-bold text-[#1F2430] mb-4">{activeSection} Settings</h2>
              <p className="text-sm text-[#8B93A7]">This section will be available soon.</p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
