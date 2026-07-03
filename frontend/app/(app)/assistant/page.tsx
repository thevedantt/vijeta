"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { useUser } from "@clerk/nextjs"
import { motion, AnimatePresence } from "framer-motion"
import {
  Bot,
  Sparkles,
  Send,
  Compass,
  Users,
  Trophy,
  ArrowRight,
  Lightbulb,
  Zap,
  MapPin,
  UserPlus,
  GraduationCap,
  Binary,
  Slash,
} from "lucide-react"
import { cn } from "@/lib/utils"

type AIMode = "default" | "mentor" | "debate"

interface Message {
  id: string
  role: "user" | "assistant" | "assistant-mentor" | "assistant-margdarshak"
  content: string
  mode?: AIMode
}

const modeConfig: Record<AIMode, {
  label: string
  icon: typeof Bot
  gradient: string
  shadow: string
  heading: string
  description: string
  badge: string
}> = {
  default: {
    label: "Margdarshak",
    icon: Bot,
    gradient: "from-[#5D7B3D] to-[#4a6230]",
    shadow: "shadow-[#5D7B3D]/20",
    heading: "Margdarshak",
    description: "Your personal guide",
    badge: "AI Assistant",
  },
  mentor: {
    icon: GraduationCap,
    label: "Mentor",
    gradient: "from-[#7C3AED] to-[#5B21B6]",
    shadow: "shadow-[#7C3AED]/20",
    heading: "Mentor Mode",
    description: "Career guidance & mentorship",
    badge: "Mentor",
  },
  debate: {
    icon: Binary,
    label: "Debate",
    gradient: "from-[#0EA5E9] to-[#0284C7]",
    shadow: "shadow-[#0EA5E9]/20",
    heading: "Debate Mode",
    description: "Both AIs respond — compare perspectives",
    badge: "Debate",
  },
}

const shortcuts = [
  { icon: Compass, label: "Best opportunities for me", prompt: "What are the best opportunities matching my skills right now?" },
  { icon: Users, label: "Find teammates for SIH", prompt: "Find me teammates near Mumbai who are also looking for Smart India Hackathon teams." },
  { icon: Trophy, label: "Recent activity summary", prompt: "/recentactivity" },
  { icon: Lightbulb, label: "Suggest a project idea", prompt: "/suggest education" },
  { icon: MapPin, label: "Explore opportunities by city", prompt: "What opportunities are happening in Mumbai and Pune this month?" },
  { icon: UserPlus, label: "Find team by skill", prompt: "/findteam React developer" },
]

const suggestedFollowUps = [
  "What skills should I learn for SIH?",
  "Show me winning projects from last year",
  "How do I start a team?",
  "Compare SIH vs Imagine Cup",
]

const slashCommands = [
  { command: "/mystats", desc: "Your platform statistics" },
  { command: "/recentactivity", desc: "Your recent activity" },
  { command: "/findhackathon", desc: "Search hackathons" },
  { command: "/findteam", desc: "Search open teams" },
  { command: "/summarize", desc: "Summarize chat with a person", example: "/summarize Saniya" },
  { command: "/suggest", desc: "Get project ideas in a domain", example: "/suggest healthcare" },
  { command: "/compare", desc: "Compare two opportunities", example: "/compare SIH vs GSoC" },
]

const modeDescriptions: Record<AIMode, string> = {
  default: "Powered by OpenRouter GPT — fast, practical, actionable",
  mentor: "Powered by Gemini — deep, wise, career-focused mentorship",
  debate: "Both models respond — see two perspectives on every question",
}

const initialAssistantMessage = {
  id: "init",
  role: "assistant" as const,
  content: "Namaste! I'm **Margdarshak**, your AI guide on Vijeta. I can help you discover opportunities, find teammates, get project ideas, and navigate everything on the platform. Try one of the suggestions below or ask me anything!",
}

const SESSION_KEY = "margdarshak_messages"
const MODE_KEY = "margdarshak_mode"

function loadSessionMessages(): Message[] {
  if (typeof window === "undefined") return [initialAssistantMessage]
  try {
    const saved = sessionStorage.getItem(SESSION_KEY)
    if (saved) {
      const parsed = JSON.parse(saved) as Message[]
      if (Array.isArray(parsed) && parsed.length > 0) return parsed
    }
  } catch { /* ignore */ }
  return [initialAssistantMessage]
}

function loadSessionMode(): AIMode {
  if (typeof window === "undefined") return "default"
  try {
    const saved = sessionStorage.getItem(MODE_KEY)
    if (saved === "default" || saved === "mentor" || saved === "debate") return saved
  } catch { /* ignore */ }
  return "default"
}

