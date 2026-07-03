import { getUserById, listUsers } from "@/backend/db/queries/users"
import { getUserActivities } from "@/backend/db/queries/activities"
import { getDashboardStats, getUpcomingDeadlinesForUser } from "@/backend/db/queries/dashboard"
import { getUserConversations } from "@/lib/firestore/chat"
import { getDocs, query, orderBy, limit } from "firebase/firestore"
import { messagesRef } from "@/lib/firestore/chat"

export interface CommandResult {
  title: string
  content: string
}

export async function handleSlashCommand(
  command: string,
  args: string,
  userId: string,
): Promise<CommandResult | null> {
  switch (command) {
    case "mystats":
      return cmdMyStats(userId)
    case "recentactivity":
      return cmdRecentActivity(userId)
    case "findhackathon":
      return cmdFindHackathon(args)
    case "findteam":
      return cmdFindTeam(args)
    case "summarize":
      return cmdSummarizeChat(args, userId)
    case "suggest":
      return cmdSuggest(args)
    case "compare":
      return cmdCompare(args)
    default:
      return null
  }
}

async function cmdMyStats(userId: string): Promise<CommandResult> {
  const user = await getUserById(userId)
  const stats = await getDashboardStats(userId, user?.wins ?? 0, 0)
  return {
    title: "Your Platform Stats",
    content: `**${user?.name ?? "User"}** — Here's your Vijeta snapshot:

• **Wins**: ${stats.wins} competition wins
• **Projects**: ${user?.projects ?? 0} projects built
• **Saved Opportunities**: ${stats.savedCount}
• **Active Teams**: ${stats.activeTeamCount}
• **Profile Views**: ${stats.profileViews}
• **Badges**: ${(user?.badges ?? []).map((b) => b.label).join(", ") || "None yet"}
• **Top Skills**: ${(user?.skills ?? []).slice(0, 5).join(", ") || "Not set"}
• **College**: ${user?.college || "Not set"}
• **Availability**: ${user?.availability || "Not set"}`,
  }
}

