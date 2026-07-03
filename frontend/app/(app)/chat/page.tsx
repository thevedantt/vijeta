"use client"

import { Suspense, useState, useMemo, useRef, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Send, MoreHorizontal, Phone, Video, Check, CheckCheck, Users, ChevronLeft, MessageCircle } from "lucide-react"
import { students } from "@/lib/data/students"
import { cn } from "@/lib/utils"

interface Message {
  id: string
  senderId: string
  text: string
  time: string
  read: boolean
}

interface Conversation {
  id: string
  type: "direct" | "group"
  name?: string
  participantIds: string[]
  lastMessage: string
  lastTime: string
  unread: number
  messages: Message[]
}

const currentUserId = "s1"

const now = new Date()
const mins = (n: number) => new Date(now.getTime() - n * 60000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
const days = (n: number) => {
  const d = new Date(now.getTime() - n * 86400000)
  return d.toLocaleDateString([], { weekday: "short" })
}

const mockConversations: Conversation[] = [
  {
    id: "c1", type: "direct", participantIds: ["s2"],
    lastMessage: "Sounds great! Let's connect on the details tomorrow.", lastTime: mins(5), unread: 2,
    messages: [
      { id: "m1", senderId: "s2", text: "Hey! I saw your profile on Vijeta. Would love to collaborate on the Smart India Hackathon.", time: mins(60), read: true },
      { id: "m2", senderId: currentUserId, text: "That sounds awesome! What's your role?", time: mins(55), read: true },
      { id: "m3", senderId: "s2", text: "I'm a designer and frontend developer. I can handle the UI/UX.", time: mins(30), read: true },
      { id: "m4", senderId: "s2", text: "Sounds great! Let's connect on the details tomorrow.", time: mins(5), read: false },
    ],
  },
  {
    id: "c2", type: "direct", participantIds: ["s5"],
    lastMessage: "Sure, I'll review the proposal and get back to you.", lastTime: mins(45), unread: 0,
    messages: [
      { id: "m5", senderId: currentUserId, text: "Can you review the ML model architecture?", time: mins(90), read: true },
      { id: "m6", senderId: "s5", text: "Sure, I'll review the proposal and get back to you.", time: mins(45), read: true },
    ],
  },
  {
    id: "c3", type: "group", name: "SIH 2026 Squad", participantIds: ["s2", "s5", "s8"],
    lastMessage: "Priya: Meeting at 5pm tomorrow?", lastTime: mins(120), unread: 5,
    messages: [
      { id: "m7", senderId: "s2", text: "Has everyone seen the problem statement?", time: mins(180), read: true },
      { id: "m8", senderId: "s5", text: "Yes, looks promising!", time: mins(150), read: true },
      { id: "m9", senderId: "s8", text: "I'll start working on the backend architecture.", time: mins(130), read: true },
      { id: "m10", senderId: "s2", text: "Meeting at 5pm tomorrow?", time: mins(120), read: false },
    ],
  },
  {
    id: "c4", type: "direct", participantIds: ["s3"],
    lastMessage: "Awesome! Let me know when you're free.", lastTime: mins(180), unread: 0,
    messages: [
      { id: "m11", senderId: "s3", text: "Hey! I'm looking for a team for Google Solution Challenge.", time: mins(240), read: true },
      { id: "m12", senderId: currentUserId, text: "I'm interested! I have experience with Flutter and Firebase.", time: mins(210), read: true },
      { id: "m13", senderId: "s3", text: "Awesome! Let me know when you're free.", time: mins(180), read: true },
    ],
  },
  {
    id: "c5", type: "direct", participantIds: ["s7"],
    lastMessage: "Would you be interested in joining our team?", lastTime: days(1), unread: 0,
    messages: [
      { id: "m14", senderId: "s7", text: "I saw your profile on Discover. Great projects!", time: days(2), read: true },
      { id: "m15", senderId: currentUserId, text: "Thank you! Your work on the chatbot is impressive too.", time: days(2), read: true },
      { id: "m16", senderId: "s7", text: "Would you be interested in joining our team?", time: days(1), read: true },
    ],
  },
  {
    id: "c6", type: "group", name: "Vijeta Dev Circle", participantIds: ["s2", "s5", "s8", "s10", "s12"],
    lastMessage: "Ananya: Check out the new map feature!", lastTime: days(2), unread: 0,
    messages: [
      { id: "m17", senderId: "s10", text: "Has anyone tried the new opportunity map?", time: days(3), read: true },
      { id: "m18", senderId: "s12", text: "Yes, it's really useful for finding nearby hackathons!", time: days(2), read: true },
      { id: "m19", senderId: "s8", text: "Check out the new map feature!", time: days(2), read: true },
    ],
  },
]

function getConversationName(conv: Conversation): string {
  if (conv.type === "group") return conv.name || "Group"
  const otherId = conv.participantIds.find((id) => id !== currentUserId) || conv.participantIds[0]
  const student = students.find((s) => s.id === otherId)
  return student?.name || "Unknown"
}

function getConversationAvatar(conv: Conversation): string {
  if (conv.type === "group") return ""
  const otherId = conv.participantIds.find((id) => id !== currentUserId) || conv.participantIds[0]
  const student = students.find((s) => s.id === otherId)
  return student?.avatar || ""
}

function getConversationStatus(conv: Conversation): string {
  if (conv.type === "group") return `${conv.participantIds.length} members`
  const otherId = conv.participantIds.find((id) => id !== currentUserId) || conv.participantIds[0]
  const student = students.find((s) => s.id === otherId)
  if (!student) return ""
  const statuses: Record<string, string> = {
    available: "Available",
    looking: "Looking for team",
    busy: "Busy",
    offline: "Offline",
  }
  return statuses[student.availability ?? "offline"] || ""
}

function getConversationColor(conv: Conversation): string {
  if (conv.type === "group") return "#5D7B3D"
  const otherId = conv.participantIds.find((id) => id !== currentUserId) || conv.participantIds[0]
  const student = students.find((s) => s.id === otherId)
  if (!student) return "#5D7B3D"
  const colors: Record<string, string> = {
    available: "#5D7B3D",
    looking: "#F6C94D",
    busy: "#E4568B",
    offline: "#A0A0A0",
  }
  return colors[student.availability ?? "offline"] || "#A0A0A0"
}

function MessageBubble({ message }: { message: Message }) {
  const isMe = message.senderId === currentUserId
  const sender = students.find((s) => s.id === message.senderId)
  return (
    <div className={cn("flex items-end gap-2 mb-3", isMe ? "flex-row-reverse" : "flex-row")}>
      {!isMe && (
        <img src={sender?.avatar || ""} alt="" className="w-7 h-7 rounded-full flex-shrink-0 bg-[var(--v-bg-secondary)]" />
      )}
      <div className={cn("max-w-[75%]", isMe ? "items-end" : "items-start")}>
        <div
          className={cn(
            "px-4 py-2.5 rounded-2xl text-sm leading-relaxed",
            isMe
              ? "bg-[#5D7B3D] text-white rounded-br-md"
              : "bg-[var(--v-bg-secondary)] text-[var(--v-body)] rounded-bl-md border border-[var(--v-border)]"
          )}
        >
          {message.text}
        </div>
        <div className={cn("flex items-center gap-1 mt-0.5 px-1", isMe ? "justify-end" : "justify-start")}>
          <span className="text-[10px] text-[var(--v-muted)]">{message.time}</span>
          {isMe && (
            message.read
              ? <CheckCheck className="w-3 h-3 text-[#5D7B3D]" />
              : <Check className="w-3 h-3 text-[var(--v-muted)]" />
          )}
        </div>
      </div>
    </div>
  )
}

function ChatContent() {
  const searchParams = useSearchParams()
  const userIdParam = searchParams.get("user")
  const [search, setSearch] = useState("")
  const [activeConvId, setActiveConvId] = useState<string | null>(null)
  const [showMobileList, setShowMobileList] = useState(true)
  const [messageText, setMessageText] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations)

  useEffect(() => {
    if (userIdParam) {
      const existingConv = conversations.find((c) =>
        c.type === "direct" && c.participantIds.includes(userIdParam)
      )
      if (existingConv) {
        setActiveConvId(existingConv.id)
        setShowMobileList(false)
      } else {
        const student = students.find((s) => s.id === userIdParam)
        if (student) {
          const newConv: Conversation = {
            id: `c-new-${userIdParam}`,
            type: "direct",
            participantIds: [currentUserId, userIdParam],
            lastMessage: "",
            lastTime: "Just now",
            unread: 0,
            messages: [],
          }
          setConversations((prev) => [newConv, ...prev])
          setActiveConvId(newConv.id)
          setShowMobileList(false)
        }
      }
    }
  }, [userIdParam])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [activeConvId, conversations])

  const filteredConvs = useMemo(
    () => conversations.filter((c) => getConversationName(c).toLowerCase().includes(search.toLowerCase())),
    [conversations, search]
  )

  const activeConv = conversations.find((c) => c.id === activeConvId)

  const handleSend = () => {
    if (!messageText.trim() || !activeConvId) return
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id !== activeConvId) return c
        return {
          ...c,
          lastMessage: messageText,
          lastTime: "Just now",
          unread: 0,
          messages: [
            ...c.messages,
            {
              id: `m-${Date.now()}`,
              senderId: currentUserId,
              text: messageText,
              time: "Just now",
              read: false,
            },
          ],
        }
      })
    )
    setMessageText("")
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleConversationClick = (convId: string) => {
    setActiveConvId(convId)
    setShowMobileList(false)
    setConversations((prev) =>
      prev.map((c) => (c.id === convId ? { ...c, unread: 0 } : c))
    )
  }

  const getMessages = () => {
    if (!activeConv) return []
    return activeConv.messages
  }

  return (
    <div className="h-[calc(100vh-4rem)] lg:h-[calc(100vh-5rem)] p-0 flex">
      {/* Conversation List */}
      <div
        className={cn(
          "w-full lg:w-80 lg:border-r lg:border-[var(--v-border)] bg-[var(--v-card)] flex flex-col flex-shrink-0",
          showMobileList ? "block" : "hidden lg:flex"
        )}
      >
        <div className="p-4 border-b border-[var(--v-border)]">
          <h1 className="text-lg font-bold text-[var(--v-heading)] mb-3">Chats</h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--v-muted)]" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-[var(--v-bg-secondary)] border border-[var(--v-border)] text-sm text-[var(--v-body)] placeholder:text-[var(--v-muted)] outline-none focus:border-[#5D7B3D] transition-colors"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-2">
          {filteredConvs.length === 0 ? (
            <p className="text-sm text-[var(--v-muted)] text-center py-8">No conversations found</p>
          ) : (
            filteredConvs.map((conv) => {
              const isActive = conv.id === activeConvId
              const name = getConversationName(conv)
              const avatar = getConversationAvatar(conv)
              const status = getConversationStatus(conv)
              const color = getConversationColor(conv)
              return (
                <button
                  key={conv.id}
                  onClick={() => handleConversationClick(conv.id)}
                  className={cn(
                    "w-full flex items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-[var(--v-bg-secondary)]",
                    isActive && "bg-[var(--v-bg-secondary)]"
                  )}
                >
                  {conv.type === "group" ? (
                    <div className="w-11 h-11 rounded-2xl bg-[#5D7B3D]/15 flex items-center justify-center flex-shrink-0 border border-[#5D7B3D]/20">
                      <Users className="w-5 h-5 text-[#5D7B3D]" />
                    </div>
                  ) : (
                    <div className="relative flex-shrink-0">
                      <img src={avatar} alt="" className="w-11 h-11 rounded-2xl bg-[var(--v-bg-secondary)] border border-[var(--v-border)]" />
                      <div
                        className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-[var(--v-card)]"
                        style={{ backgroundColor: color }}
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-sm font-semibold text-[var(--v-heading)] truncate">{name}</span>
                      <span className="text-[10px] text-[var(--v-muted)] flex-shrink-0 ml-2">{conv.lastTime}</span>
                    </div>
                    <p className="text-xs text-[var(--v-muted)] truncate mb-0.5">{conv.lastMessage || status}</p>
                    <div className="flex items-center gap-1.5">
                      {conv.type === "group" && <span className="text-[10px] text-[var(--v-muted)]">{status}</span>}
                      {conv.unread > 0 && (
                        <span className="text-[10px] font-bold text-white bg-[#5D7B3D] rounded-full px-1.5 py-0.5 leading-none">
                          {conv.unread}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              )
            })
          )}
        </div>
      </div>

      {/* Message Area */}
      <div
        className={cn(
          "flex-1 flex flex-col bg-[var(--v-bg)]",
          showMobileList ? "hidden lg:flex" : "flex"
        )}
      >
        {!activeConv ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-[var(--v-bg-secondary)] border border-[var(--v-border)] flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-7 h-7 text-[var(--v-muted)]" />
              </div>
              <p className="text-[var(--v-muted)] text-sm">Select a conversation to start chatting</p>
            </div>
          </div>
        ) : (
          <>
            {/* Chat Header */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-[var(--v-border)] bg-[var(--v-card)] flex-shrink-0">
              <button
                onClick={() => setShowMobileList(true)}
                className="lg:hidden w-8 h-8 rounded-lg hover-bg-v-hover flex items-center justify-center -ml-1"
              >
                <ChevronLeft className="w-4 h-4 text-[var(--v-muted)]" />
              </button>
              {activeConv.type === "group" ? (
                <div className="w-9 h-9 rounded-xl bg-[#5D7B3D]/15 flex items-center justify-center flex-shrink-0 border border-[#5D7B3D]/20">
                  <Users className="w-4 h-4 text-[#5D7B3D]" />
                </div>
              ) : (
                <img
                  src={getConversationAvatar(activeConv)}
                  alt=""
                  className="w-9 h-9 rounded-xl flex-shrink-0 bg-[var(--v-bg-secondary)] border border-[var(--v-border)]"
                />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[var(--v-heading)] truncate">{getConversationName(activeConv)}</p>
                <p className="text-[11px] text-[var(--v-muted)]">{getConversationStatus(activeConv)}</p>
              </div>
              <button className="w-8 h-8 rounded-lg hover-bg-v-hover flex items-center justify-center">
                <Phone className="w-4 h-4 text-[var(--v-muted)]" />
              </button>
              <button className="w-8 h-8 rounded-lg hover-bg-v-hover flex items-center justify-center">
                <Video className="w-4 h-4 text-[var(--v-muted)]" />
              </button>
              <button className="w-8 h-8 rounded-lg hover-bg-v-hover flex items-center justify-center">
                <MoreHorizontal className="w-4 h-4 text-[var(--v-muted)]" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4">
              <AnimatePresence mode="popLayout">
                {getMessages().length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-sm text-[var(--v-muted)]">No messages yet. Say hello!</p>
                  </div>
                ) : (
                  getMessages().map((msg) => (
                    <motion.div key={msg.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.15 }}>
                      <MessageBubble message={msg} />
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="px-4 py-3 border-t border-[var(--v-border)] bg-[var(--v-card)] flex-shrink-0">
              <div className="flex items-center gap-2 bg-[var(--v-bg-secondary)] rounded-2xl border border-[var(--v-border)] px-3 py-1.5">
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1 bg-transparent text-sm text-[var(--v-body)] placeholder:text-[var(--v-muted)] outline-none py-1.5"
                />
                <button
                  onClick={handleSend}
                  disabled={!messageText.trim()}
                  className="w-8 h-8 rounded-xl bg-[#5D7B3D] flex items-center justify-center disabled:opacity-40 transition-opacity flex-shrink-0"
                >
                  <Send className="w-3.5 h-3.5 text-white" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default function ChatPage() {
  return (
    <Suspense fallback={<div className="h-[calc(100vh-4rem)] lg:h-[calc(100vh-5rem)] flex items-center justify-center"><p className="text-sm text-[var(--v-muted)]">Loading chats...</p></div>}>
      <ChatContent />
    </Suspense>
  )
}