export default function AssistantPage() {
  const [messages, setMessages] = useState<Message[]>(loadSessionMessages)
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [mode, setMode] = useState<AIMode>(loadSessionMode)
  const [showSlashHelp, setShowSlashHelp] = useState(false)
  const [selectedSlashIndex, setSelectedSlashIndex] = useState(0)
  const { user: clerkUser } = useUser()
  const userAvatar = clerkUser?.imageUrl ?? "https://api.dicebear.com/9.x/avataaars/svg?seed=Vijeta"
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(messages))
  }, [messages])

  useEffect(() => {
    sessionStorage.setItem(MODE_KEY, mode)
  }, [mode])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  useEffect(() => {
    const showing = input.startsWith("/")
    setShowSlashHelp(showing)
    if (showing) setSelectedSlashIndex(0)
  }, [input])

  const handleSend = useCallback(async (content: string) => {
    if (!content.trim()) return
    const userMsg: Message = { id: Date.now().toString(), role: "user", content }
    setMessages((prev) => [...prev, userMsg])
    setInput("")
    setShowSlashHelp(false)
    setIsTyping(true)
    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: content, mode }),
      })
      const data = await res.json()
      if (mode === "debate") {
        const margdarshakMsg: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant-margdarshak",
          content: data.margdarshak || "No response",
          mode: "default",
        }
        const mentorMsg: Message = {
          id: (Date.now() + 2).toString(),
          role: "assistant-mentor",
          content: data.mentor || "No response",
          mode: "mentor",
        }
        setMessages((prev) => [...prev, margdarshakMsg, mentorMsg])
      } else {
        const aiMsg: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: data.content || "Sorry, I couldn't process that. Try again.",
          mode,
        }
        setMessages((prev) => [...prev, aiMsg])
      }
    } catch {
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "I'm having trouble connecting right now. Please try again in a moment.",
        mode,
      }
      setMessages((prev) => [...prev, errorMsg])
    }
    setIsTyping(false)
  }, [mode])

  const cfg = modeConfig[mode]
  const ModeIcon = cfg.icon

  const selectSlashCommand = (cmd: string) => {
    setInput(cmd + " ")
    setShowSlashHelp(false)
    setSelectedSlashIndex(0)
    inputRef.current?.focus()
  }

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSlashHelp) return
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setSelectedSlashIndex((prev) => (prev + 1) % slashCommands.length)
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setSelectedSlashIndex((prev) => (prev - 1 + slashCommands.length) % slashCommands.length)
    } else if (e.key === "Enter" && showSlashHelp) {
      e.preventDefault()
      handleSend(slashCommands[selectedSlashIndex].command)
    } else if (e.key === "Escape") {
      setShowSlashHelp(false)
      setSelectedSlashIndex(0)
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)] lg:h-screen">
      {/* Header */}
      <div className="flex-shrink-0 border-b border-[var(--v-border)] bg-[var(--v-card)] px-4 md:px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className={cn("w-10 h-10 rounded-2xl bg-gradient-to-br flex items-center justify-center shadow-lg", cfg.gradient, cfg.shadow)}>
              <ModeIcon className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-[var(--v-heading)] truncate">{cfg.heading}</h1>
                <span className={cn("flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full", mode === "default" ? "text-[#5D7B3D] bg-[#5D7B3D]/10" : mode === "mentor" ? "text-[#7C3AED] bg-[#7C3AED]/10" : "text-[#0EA5E9] bg-[#0EA5E9]/10")}>
                  <Sparkles className="w-2.5 h-2.5" /> {cfg.badge}
                </span>
              </div>
              <p className="text-xs text-[var(--v-muted)] truncate">{cfg.description}</p>
            </div>
          </div>
          {/* Mode selector */}
          <div className="flex items-center gap-1 bg-[var(--v-bg-secondary)] rounded-xl p-1 flex-shrink-0 ml-3">
            {(Object.entries(modeConfig) as [AIMode, typeof cfg][]).map(([key, mc]) => {
              const Icon = mc.icon
              const isActive = mode === key
              return (
                <button
                  key={key}
                  onClick={() => setMode(key)}
                  className={cn(
                    "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all",
                    isActive
                      ? key === "default" ? "bg-[#5D7B3D] text-white shadow-sm" : key === "mentor" ? "bg-[#7C3AED] text-white shadow-sm" : "bg-[#0EA5E9] text-white shadow-sm"
                      : "text-[var(--v-muted)] hover:text-[var(--v-heading)]",
                  )}
                  title={mc.description}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{mc.label}</span>
                </button>
              )
            })}
          </div>
        </div>
        <p className="text-[10px] text-[var(--v-muted)] mt-1.5 text-center sm:text-left">{modeDescriptions[mode]}</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 md:px-6 py-4 space-y-4">
        <AnimatePresence>
          {messages.map((msg) => {
            const isDebate = msg.role === "assistant-margdarshak" || msg.role === "assistant-mentor"
            const isMargdarshakSide = msg.role === "assistant-margdarshak"
            if (isDebate) {
              const msgCfg = isMargdarshakSide ? modeConfig.default : modeConfig.mentor
              const MsgIcon = isMargdarshakSide ? Bot : GraduationCap
              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-3"
                >
                  <div className={cn("w-8 h-8 rounded-xl bg-gradient-to-br flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm", msgCfg.gradient)}>
                    <MsgIcon className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1 max-w-[80%] md:max-w-[65%]">
                    <p className={cn("text-[10px] font-semibold mb-1 uppercase tracking-wider", isMargdarshakSide ? "text-[#5D7B3D]" : "text-[#7C3AED]")}>
                      {isMargdarshakSide ? "Margdarshak" : "Mentor"}
                    </p>
                    <div className={cn(
                      "rounded-2xl px-4 py-3 text-sm leading-relaxed",
                      isMargdarshakSide
                        ? "bg-[var(--v-card)] border border-[var(--v-border)] text-[var(--v-body)] rounded-tl-md shadow-sm"
                        : "bg-[var(--v-card)] border border-[#7C3AED]/20 text-[var(--v-body)] rounded-tl-md shadow-sm",
                    )}>
                      <div className="prose prose-sm max-w-none prose-p:my-1 prose-strong:text-[var(--v-heading)]">
                        {msg.content}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            }
            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn("flex gap-3", msg.role === "user" ? "justify-end" : "justify-start")}
              >
                {msg.role === "assistant" && (
                  <div className={cn("w-8 h-8 rounded-xl bg-gradient-to-br flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm",
                    msg.mode === "mentor" ? "from-[#7C3AED] to-[#5B21B6]" : "from-[#5D7B3D] to-[#4a6230]"
                  )}>
                    {msg.mode === "mentor" ? <GraduationCap className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-white" />}
                  </div>
                )}
                <div
                  className={cn(
                    "max-w-[80%] md:max-w-[65%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
                    msg.role === "user"
                      ? "bg-[#5D7B3D] text-white rounded-tr-md"
                      : msg.mode === "mentor"
                        ? "bg-[var(--v-card)] border border-[#7C3AED]/20 text-[var(--v-body)] rounded-tl-md shadow-sm"
                        : "bg-[var(--v-card)] border border-[var(--v-border)] text-[var(--v-body)] rounded-tl-md shadow-sm",
                  )}
                >
                  {msg.mode === "mentor" && msg.role === "assistant" && (
                    <p className="text-[10px] font-semibold text-[#7C3AED] mb-1 uppercase tracking-wider">Mentor</p>
                  )}
                  <div className="prose prose-sm max-w-none prose-p:my-1 prose-strong:text-[var(--v-heading)]">
                    {msg.content}
                  </div>
                </div>
                {msg.role === "user" && (
                  <div className="w-8 h-8 rounded-xl bg-[var(--v-bg-secondary)] border border-[var(--v-border)] flex items-center justify-center flex-shrink-0 mt-0.5 overflow-hidden">
                    <img
                      src={userAvatar}
                      alt="You"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </motion.div>
            )
          })}
        </AnimatePresence>

        {/* Typing indicator */}
        {isTyping && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
            {mode === "debate" ? (
              <>
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#5D7B3D] to-[#4a6230] flex items-center justify-center flex-shrink-0 shadow-sm">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-[var(--v-card)] border border-[var(--v-border)] rounded-2xl rounded-tl-md px-4 py-3 shadow-sm">
                    <div className="flex gap-1"><span className="w-2 h-2 rounded-full bg-[var(--v-muted)] animate-bounce" /><span className="w-2 h-2 rounded-full bg-[var(--v-muted)] animate-bounce [animation-delay:150ms]" /><span className="w-2 h-2 rounded-full bg-[var(--v-muted)] animate-bounce [animation-delay:300ms]" /></div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#7C3AED] to-[#5B21B6] flex items-center justify-center flex-shrink-0 shadow-sm">
                    <GraduationCap className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-[var(--v-card)] border border-[#7C3AED]/20 rounded-2xl rounded-tl-md px-4 py-3 shadow-sm">
                    <div className="flex gap-1"><span className="w-2 h-2 rounded-full bg-[var(--v-muted)] animate-bounce" /><span className="w-2 h-2 rounded-full bg-[var(--v-muted)] animate-bounce [animation-delay:150ms]" /><span className="w-2 h-2 rounded-full bg-[var(--v-muted)] animate-bounce [animation-delay:300ms]" /></div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex gap-3">
                <div className={cn("w-8 h-8 rounded-xl bg-gradient-to-br flex items-center justify-center flex-shrink-0 shadow-sm",
                  mode === "mentor" ? "from-[#7C3AED] to-[#5B21B6]" : "from-[#5D7B3D] to-[#4a6230]"
                )}>
                  {mode === "mentor" ? <GraduationCap className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-white" />}
                </div>
                <div className="bg-[var(--v-card)] border border-[var(--v-border)] rounded-2xl rounded-tl-md px-4 py-3 shadow-sm">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 rounded-full bg-[var(--v-muted)] animate-bounce" />
                    <span className="w-2 h-2 rounded-full bg-[var(--v-muted)] animate-bounce [animation-delay:150ms]" />
                    <span className="w-2 h-2 rounded-full bg-[var(--v-muted)] animate-bounce [animation-delay:300ms]" />
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Shortcuts */}
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
      <div className="flex-shrink-0 border-t border-[var(--v-border)] bg-[var(--v-card)] px-4 md:px-6 py-3 relative">
        {/* Slash command suggestions */}
        {showSlashHelp && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute bottom-full left-4 right-4 mb-2 bg-[var(--v-card)] border border-[var(--v-border)] rounded-xl shadow-xl overflow-hidden"
          >
            <div className="px-3 py-2 border-b border-[var(--v-border)]">
              <p className="text-[10px] font-semibold text-[var(--v-muted)] uppercase tracking-wider flex items-center gap-1">
                <Slash className="w-3 h-3" /> Slash Commands
              </p>
            </div>
            <div className="max-h-48 overflow-y-auto">
              {slashCommands.map((sc, i) => {
                const isSelected = i === selectedSlashIndex
                return (
                  <button
                    key={sc.command}
                    onClick={() => selectSlashCommand(sc.command)}
                    onMouseEnter={() => setSelectedSlashIndex(i)}
                    className={cn(
                      "w-full flex items-start gap-3 px-3 py-2 transition-colors text-left",
                      isSelected ? "bg-[#5D7B3D]/10" : "hover:bg-[var(--v-bg-secondary)]",
                    )}
                  >
                    <code className={cn(
                      "text-xs font-mono font-semibold px-1.5 py-0.5 rounded flex-shrink-0 mt-0.5",
                      isSelected ? "bg-[#5D7B3D] text-white" : "bg-[#5D7B3D]/10 text-[#5D7B3D]",
                    )}>
                      {sc.command}
                    </code>
                    <div className="min-w-0">
                      <p className={cn("text-xs", isSelected ? "text-[var(--v-heading)] font-medium" : "text-[var(--v-heading)]")}>{sc.desc}</p>
                      {sc.example && <p className="text-[10px] text-[var(--v-muted)]">e.g. {sc.example}</p>}
                    </div>
                  </button>
                )
              })}
            </div>
          </motion.div>
        )}

        <form
          onSubmit={(e) => { e.preventDefault(); handleSend(input) }}
          className={cn(
            "flex items-center gap-3 rounded-2xl border px-4 py-2 focus-within:ring-2 transition-all",
            mode === "mentor"
              ? "bg-[var(--v-bg-secondary)] border-[var(--v-border)] focus-within:border-[#7C3AED] focus-within:ring-[#7C3AED]/10"
              : mode === "debate"
                ? "bg-[var(--v-bg-secondary)] border-[var(--v-border)] focus-within:border-[#0EA5E9] focus-within:ring-[#0EA5E9]/10"
                : "bg-[var(--v-bg-secondary)] border-[var(--v-border)] focus-within:border-[#5D7B3D] focus-within:ring-[#5D7B3D]/10",
          )}
        >
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleInputKeyDown}
            placeholder={mode === "mentor" ? "Ask your mentor anything..." : mode === "debate" ? "Ask both AIs..." : "Ask Margdarshak anything..."}
            className="flex-1 bg-transparent text-sm text-[var(--v-heading)] placeholder:text-[var(--v-muted)] outline-none py-1"
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className={cn(
              "w-9 h-9 rounded-xl flex items-center justify-center transition-colors disabled:bg-[var(--v-border)] disabled:cursor-not-allowed",
              mode === "mentor" ? "bg-[#7C3AED] hover:bg-[#5B21B6]" : mode === "debate" ? "bg-[#0EA5E9] hover:bg-[#0284C7]" : "bg-[#5D7B3D] hover:bg-[#4a6230]",
            )}
          >
            <Send className="w-4 h-4 text-white" />
          </button>
        </form>
        <p className="text-[10px] text-[var(--v-muted)] text-center mt-1.5">
          {mode === "mentor"
            ? "Your mentor is AI-powered — verify important advice independently."
            : mode === "debate"
              ? "Both AIs respond independently — compare and decide what works best for you."
              : "Margdarshak is AI-powered and may make mistakes. Verify important information."}
        </p>
      </div>
    </div>
  )
}
