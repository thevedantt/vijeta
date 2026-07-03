"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Plus, Minus, Check, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Team, Opportunity } from "@/types"

const autofillData = {
  teamName: "CodeCatalysts",
  description: "Looking for passionate developers to build an AI-powered platform for education accessibility in rural India.",
  roles: ["Frontend Developer", "ML Engineer", "UI/UX Designer"],
  college: "IIT Bombay",
  city: "Mumbai",
}

interface CreateTeamModalProps {
  open: boolean
  onClose: () => void
  onCreate: (team: Team) => void
  opportunities: Opportunity[]
}

export function CreateTeamModal({ open, onClose, onCreate, opportunities }: CreateTeamModalProps) {
  const [teamName, setTeamName] = useState("")
  const [opportunityId, setOpportunityId] = useState("")
  const [description, setDescription] = useState("")
  const [roleInput, setRoleInput] = useState("")
  const [roles, setRoles] = useState<string[]>([])
  const [college, setCollege] = useState("")
  const [city, setCity] = useState("")
  const [created, setCreated] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const addRole = () => {
    const trimmed = roleInput.trim()
    if (trimmed && !roles.includes(trimmed)) {
      setRoles([...roles, trimmed])
      setRoleInput("")
    }
  }

  const removeRole = (r: string) => setRoles(roles.filter((x) => x !== r))

  const handleAutofill = () => {
    setTeamName(autofillData.teamName)
    setOpportunityId(opportunities[0]?.id ?? "")
    setDescription(autofillData.description)
    setRoles(autofillData.roles)
    setCollege(autofillData.college)
    setCity(autofillData.city)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!teamName || !opportunityId || submitting) return

    setSubmitting(true)
    try {
      const res = await fetch("/api/teams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: teamName,
          opportunityId,
          description,
          college: college || undefined,
          city: city || undefined,
          rolesNeeded: roles,
        }),
      })
      if (!res.ok) return
      const newTeam: Team = await res.json()
      onCreate(newTeam)
      setCreated(true)
    } finally {
      setSubmitting(false)
    }
  }

  const reset = () => {
    setTeamName("")
    setOpportunityId("")
    setDescription("")
    setRoles([])
    setRoleInput("")
    setCollege("")
    setCity("")
    setCreated(false)
    onClose()
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-[520px] z-50 bg-[var(--v-card)] rounded-2xl border border-[var(--v-border)] shadow-xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between p-5 border-b border-[var(--v-border)]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#E4568B]/10 flex items-center justify-center">
                  <Plus className="w-4 h-4 text-[#E4568B]" />
                </div>
                <h2 className="font-bold text-[var(--v-heading)]">Create Team</h2>
              </div>
              <div className="flex items-center gap-2">
                {!created && (
                  <button
                    type="button"
                    onClick={handleAutofill}
                    className="text-xs font-medium text-[#5D7B3D] hover:text-[#4a6230] flex items-center gap-1 px-2.5 py-1.5 rounded-lg hover:bg-[#5D7B3D]/10 transition-colors"
                  >
                    <Sparkles className="w-3 h-3" /> Autofill
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-lg hover-bg-v-hover flex items-center justify-center"
                >
                  <X className="w-4 h-4 text-[var(--v-muted)]" />
                </button>
              </div>
            </div>

            {created ? (
              <div className="p-10 text-center">
                <div className="w-14 h-14 rounded-full bg-[#5D7B3D]/10 flex items-center justify-center mx-auto mb-4">
                  <Check className="w-6 h-6 text-[#5D7B3D]" />
                </div>
                <h3 className="text-lg font-bold text-[var(--v-heading)] mb-1">Team Created!</h3>
                <p className="text-sm text-[var(--v-muted)] mb-6">{teamName} is now live — check Open Teams tab.</p>
                <div className="flex gap-3 justify-center">
                  <Button variant="outline" onClick={reset} className="rounded-xl">
                    Close
                  </Button>
                  <Button
                    onClick={() => {
                      setCreated(false)
                      setTeamName("")
                      setOpportunityId("")
                      setDescription("")
                      setRoles([])
                      setCollege("")
                      setCity("")
                    }}
                    className="bg-[#E4568B] hover:bg-[#cc3f79] text-white rounded-xl"
                  >
                    Create another
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-5 space-y-4">
                <div>
                  <label className="text-xs font-semibold text-[var(--v-muted)] mb-1.5 block">Team Name *</label>
                  <input
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    placeholder="e.g. Quantum Devs"
                    className="w-full h-10 px-3 rounded-xl border border-[var(--v-border)] bg-[var(--v-bg-secondary)] text-sm text-[var(--v-heading)] placeholder:text-[var(--v-muted)] focus:outline-none focus:border-[#E4568B] transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-[var(--v-muted)] mb-1.5 block">Opportunity *</label>
                  <select
                    value={opportunityId}
                    onChange={(e) => setOpportunityId(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-[var(--v-border)] bg-[var(--v-bg-secondary)] text-sm text-[var(--v-heading)] focus:outline-none focus:border-[#E4568B] transition-colors appearance-none"
                    required
                  >
                    <option value="">Select an opportunity</option>
                    {opportunities.map((o) => (
                      <option key={o.id} value={o.id}>{o.title}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-[var(--v-muted)] mb-1.5 block">Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="What kind of teammates are you looking for?"
                    rows={3}
                    className="w-full px-3 py-2 rounded-xl border border-[var(--v-border)] bg-[var(--v-bg-secondary)] text-sm text-[var(--v-heading)] placeholder:text-[var(--v-muted)] focus:outline-none focus:border-[#E4568B] transition-colors resize-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-[var(--v-muted)] mb-1.5 block">Roles Needed</label>
                  <div className="flex gap-2">
                    <input
                      value={roleInput}
                      onChange={(e) => setRoleInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addRole())}
                      placeholder="e.g. Frontend Developer"
                      className="flex-1 h-10 px-3 rounded-xl border border-[var(--v-border)] bg-[var(--v-bg-secondary)] text-sm text-[var(--v-heading)] placeholder:text-[var(--v-muted)] focus:outline-none focus:border-[#E4568B] transition-colors"
                    />
                    <button
                      type="button"
                      onClick={addRole}
                      className="w-10 h-10 rounded-xl bg-[#E4568B]/10 border border-[#E4568B]/20 flex items-center justify-center hover:bg-[#E4568B]/20 transition-colors"
                    >
                      <Plus className="w-4 h-4 text-[#E4568B]" />
                    </button>
                  </div>
                  {roles.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {roles.map((r) => (
                        <span
                          key={r}
                          className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-[#E4568B]/10 border border-[#E4568B]/20 text-[#E4568B]"
                        >
                          {r}
                          <button type="button" onClick={() => removeRole(r)} className="hover:text-[#cc3f79]">
                            <Minus className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-[var(--v-muted)] mb-1.5 block">College</label>
                    <input
                      value={college}
                      onChange={(e) => setCollege(e.target.value)}
                      placeholder="e.g. IIT Bombay"
                      className="w-full h-10 px-3 rounded-xl border border-[var(--v-border)] bg-[var(--v-bg-secondary)] text-sm text-[var(--v-heading)] placeholder:text-[var(--v-muted)] focus:outline-none focus:border-[#E4568B] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-[var(--v-muted)] mb-1.5 block">City</label>
                    <input
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="e.g. Mumbai"
                      className="w-full h-10 px-3 rounded-xl border border-[var(--v-border)] bg-[var(--v-bg-secondary)] text-sm text-[var(--v-heading)] placeholder:text-[var(--v-muted)] focus:outline-none focus:border-[#E4568B] transition-colors"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    className="flex-1 h-11 rounded-xl border-[var(--v-border)]"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 h-11 rounded-xl bg-[#E4568B] hover:bg-[#cc3f79] text-white"
                  >
                    <Plus className="w-4 h-4" /> {submitting ? "Creating..." : "Create Team"}
                  </Button>
                </div>
              </form>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
