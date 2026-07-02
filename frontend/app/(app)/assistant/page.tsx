"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Bot,
  Sparkles,
  Send,
  Compass,
  Users,
  Star,
  Trophy,
  ArrowRight,
  Lightbulb,
  Zap,
  MapPin,
  UserPlus,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
}

const shortcuts = [
  {
    icon: Compass,
    label: "Best opportunities for me",
    prompt: "What are the best opportunities matching my React & Python skills right now?",
  },
  {
    icon: Users,
    label: "Find teammates for SIH",
    prompt: "Find me teammates near Mumbai who are also looking for Smart India Hackathon teams.",
  },
  {
    icon: Trophy,
    label: "Recent activity summary",
    prompt: "Show me a summary of my recent activity on Vijeta.",
  },
  {
    icon: Lightbulb,
    label: "Suggest a project idea",
    prompt: "Suggest a unique hackathon project idea combining AI and education for rural India.",
  },
  {
    icon: MapPin,
    label: "Explore opportunities by city",
    prompt: "What opportunities are happening in Mumbai and Pune this month?",
  },
  {
    icon: UserPlus,
    label: "Find team by skill",
    prompt: "Find teams looking for a React developer with ML experience.",
  },
]

const suggestedFollowUps = [
  "What skills should I learn for SIH?",
  "Show me winning projects from last year",
  "How do I start a team?",
  "Compare SIH vs Imagine Cup",
]

const initialAssistantMessage = {
  id: "init",
  role: "assistant" as const,
  content:
    "Namaste! I'm **Margdarshak**, your AI guide on Vijeta. I can help you discover opportunities, find teammates, get project ideas, and navigate everything on the platform. Try one of the suggestions below or ask me anything!",
}

