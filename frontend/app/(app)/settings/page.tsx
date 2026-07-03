"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Settings, User, Bell, Shield, Palette, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Student } from "@/types"

const sections = [
  { icon: User, label: "Profile" },
  { icon: Bell, label: "Notifications" },
  { icon: Shield, label: "Privacy" },
  { icon: Palette, label: "Appearance" },
]

const notificationPrefs: { key: string; label: string }[] = [
  { key: "deadline_reminders", label: "Deadline reminders for saved opportunities" },
  { key: "team_updates", label: "Team application updates" },
  { key: "opportunity_matches", label: "New opportunities matching your skills" },
  { key: "showcase_activity", label: "Showcase comments and likes" },
  { key: "ai_suggestions", label: "AI suggestions" },
  { key: "weekly_digest", label: "Weekly digest" },
]

interface ProfileForm {
  name: string
  college: string
  city: string
  degree: string
  year: number
  bio: string
}

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState("Profile")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [avatar, setAvatar] = useState("")
  const [form, setForm] = useState<ProfileForm>({
    name: "",
    college: "",
    city: "",
    degree: "",
    year: 1,
    bio: "",
  })
  const [preferences, setPreferences] = useState<Record<string, boolean>>({})

  useEffect(() => {
    fetch("/api/users/me")
      .then((res) => res.json())
      .then((user: Student & { preferences?: Record<string, boolean> }) => {
        setAvatar(user.avatar)
        setForm({
          name: user.name,
          college: user.college,
          city: user.city,
          degree: user.degree,
          year: user.year,
          bio: user.bio,
        })
        setPreferences(user.preferences ?? {})
      })
      .finally(() => setLoading(false))
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch("/api/users/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        setSaved(true)
        setTimeout(() => setSaved(false), 2000)
      }
    } finally {
      setSaving(false)
    }
  }

  const togglePreference = async (key: string) => {
    const next = { ...preferences, [key]: !preferences[key] }
    setPreferences(next)
    await fetch("/api/users/me", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ preferences: next }),
    })
  }

  if (loading) {
    return (
      <div className="p-4 md:p-8 max-w-5xl">
        <div className="text-center py-20 text-sm text-[var(--v-muted)]">Loading...</div>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-8 max-w-5xl">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#8B93A7]/10 flex items-center justify-center">
            <Settings className="w-5 h-5 text-[#8B93A7]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[var(--v-heading)]">Settings</h1>
            <p className="text-[var(--v-muted)] text-sm">Manage your account preferences</p>
          </div>
        </div>
      </motion.div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-52 flex-shrink-0">
          <nav className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0">
            {sections.map((s) => (
              <button
                key={s.label}
                onClick={() => setActiveSection(s.label)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  activeSection === s.label
                    ? "bg-[#5D7B3D]/10 text-[#5D7B3D]"
                    : "text-[var(--v-body)] hover-bg-v-hover hover:text-[var(--v-heading)]"
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
              className="bg-[var(--v-card)] rounded-[24px] border border-[var(--v-border)] shadow-card p-8 space-y-6"
            >
              <h2 className="font-bold text-[var(--v-heading)]">Profile Settings</h2>

              <div className="flex items-center gap-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={avatar}
                  alt="Avatar"
                  className="w-16 h-16 rounded-2xl border border-[var(--v-border)]"
                />
                <Button variant="outline" size="sm" className="rounded-xl border-[var(--v-border)]">
                  Change Photo
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { key: "name" as const, label: "Full Name" },
                  { key: "college" as const, label: "College" },
                  { key: "city" as const, label: "City" },
                  { key: "degree" as const, label: "Degree" },
                ].map((field) => (
                  <div key={field.key}>
                    <label className="block text-xs font-medium text-[var(--v-muted)] uppercase tracking-wider mb-1.5">
                      {field.label}
                    </label>
                    <input
                      value={form[field.key]}
                      onChange={(e) => setForm((f) => ({ ...f, [field.key]: e.target.value }))}
                      className="w-full h-10 px-4 rounded-xl border border-[var(--v-border)] text-sm text-[var(--v-heading)] bg-[var(--v-bg-secondary)] outline-none focus:border-[#5D7B3D] focus:ring-2 focus:ring-[#5D7B3D]/10 transition-all"
                    />
                  </div>
                ))}
                <div>
                  <label className="block text-xs font-medium text-[var(--v-muted)] uppercase tracking-wider mb-1.5">
                    Year
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={6}
                    value={form.year}
                    onChange={(e) => setForm((f) => ({ ...f, year: Number(e.target.value) }))}
                    className="w-full h-10 px-4 rounded-xl border border-[var(--v-border)] text-sm text-[var(--v-heading)] bg-[var(--v-bg-secondary)] outline-none focus:border-[#5D7B3D] focus:ring-2 focus:ring-[#5D7B3D]/10 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[var(--v-muted)] uppercase tracking-wider mb-1.5">Bio</label>
                <textarea
                  rows={3}
                  value={form.bio}
                  onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-[var(--v-border)] text-sm text-[var(--v-heading)] bg-[var(--v-bg-secondary)] outline-none focus:border-[#5D7B3D] focus:ring-2 focus:ring-[#5D7B3D]/10 transition-all resize-none"
                />
              </div>

              <Button
                onClick={handleSave}
                disabled={saving}
                className={`gap-2 rounded-[14px] transition-all ${saved ? "bg-[#5D7B3D]" : "bg-[#5D7B3D] hover:bg-[#4a6230]"} text-white`}
              >
                <Save className="w-4 h-4" />
                {saved ? "Saved!" : saving ? "Saving..." : "Save Changes"}
              </Button>
            </motion.div>
          )}

          {activeSection === "Notifications" && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[var(--v-card)] rounded-[24px] border border-[var(--v-border)] shadow-card p-8"
            >
              <h2 className="font-bold text-[var(--v-heading)] mb-6">Notification Preferences</h2>
              <div className="space-y-4">
                {notificationPrefs.map((pref) => {
                  const enabled = preferences[pref.key] !== false
                  return (
                    <div key={pref.key} className="flex items-center justify-between py-3 border-b border-[var(--v-border)] last:border-0">
                      <span className="text-sm text-[var(--v-body)]">{pref.label}</span>
                      <button
                        onClick={() => togglePreference(pref.key)}
                        className={`w-10 h-5 rounded-full relative flex-shrink-0 transition-colors ${enabled ? "bg-[#5D7B3D]" : "bg-[var(--v-border)]"}`}
                      >
                        <div
                          className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${enabled ? "right-0.5" : "left-0.5"}`}
                        />
                      </button>
                    </div>
                  )
                })}
              </div>
            </motion.div>
          )}

          {(activeSection === "Privacy" || activeSection === "Appearance") && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[var(--v-card)] rounded-[24px] border border-[var(--v-border)] shadow-card p-8"
            >
              <h2 className="font-bold text-[var(--v-heading)] mb-4">{activeSection} Settings</h2>
              <p className="text-sm text-[var(--v-muted)]">This section will be available soon.</p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