async function cmdRecentActivity(userId: string): Promise<CommandResult> {
  const activities = await getUserActivities(userId, 10)
  if (!activities || activities.length === 0) {
    return {
      title: "Recent Activity",
      content: "No recent activity found. Start exploring opportunities, teams, and showcases!"
    }
  }
  const lines = activities.map(
    (a: any, i: number) =>
      `${i + 1}. **${a.type?.replace(/_/g, " ") ?? "Event"}** — ${a.description ?? ""} ${a.createdAt ? `— ${new Date(a.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}` : ""}`,
  )
  return {
    title: "Recent Activity",
    content: `Your last ${activities.length} activities on Vijeta:\n\n${lines.join("\n")}`,
  }
}

async function cmdFindHackathon(query: string): Promise<CommandResult> {
  const { getOpportunities } = await import("@/backend/db/queries/opportunities")
  const all = await getOpportunities({ limit: 20 })
  const search = query.toLowerCase()
  const filtered = all.filter(
    (o: any) =>
      o.type === "Hackathon" &&
      (!search ||
        o.title.toLowerCase().includes(search) ||
        o.tags?.some((t: string) => t.toLowerCase().includes(search))),
  )
  if (filtered.length === 0) {
    return {
      title: "Hackathon Search",
      content: `No hackathons found matching "${query || "any criteria"}". Try browsing the Discover page for more options.`
    }
  }
  const lines = filtered.slice(0, 5).map(
    (o: any) =>
      `• **${o.title}** — ${o.organizer} — ${o.prize} — Deadline: ${new Date(o.deadline).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })} ${o.isRemote ? "🌐" : "📍"}`,
  )
  return {
    title: `Hackathons ${query ? `matching "${query}"` : ""}`,
    content: `Found ${filtered.length} hackathon(s):\n\n${lines.join("\n")}\n\nCheck the **Discover** page for full details and to save opportunities.`
  }
}

async function cmdFindTeam(query: string): Promise<CommandResult> {
  const { getTeams } = await import("@/backend/db/queries/teams")
  const all = await getTeams({ isOpen: true })
  const search = query.toLowerCase()
  const filtered = all.filter(
    (t: any) =>
      !search ||
      t.name?.toLowerCase().includes(search) ||
      t.opportunity?.toLowerCase().includes(search) ||
      t.rolesNeeded?.some((r: string) => r.toLowerCase().includes(search)) ||
      t.skills?.some((s: string) => s.toLowerCase().includes(search)),
  )
  if (filtered.length === 0) {
    return {
      title: "Team Search",
      content: `No open teams found matching "${query || "any criteria"}". Try the **Team Up** page to create your own team!`
    }
  }
  const lines = filtered.slice(0, 5).map(
    (t: any) =>
      `• **${t.name}** — ${t.opportunity} — ${t.city} — Roles: ${(t.rolesNeeded ?? []).join(", ") || "Any"} — Skills: ${(t.skills ?? []).slice(0, 3).join(", ")}`,
  )
  return {
    title: `Teams ${query ? `matching "${query}"` : ""}`,
    content: `Found ${filtered.length} open team(s):\n\n${lines.join("\n")}\n\nVisit the **Team Up** page to apply or connect with team leads.`
  }
}

async function cmdSummarizeChat(personName: string, userId: string): Promise<CommandResult> {
  const user = await getUserById(userId)
  if (!personName) {
    return {
      title: "Summarize Chat",
      content: "Please specify who to summarize chat with. Example: `/summarize Saniya`"
    }
  }
  const allUsers = await listUsers({})
  const target = allUsers.find(
    (u) => u.name?.toLowerCase().includes(personName.toLowerCase()),
  )
  if (!target) {
    return {
      title: "Summarize Chat",
      content: `Could not find a user named "${personName}". Make sure you're using their display name.`
    }
  }
  const conversations = await getUserConversations(userId)
  const conv = conversations.find(
    (c) => c.type === "direct" && c.participantIds.includes(target.id),
  )
  if (!conv || !conv.id) {
    return {
      title: `Chat with ${target.name}`,
      content: `You don't have any chat history with **${target.name}**. Start a conversation from the Chat page!`
    }
  }
  const msgsSnap = await getDocs(query(messagesRef(conv.id), orderBy("createdAt", "asc"), limit(50)))
  const msgs = msgsSnap.docs.map((d) => d.data())
  if (msgs.length === 0) {
    return {
      title: `Chat with ${target.name}`,
      content: `Your conversation with **${target.name}** has no messages yet.`
    }
  }
  const myName = user?.name ?? "You"
  const lines = msgs.map(
    (m: any) => `**${m.senderId === userId ? myName : target.name}**: ${m.text}`,
  )
  return {
    title: `Chat Summary with ${target.name}`,
    content: `Recent chat history with **${target.name}** (${msgs.length} messages):\n\n${lines.slice(-20).join("\n")}`
  }
}

async function cmdSuggest(topic: string): Promise<CommandResult> {
  const ideas: Record<string, { title: string; desc: string; tech: string }[]> = {
    education: [
      { title: "GyanSetu", desc: "AI-powered offline-first learning companion with voice interface in regional languages", tech: "React Native + TensorFlow Lite + WebRTC" },
      { title: "SkillBridge", desc: "Peer-to-peer skill exchange platform for college students", tech: "Next.js + Socket.io + PostgreSQL" },
    ],
    healthcare: [
      { title: "SwasthyaSetu", desc: "Telemedicine platform connecting rural patients with urban doctors", tech: "React + WebRTC + Firebase" },
      { title: "MediTrack", desc: "Blockchain-based medical record keeping for Indian hospitals", tech: "Solidity + IPFS + React" },
    ],
    fintech: [
      { title: "GramPay", desc: "Offline-capable UPI payment solution for rural India", tech: "Flutter + Node.js + Redis" },
      { title: "CreditSahayak", desc: "Alternative credit scoring using smartphone usage patterns", tech: "Python ML + React + AWS" },
    ],
    sustainability: [
      { title: "EcoVault", desc: "Carbon credit tracking platform for college campuses", tech: "React + Node.js + IoT Sensors" },
      { title: "JalRakshak", desc: "AI-powered water quality monitoring system for villages", tech: "Python + IoT + React Native" },
    ],
  }
  const search = topic.toLowerCase()
  const matchingKeys = Object.keys(ideas).filter(
    (k) => !search || k.includes(search) || search.includes(k),
  )
  if (matchingKeys.length === 0) {
    const allIdeas = Object.values(ideas).flat()
    return {
      title: "Project Ideas",
      content: `Here are some project ideas:\n\n${allIdeas.slice(0, 3).map((i) => `• **${i.title}** — ${i.desc}\n  Tech: ${i.tech}`).join("\n\n")}\n\nWant ideas in a specific domain? Try: education, healthcare, fintech, sustainability`
    }
  }
  const result = matchingKeys.flatMap((k) => ideas[k])
  return {
    title: `Project Ideas — ${topic || "General"}`,
    content: result.map((i) => `• **${i.title}** — ${i.desc}\n  Tech: ${i.tech}`).join("\n\n") + "\n\nWant me to help you find teammates for any of these?",
  }
}

async function cmdCompare(args: string): Promise<CommandResult> {
  const parts = args.split(/\s+vs\s+/i)
  if (parts.length < 2) {
    return {
      title: "Compare",
      content: "Please specify two things to compare. Example: `/compare Smart India Hackathon vs Google Summer of Code`"
    }
  }
  const { getOpportunities } = await import("@/backend/db/queries/opportunities")
  const all = await getOpportunities({})
  const a = parts[0].trim().toLowerCase()
  const b = parts[1].trim().toLowerCase()
  const matchA = all.find((o: any) => o.title.toLowerCase().includes(a))
  const matchB = all.find((o: any) => o.title.toLowerCase().includes(b))
  if (!matchA && !matchB) {
    return { title: "Compare", content: `Could not find opportunities matching "${parts[0].trim()}" or "${parts[1].trim()}".` }
  }
  if (!matchA) return { title: "Compare", content: `Could not find "${parts[0].trim()}". But here's info on **${matchB?.title}**: ${matchB?.description ?? ""}` }
  if (!matchB) return { title: "Compare", content: `Could not find "${parts[1].trim()}". But here's info on **${matchA?.title}**: ${matchA?.description ?? ""}` }
  return {
    title: `Comparison: ${matchA.title} vs ${matchB.title}`,
    content: [
      `| Feature | ${matchA.title} | ${matchB.title} |`,
      `|---|---|---|`,
      `| **Type** | ${matchA.type} | ${matchB.type} |`,
      `| **Prize** | ${matchA.prize} | ${matchB.prize} |`,
      `| **Deadline** | ${new Date(matchA.deadline).toLocaleDateString("en-IN", { day: "numeric", month: "short" })} | ${new Date(matchB.deadline).toLocaleDateString("en-IN", { day: "numeric", month: "short" })} |`,
      `| **Difficulty** | ${matchA.difficulty} | ${matchB.difficulty} |`,
      `| **Remote** | ${matchA.isRemote ? "Yes" : "No"} | ${matchB.isRemote ? "Yes" : "No"} |`,
      `| **Location** | ${matchA.location} | ${matchB.location} |`,
      `| **Team Size** | ${matchA.teamSize} | ${matchB.teamSize} |`,
      "",
      "Both are great options! Which one aligns better with your goals?",
    ].join("\n"),
}
}