export default function AssistantPage() {
  const [messages, setMessages] = useState<Message[]>([initialAssistantMessage])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSend = (content: string) => {
    if (!content.trim()) return

    const userMsg: Message = { id: Date.now().toString(), role: "user", content }
    setMessages((prev) => [...prev, userMsg])
    setInput("")
    setIsTyping(true)

    setTimeout(() => {
      const response = getAIResponse(content)
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response,
      }
      setMessages((prev) => [...prev, aiMsg])
      setIsTyping(false)
    }, 1200)
  }

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)] lg:h-screen">
      {/* Header */}
      <div className="flex-shrink-0 border-b border-[var(--v-border)] bg-[var(--v-card)] px-4 md:px-6 py-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#5D7B3D] to-[#4a6230] flex items-center justify-center shadow-lg shadow-[#5D7B3D]/20">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-[var(--v-heading)]">Margdarshak</h1>
              <span className="flex items-center gap-1 text-[10px] font-medium text-[#5D7B3D] bg-[#5D7B3D]/10 px-2 py-0.5 rounded-full">
                <Sparkles className="w-2.5 h-2.5" /> AI
              </span>
            </div>
            <p className="text-xs text-[var(--v-muted)]">Your personal guide — ask anything about competitions, teams, or your journey</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 md:px-6 py-4 space-y-4">
        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn("flex gap-3", msg.role === "user" ? "justify-end" : "justify-start")}
            >
              {msg.role === "assistant" && (
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#5D7B3D] to-[#4a6230] flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                  <Bot className="w-4 h-4 text-white" />
                </div>
              )}
              <div
                className={cn(
                  "max-w-[80%] md:max-w-[65%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
                  msg.role === "user"
                    ? "bg-[#5D7B3D] text-white rounded-tr-md"
                    : "bg-[var(--v-card)] border border-[var(--v-border)] text-[var(--v-body)] rounded-tl-md shadow-sm",
                )}
              >
                <div className="prose prose-sm max-w-none prose-p:my-1 prose-strong:text-[var(--v-heading)]">
                  {msg.content}
                </div>
              </div>
              {msg.role === "user" && (
                <div className="w-8 h-8 rounded-xl bg-[var(--v-bg-secondary)] border border-[var(--v-border)] flex items-center justify-center flex-shrink-0 mt-0.5 overflow-hidden">
                  <img
                    src="https://api.dicebear.com/9.x/avataaars/svg?seed=AaravSharma"
                    alt="You"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing indicator */}
        {isTyping && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#5D7B3D] to-[#4a6230] flex items-center justify-center flex-shrink-0 shadow-sm">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="bg-[var(--v-card)] border border-[var(--v-border)] rounded-2xl rounded-tl-md px-4 py-3 shadow-sm">
              <div className="flex gap-1">
                <span className="w-2 h-2 rounded-full bg-[var(--v-muted)] animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-[var(--v-muted)] animate-bounce [animation-delay:150ms]" />
                <span className="w-2 h-2 rounded-full bg-[var(--v-muted)] animate-bounce [animation-delay:300ms]" />
              </div>
            </div>
          </motion.div>
        )}

        {/* Shortcuts (shown when no messages or at bottom) */}
        {messages.length === 1 && !isTyping && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-3.5 h-3.5 text-[#F6C94D]" />
              <span className="text-xs font-semibold text-[var(--v-muted)] uppercase tracking-wider">Quick Actions</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {shortcuts.map((s, i) => (
                <motion.button
                  key={s.label}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.05 }}
                  onClick={() => handleSend(s.prompt)}
                  className="flex items-start gap-3 p-3 rounded-xl border border-[var(--v-border)] bg-[var(--v-card)] hover:border-[#5D7B3D]/40 hover:bg-[#5D7B3D]/5 transition-all text-left group"
                >
                  <div className="w-8 h-8 rounded-lg bg-[#5D7B3D]/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[#5D7B3D]/20 transition-colors">
                    <s.icon className="w-4 h-4 text-[#5D7B3D]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-[var(--v-heading)]">{s.label}</p>
                    <p className="text-[11px] text-[var(--v-muted)] mt-0.5 line-clamp-1">{s.prompt}</p>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-[var(--v-muted)] flex-shrink-0 mt-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {messages.length > 1 && !isTyping && messages[messages.length - 1].role === "assistant" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-2">
            <p className="text-[10px] font-semibold text-[var(--v-muted)] uppercase tracking-wider mb-2">Follow-up suggestions</p>
            <div className="flex flex-wrap gap-2">
              {suggestedFollowUps.map((q) => (
                <button
                  key={q}
                  onClick={() => handleSend(q)}
                  className="px-3 py-1.5 rounded-full border border-[var(--v-border)] bg-[var(--v-card)] text-xs text-[var(--v-body)] hover:border-[#5D7B3D]/40 hover:text-[#5D7B3D] transition-all"
                >
                  {q}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="flex-shrink-0 border-t border-[var(--v-border)] bg-[var(--v-card)] px-4 md:px-6 py-3">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleSend(input)
          }}
          className="flex items-center gap-3 bg-[var(--v-bg-secondary)] rounded-2xl border border-[var(--v-border)] px-4 py-2 focus-within:border-[#5D7B3D] focus-within:ring-2 focus-within:ring-[#5D7B3D]/10 transition-all"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Margdarshak anything..."
            className="flex-1 bg-transparent text-sm text-[var(--v-heading)] placeholder:text-[var(--v-muted)] outline-none py-1"
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="w-9 h-9 rounded-xl bg-[#5D7B3D] hover:bg-[#4a6230] disabled:bg-[var(--v-border)] disabled:cursor-not-allowed flex items-center justify-center transition-colors"
          >
            <Send className="w-4 h-4 text-white" />
          </button>
        </form>
        <p className="text-[10px] text-[var(--v-muted)] text-center mt-1.5">
          Margdarshak is AI-powered and may make mistakes. Verify important information.
        </p>
      </div>
    </div>
  )
}

function getAIResponse(prompt: string): string {
  const lower = prompt.toLowerCase()

  if (lower.includes("activity") || lower.includes("recent")) {
    return `Here's your recent activity on Vijeta:

• **Team Up** — Explored teammates filtered by Mumbai location (2 minutes ago)
• **Discover** — Viewed **Smart India Hackathon 2025** details (15 minutes ago)
• **Showcase** — Checked winning projects from previous competitions (1 hour ago)
• **Dashboard** — Reviewed upcoming deadlines and saved opportunities (2 hours ago)

You have **3 upcoming deadlines** this week and **8 saved opportunities**. Want me to help you with any of these?`
  }

  if (lower.includes("mumbai") || lower.includes("pune") || lower.includes("city")) {
    return `Here are opportunities happening in **Mumbai & Pune**:

• **IIT Bombay Techfest Innovation Challenge** — Mumbai — Prize: ₹10,00,000 — Deadline: Nov 30
• **Smart India Hackathon 2025** — Pan India (Mumbai node available) — Prize: ₹1,00,000
• **Build With India Hackathon** — Remote, based in Pune — Prize: ₹5,00,000 + AWS credits

Want me to find teammates in these cities for any of these competitions?`
  }

  if (lower.includes("sih") || lower.includes("smart india")) {
    return `**Smart India Hackathon 2025** is India's biggest hackathon! Here's what you need:

• **Prize**: ₹1,00,000
• **Team Size**: 2-6 members
• **Deadline**: August 15, 2025
• **Difficulty**: Intermediate
• **Tags**: AI, EdTech, GovTech, Sustainability

I found **3 students near Mumbai** also looking for SIH teams. Want me to help you connect with them?`
  }

  if (lower.includes("skill") || lower.includes("react") || lower.includes("python")) {
    return `Based on your **React & Python** skills, here are the best matching opportunities:

1. **Smart India Hackathon 2025** — 94% match — Uses React for frontend & Python for AI
2. **Google Solution Challenge** — 88% match — Build with Google tech stack
3. **Build With India Hackathon** — 85% match — AWS + AI/ML focus
4. **Flipkart Grid 6.0** — 80% match — Software Development track

I also found **4 teams** looking for developers with your skill set. Want me to show them?`
  }

  if (lower.includes("project") || lower.includes("idea")) {
    return `Here's a project idea combining **AI + Education for Rural India**:

**"GyanSetu"** — An AI-powered offline-first learning companion
• Uses **voice-based interface** in regional languages (Hindi, Marathi, Tamil)
• Works **offline** on low-end smartphones
• AI tutor that adapts to each student's learning pace
• Connects rural students with **mentors from IITs/NITs** via scheduled sessions
• Uses **computer vision** to grade handwritten assignments

**Tech Stack**: React Native + TensorFlow Lite + WebRTC + PocketBase

This would be perfect for **SIH 2025** or **Google Solution Challenge**! Want me to help you find teammates for this?`
  }

  if (lower.includes("team") || lower.includes("teammate")) {
    return `I found these people near you looking for teams:

• **Priya Patel** — VJTI Mumbai — UI/UX Designer — 0.3 km away — Looking for Frontend roles
• **Rohan Desai** — VNIT Nagpur — Full Stack Dev — Available for remote teams
• **Neha Verma** — IIT Kanpur — Robotics & Hardware — Looking for SIH team

Also, there's **Team Quantum** looking for a Backend Engineer and **Team Innovators** needing a UI/UX designer.

Want me to introduce you to any of them?`
  }

  if (lower.includes("showcase") || lower.includes("winning") || lower.includes("project")) {
    return `Here are top winning projects from previous competitions:

1. **EduVerse** — AR-based learning platform for rural schools — SIH 2024 Winner
2. **CropSense** — AI-powered crop disease detection — Hack36 Winner
3. **SwasthyaSetu** — Telemedicine platform for remote areas — Google Solution Challenge Finalist
4. **Vayu** — Air quality monitoring IoT system — IIT Bombay Techfest Winner

You can view all of these in the **Showcase** section. Want me to help you build something similar?`
  }

  return `That's a great question! Based on what I know about your profile and Vijeta platform:

• You're a **3rd year CSE student at IIT Bombay**
• Your top skills: **React, Python, Machine Learning**
• You have **3 competition wins** and **7 projects**
• Currently exploring: **Smart India Hackathon**

I'd recommend checking out the **Discover** page for personalized opportunity matches, or the **Team Up** page if you're looking for teammates.

What specific aspect would you like me to help you with?`
}
