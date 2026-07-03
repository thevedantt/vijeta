"use client"

import { Suspense, useState, useMemo, useRef, useEffect, useCallback } from "react"
import { useSearchParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Send, MoreHorizontal, Phone, Video, Check, CheckCheck, Users, ChevronLeft, MessageCircle } from "lucide-react"
import type { Timestamp } from "firebase/firestore"
import {
  type ChatConversation,
  type ChatMessage,
  subscribeConversations,
  subscribeMessages,
  sendMessage,
  markMessagesAsRead,
  findDirectConversation,
  createConversation,
} from "@/lib/firestore/chat"
import type { Student } from "@/types"
import { cn } from "@/lib/utils"

function formatTimestamp(ts: Timestamp | null): string {
  if (!ts) return ""
  return ts.toDate().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
}

const availabilityMeta: Record<string, { label: string; color: string }> = {
  "Full-time": { label: "Available", color: "#5D7B3D" },
  "Part-time": { label: "Looking for team", color: "#F6C94D" },
  "Weekends": { label: "Busy", color: "#E4568B" },
  "Not Available": { label: "Offline", color: "#A0A0A0" },
}

function ChatContent() {
  const searchParams = useSearchParams()
  const userIdParam = searchParams.get("user")
  const convParam = searchParams.get("conv")

  const [meId, setMeId] = useState<string | null>(null)
  const [studentsMap, setStudentsMap] = useState<Record<string, Student>>({})
  const [conversations, setConversations] = useState<ChatConversation[]>([])
  const [activeConvId, setActiveConvId] = useState<string | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [search, setSearch] = useState("")
  const [showMobileList, setShowMobileList] = useState(true)
  const [messageText, setMessageText] = useState("")
  const [loading, setLoading] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Resolve current user's Neon id.
  useEffect(() => {
    fetch("/api/users/me")
      .then((res) => res.json())
      .then((user: Student) => setMeId(user.id))
      .finally(() => setLoading(false))
  }, [])

  // Subscribe to conversations once we know who we are.
  useEffect(() => {
    if (!meId) return
    const unsubscribe = subscribeConversations(meId, setConversations)
    return unsubscribe
  }, [meId])

  // Fetch/cache student profiles for every participant we don't have yet.
  useEffect(() => {
    const unknownIds = new Set<string>()
    for (const conv of conversations) {
      for (const id of conv.participantIds) {
        if (id !== meId && !studentsMap[id]) unknownIds.add(id)
      }
    }
    if (unknownIds.size === 0) return

    fetch(`/api/users?ids=${[...unknownIds].join(",")}`)
      .then((res) => res.json())
      .then((users: Student[]) => {
        setStudentsMap((prev) => {
          const next = { ...prev }
          for (const u of users) next[u.id] = u
          return next
        })
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversations, meId])

  // Search for users not yet in conversations.
  const [searchUsers, setSearchUsers] = useState<Student[]>([])
  const [searchingUsers, setSearchingUsers] = useState(false)
  useEffect(() => {
    if (!search.trim() || !meId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSearchUsers([])
      return
    }
    const timer = setTimeout(() => {
      setSearchingUsers(true)
      fetch(`/api/users?search=${encodeURIComponent(search)}`)
        .then((res) => res.json())
        .then((users: Student[]) => {
          setSearchUsers(users.filter((u) => u.id !== meId))
        })
        .finally(() => setSearchingUsers(false))
    }, 300)
    return () => clearTimeout(timer)
  }, [search, meId])

  const handleStartConversation = useCallback(
    async (userId: string) => {
      const existing = await findDirectConversation(meId!, userId)
      const chatId = existing ? existing.id! : await createConversation("direct", [meId!, userId])
      setActiveConvId(chatId)
      setShowMobileList(false)
      setSearch("")
      setSearchUsers([])
    },
    [meId],
  )

  // Deep-link handling: ?conv=<id> or ?user=<id>.
  useEffect(() => {
    if (!meId) return

    if (convParam) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setActiveConvId(convParam)
      setShowMobileList(false)
      return
    }

    if (userIdParam) {
      ;(async () => {
        const existing = await findDirectConversation(meId, userIdParam)
        const chatId = existing ? existing.id! : await createConversation("direct", [meId, userIdParam])
        setActiveConvId(chatId)
        setShowMobileList(false)
      })()
    }
  }, [meId, convParam, userIdParam])

  // Subscribe to messages for the active conversation.
  useEffect(() => {
    if (!activeConvId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setMessages([])
      return
    }
    const unsubscribe = subscribeMessages(activeConvId, setMessages)
    if (meId) markMessagesAsRead(activeConvId, meId)
    return unsubscribe
  }, [activeConvId, meId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [activeConvId, messages])

  const getConversationName = useCallback(
    (conv: ChatConversation): string => {
      if (conv.type === "group") return conv.name || "Group"
      const otherId = conv.participantIds.find((id) => id !== meId) || conv.participantIds[0]
      return studentsMap[otherId]?.name || "..."
    },
    [meId, studentsMap],
  )

  const getConversationAvatar = useCallback(
    (conv: ChatConversation): string => {
      if (conv.type === "group") return ""
      const otherId = conv.participantIds.find((id) => id !== meId) || conv.participantIds[0]
      return studentsMap[otherId]?.avatar || ""
    },
    [meId, studentsMap],
  )

  const getConversationStatus = useCallback(
    (conv: ChatConversation): string => {
      if (conv.type === "group") return `${conv.participantIds.length} members`
      const otherId = conv.participantIds.find((id) => id !== meId) || conv.participantIds[0]
      const student = studentsMap[otherId]
      if (!student) return ""
      return availabilityMeta[student.availability ?? "Full-time"]?.label ?? ""
    },
    [meId, studentsMap],
  )

  const getConversationColor = useCallback(
    (conv: ChatConversation): string => {
      if (conv.type === "group") return "#5D7B3D"
      const otherId = conv.participantIds.find((id) => id !== meId) || conv.participantIds[0]
      const student = studentsMap[otherId]
      if (!student) return "#5D7B3D"
      return availabilityMeta[student.availability ?? "Full-time"]?.color ?? "#A0A0A0"
    },
    [meId, studentsMap],
  )

  const filteredConvs = useMemo(
    () => conversations.filter((c) => getConversationName(c).toLowerCase().includes(search.toLowerCase())),
    [conversations, search, getConversationName],
  )

  const activeConv = conversations.find((c) => c.id === activeConvId)

  const handleSend = async () => {
    if (!messageText.trim() || !activeConvId || !meId) return
    const text = messageText
    setMessageText("")
    await sendMessage(activeConvId, meId, text)
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
  }

  if (loading) {
    return (
      <div className="h-[calc(100vh-4rem)] lg:h-[calc(100vh-5rem)] flex items-center justify-center">
        <p className="text-sm text-[var(--v-muted)]">Loading chats...</p>
      </div>
    )
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
          {filteredConvs.length > 0 ? (
            filteredConvs.map((conv) => {
              const isActive = conv.id === activeConvId
              const name = getConversationName(conv)
              const avatar = getConversationAvatar(conv)
              const status = getConversationStatus(conv)
              const color = getConversationColor(conv)
              const unread = meId ? conv.unread[meId] ?? 0 : 0
              return (
                <button
                  key={conv.id}
                  onClick={() => handleConversationClick(conv.id!)}
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
                      {avatar ? (
                        <img src={avatar} alt="" className="w-11 h-11 rounded-2xl bg-[var(--v-bg-secondary)] border border-[var(--v-border)]" />
                      ) : (
                        <div className="w-11 h-11 rounded-2xl bg-[var(--v-bg-secondary)] border border-[var(--v-border)]" />
                      )}
                      <div
                        className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-[var(--v-card)]"
                        style={{ backgroundColor: color }}
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-sm font-semibold text-[var(--v-heading)] truncate">{name}</span>
                      <span className="text-[10px] text-[var(--v-muted)] flex-shrink-0 ml-2">{formatTimestamp(conv.lastTime)}</span>
                    </div>
                    <p className="text-xs text-[var(--v-muted)] truncate mb-0.5">{conv.lastMessage || status}</p>
                    <div className="flex items-center gap-1.5">
                      {conv.type === "group" && <span className="text-[10px] text-[var(--v-muted)]">{status}</span>}
                      {unread > 0 && (
                        <span className="text-[10px] font-bold text-white bg-[#5D7B3D] rounded-full px-1.5 py-0.5 leading-none">
                          {unread}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              )
            })
          ) : search.trim() && searchUsers.length === 0 ? (
            searchingUsers ? (
              <p className="text-sm text-[var(--v-muted)] text-center py-8">Searching...</p>
            ) : (
              <p className="text-sm text-[var(--v-muted)] text-center py-8">No conversations found</p>
            )
          ) : null}
          {search.trim() && searchUsers.length > 0 && (
            <>
              <div className="px-4 py-2 text-[11px] font-semibold text-[var(--v-muted)] uppercase tracking-wider">
                People
              </div>
              {searchUsers.map((user) => (
                <button
                  key={user.id}
                  onClick={() => handleStartConversation(user.id)}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-[var(--v-bg-secondary)]"
                >
                  {user.avatar ? (
                    <img src={user.avatar} alt="" className="w-11 h-11 rounded-2xl bg-[var(--v-bg-secondary)] border border-[var(--v-border)]" />
                  ) : (
                    <div className="w-11 h-11 rounded-2xl bg-[var(--v-bg-secondary)] border border-[var(--v-border)]" />
                  )}
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-semibold text-[var(--v-heading)] truncate block">{user.name}</span>
                    <span className="text-xs text-[var(--v-muted)] truncate block">{user.college}</span>
                  </div>
                </button>
              ))}
            </>
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
              ) : (() => {
                const hAvatar = getConversationAvatar(activeConv)
                return hAvatar ? (
                  <img
                    src={hAvatar}
                    alt=""
                    className="w-9 h-9 rounded-xl flex-shrink-0 bg-[var(--v-bg-secondary)] border border-[var(--v-border)]"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-xl flex-shrink-0 bg-[var(--v-bg-secondary)] border border-[var(--v-border)]" />
                )
              })()}
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
                {messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-sm text-[var(--v-muted)]">No messages yet. Say hello!</p>
                  </div>
                ) : (
                  messages.map((msg) => {
                    const isMe = msg.senderId === meId
                    const sender = studentsMap[msg.senderId]
                    return (
                      <motion.div key={msg.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.15 }}>
                        <div className={cn("flex items-end gap-2 mb-3", isMe ? "flex-row-reverse" : "flex-row")}>
                          {!isMe && sender?.avatar ? (
                            <img src={sender.avatar} alt="" className="w-7 h-7 rounded-full flex-shrink-0 bg-[var(--v-bg-secondary)]" />
                          ) : !isMe ? (
                            <div className="w-7 h-7 rounded-full flex-shrink-0 bg-[var(--v-bg-secondary)]" />
                          ) : null}
                          <div className={cn("max-w-[75%]", isMe ? "items-end" : "items-start")}>
                            <div
                              className={cn(
                                "px-4 py-2.5 rounded-2xl text-sm leading-relaxed",
                                isMe
                                  ? "bg-[#5D7B3D] text-white rounded-br-md"
                                  : "bg-[var(--v-bg-secondary)] text-[var(--v-body)] rounded-bl-md border border-[var(--v-border)]"
                              )}
                            >
                              {msg.text}
                            </div>
                            <div className={cn("flex items-center gap-1 mt-0.5 px-1", isMe ? "justify-end" : "justify-start")}>
                              <span className="text-[10px] text-[var(--v-muted)]">{formatTimestamp(msg.createdAt)}</span>
                              {isMe && (
                                msg.read
                                  ? <CheckCheck className="w-3 h-3 text-[#5D7B3D]" />
                                  : <Check className="w-3 h-3 text-[var(--v-muted)]" />
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )
                  })
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
