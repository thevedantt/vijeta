"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { Sparkles, Map, FileText, ClipboardList, MessageCircle, Route } from "lucide-react"

const aiFeatures = [
  {
    icon: Map,
    title: "Find opportunities",
    description: "Describe your skills and interests. AI matches you to the best competitions.",
    color: "#5D7B3D",
    bg: "#5D7B3D10",
  },
  {
    icon: FileText,
    title: "Review your resume",
    description: "Upload your resume. Get instant, specific feedback to make it competition-ready.",
    color: "#E4568B",
    bg: "#E4568B10",
  },
  {
    icon: Route,
    title: "Generate roadmap",
    description: "Tell us your competition. Get a week-by-week plan from idea to submission.",
    color: "#A7C7E4",
    bg: "#A7C7E420",
  },
  {
    icon: ClipboardList,
    title: "Build checklist",
    description: "Get a pre-competition checklist tailored to your specific hackathon or competition.",
    color: "#F6C94D",
    bg: "#F6C94D20",
  },
  {
    icon: MessageCircle,
    title: "Answer questions",
    description: "Ask anything — judging criteria, eligibility, tech choices, pitch structure.",
    color: "#5D7B3D",
    bg: "#5D7B3D10",
  },
  {
    icon: Sparkles,
    title: "Summarize winners",
    description: "AI extracts key learnings from every winning project into a 5-minute read.",
    color: "#E4568B",
    bg: "#E4568B10",
  },
]

const chatMessages = [
  { role: "user", text: "How do I start preparing for Smart India Hackathon?" },
  {
    role: "ai",
    text: "Great choice! SIH is India's biggest hackathon. Here's your week-by-week roadmap:\n\n**Week 1:** Pick your problem statement. Browse past winning solutions in the Guidance Library.\n\n**Week 2:** Form your team. You need Frontend, Backend, AI, and a strong Presenter.\n\n**Week 3:** Build MVP. Focus on working demo, not perfection.",
  },
  { role: "user", text: "Can you review my project idea?" },
  {
    role: "ai",
    text: "Send it over! I'll check it against the judging rubric — Innovation (30%), Feasibility (25%), Impact (25%), and Presentation (20%).",
  },
]

export function AISection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })

  return (
    <section ref={ref} className="py-24 bg-gradient-to-br from-[var(--v-bg-secondary)] via-[var(--v-card)] to-[var(--v-bg-secondary)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <span className="text-sm font-medium text-[#4a90c0] uppercase tracking-widest mb-3 block">
            AI-Powered
          </span>
          <h2 className="text-4xl font-bold text-[var(--v-heading)] mb-4 flex items-center justify-center gap-3">
            <Sparkles className="w-8 h-8 text-[#A7C7E4]" />
            Meet your AI teammate
          </h2>
          <p className="text-lg text-[var(--v-body)] max-w-2xl mx-auto">
            Available 24/7 to guide you through every step — from finding the right competition to submitting a winning project.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {aiFeatures.map((feature, i) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 12 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: i * 0.07 }}
                  className="bg-[var(--v-card)] rounded-[18px] border border-[var(--v-border)] p-5 shadow-card hover:shadow-card-hover transition-shadow group hover:-translate-y-0.5 duration-200"
                >
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center mb-3"
                    style={{ backgroundColor: feature.bg }}
                  >
                    <feature.icon className="w-4 h-4" style={{ color: feature.color }} />
                  </div>
                  <h4 className="font-semibold text-sm text-[var(--v-heading)] mb-1">{feature.title}</h4>
                  <p className="text-xs text-[var(--v-body)] leading-relaxed">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="bg-[var(--v-card)] rounded-[24px] border border-[var(--v-border)] shadow-card overflow-hidden"
          >
              <div className="flex items-center gap-3 px-6 py-4 border-b border-[var(--v-border)]">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#5D7B3D] to-[#A7C7E4] flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[var(--v-heading)]">Margdarshak</p>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#5D7B3D]" />
                  <p className="text-xs text-[var(--v-muted)]">Online · Powered by Gemini</p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-4 min-h-[320px]">
              {chatMessages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.4 + i * 0.12 }}
                  className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                >
                  {msg.role === "ai" && (
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#5D7B3D] to-[#A7C7E4] flex items-center justify-center flex-shrink-0 mt-1">
                      <Sparkles className="w-3 h-3 text-white" />
                    </div>
                  )}
                  <div
                    className={`rounded-2xl px-4 py-3 max-w-[80%] text-sm leading-relaxed ${
                       msg.role === "user"
                        ? "bg-[#5D7B3D] text-white rounded-tr-sm"
                        : "bg-[var(--v-bg-secondary)] text-[var(--v-heading)] rounded-tl-sm border border-[var(--v-border)]"
                    }`}
                  >
                    {msg.text.split("\n\n").map((para, j) => (
                      <p key={j} className={j > 0 ? "mt-2" : ""}>
                        {para.replace(/\*\*(.*?)\*\*/g, "$1")}
                      </p>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="px-6 pb-6">
              <div className="flex items-center gap-3 bg-[var(--v-bg-secondary)] rounded-xl border border-[var(--v-border)] px-4 py-3">
                <input
                  type="text"
                  placeholder="Ask Vijeta AI anything..."
                  className="flex-1 text-sm text-[var(--v-heading)] bg-transparent outline-none placeholder:text-[var(--v-muted)]"
                  readOnly
                />
                <button className="w-7 h-7 rounded-lg bg-[#5D7B3D] flex items-center justify-center">
                  <Sparkles className="w-3.5 h-3.5 text-white" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
