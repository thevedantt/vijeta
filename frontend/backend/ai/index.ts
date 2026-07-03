import { getUserById } from "@/backend/db/queries/users"
import { getUserActivities } from "@/backend/db/queries/activities"
import { getDashboardStats } from "@/backend/db/queries/dashboard"
import { getOpportunities } from "@/backend/db/queries/opportunities"
import { getTeams } from "@/backend/db/queries/teams"
import { handleSlashCommand } from "./commands"
import { callGemini, buildMentorSystemPrompt } from "./gemini"

export type AIMode = "default" | "mentor" | "debate"

interface AIChatRequest {
  message: string
  userId: string
  mode?: AIMode
}

interface SingleResponse {
  content: string
  command?: string
}

interface DebateResponse {
  margdarshak: string
  mentor: string
  command?: string
}

export type AIChatResponse = SingleResponse | DebateResponse

export async function processAIChat({ message, userId, mode = "default" }: AIChatRequest): Promise<AIChatResponse> {
  const trimmed = message.trim()

  const slashMatch = trimmed.match(/^\/(\w+)(?:[\s]+([\s\S]*))?$/)
  if (slashMatch) {
    const command = slashMatch[1].toLowerCase()
    const args = (slashMatch[2] ?? "").trim()
    const result = await handleSlashCommand(command, args, userId)
    if (result) {
      const content = `## ${result.title}\n\n${result.content}`
      if (mode === "debate") {
        return { margdarshak: content, mentor: `## ${result.title} (Mentor's View)\n\n${result.content}`, command }
      }
      return { content, command }
    }
  }

  const [user, activities, stats, opportunities, teams] = await Promise.all([
    getUserById(userId).catch(() => null),
    getUserActivities(userId, 20).catch(() => []),
    getDashboardStats(userId, 0, 0).catch(() => ({ savedCount: 0, activeTeamCount: 0, wins: 0, profileViews: 0 })),
    getOpportunities({ limit: 10 }).catch(() => []),
    getTeams({ isOpen: true }).catch(() => []),
  ])

  const context = buildContextString(user, activities, stats, opportunities, teams)

  switch (mode) {
    case "mentor":
      return handleMentorMode(message, context)
    case "debate":
      return handleDebateMode(message, context)
    default:
      return handleDefaultMode(message, context)
  }
}

async function handleDefaultMode(message: string, context: string): Promise<SingleResponse> {
  const systemPrompt = buildDefaultSystemPrompt(context)
  const content = await callOpenRouter(systemPrompt, message)
  return { content }
}

async function handleMentorMode(message: string, context: string): Promise<SingleResponse> {
  const systemPrompt = buildMentorSystemPrompt(context)
  const content = await callGemini(systemPrompt, message)
  return { content }
}

async function handleDebateMode(message: string, context: string): Promise<DebateResponse> {
  const [margdarshakResult, mentorResult] = await Promise.all([
    callOpenRouter(buildDefaultSystemPrompt(context), message),
    callGemini(buildMentorSystemPrompt(context), message),
  ])
  return {
    margdarshak: margdarshakResult,
    mentor: mentorResult,
  }
}

function buildContextString(user: any, activities: any[], stats: any, opportunities: any[], teams: any[]): string {
  const sections: string[] = []

  if (user) {
    const badges = (user.badges ?? []).map((b: any) => b.label).join(", ") || "None"
    sections.push(`USER PROFILE:
Name: ${user.name ?? "N/A"}
College: ${user.college ?? "N/A"}
Degree: ${user.degree ?? "N/A"}
Year: ${user.year ?? "N/A"}
City: ${user.city ?? "N/A"}
Skills: ${(user.skills ?? []).join(", ") || "N/A"}
Interests: ${(user.interests ?? []).join(", ") || "N/A"}
Looking For: ${(user.lookingFor ?? []).join(", ") || "N/A"}
Bio: ${user.bio ?? "N/A"}
Wins: ${user.wins ?? 0}
Projects: ${user.projects ?? 0}
Availability: ${user.availability ?? "N/A"}
Badges: ${badges}`)
  }

  if (stats) {
    sections.push(`PLATFORM STATS:
Saved Opportunities: ${stats.savedCount ?? 0}
Active Teams: ${stats.activeTeamCount ?? 0}
Total Wins: ${stats.wins ?? 0}
Profile Views: ${stats.profileViews ?? 0}`)
  }

  if (activities && activities.length > 0) {
    const lines = activities.slice(0, 10).map((a: any) =>
      `[${new Date(a.createdAt).toLocaleDateString("en-IN")}] ${a.type?.replace(/_/g, " ") ?? "Event"}: ${a.description ?? ""}`)
    sections.push(`RECENT ACTIVITY (last ${lines.length}):\n${lines.join("\n")}`)
  }

  if (opportunities && opportunities.length > 0) {
    const lines = opportunities.slice(0, 5).map((o: any) =>
      `${o.title} — ${o.organizer} — ${o.type} — ${o.prize} — Deadline: ${new Date(o.deadline).toLocaleDateString("en-IN")} ${o.isRemote ? "[Remote]" : `[${o.location}]`}`)
    sections.push(`AVAILABLE OPPORTUNITIES:\n${lines.join("\n")}`)
  }

  if (teams && teams.length > 0) {
    const lines = teams.slice(0, 5).map((t: any) =>
      `${t.name} — ${t.opportunity} — ${t.city} — Roles needed: ${(t.rolesNeeded ?? []).join(", ") || "Any"}`)
    sections.push(`OPEN TEAMS:\n${lines.join("\n")}`)
  }

  return sections.join("\n\n")
}

function buildDefaultSystemPrompt(context: string): string {
  return `You are Margdarshak, an AI assistant for the Vijeta platform — a networking hub for Indian college students to find opportunities, form teams, and showcase projects.

You have access to the user's real data below. Use it to give personalized, specific answers. Be concise, friendly, and proactive.

CRITICAL RULES:
- Keep responses SHORT (3-5 sentences max). No long explanations.
- Use the user's actual name, skills, college, city from their profile when relevant
- Reference specific opportunities, teams, and activities from their data
- Suggest 1 actionable next step
- If the user asks something you cannot answer from their data, be honest but helpful
- DO NOT make up fake data — only use what's provided in the context below

AVAILABLE SLASH COMMANDS (tell user about these when relevant):
- /mystats — Show your platform statistics
- /recentactivity — Show your recent activity
- /findhackathon [query] — Find hackathons matching criteria
- /findteam [query] — Find open teams matching criteria
- /summarize [name] — Summarize chat with a person
- /suggest [topic] — Get project ideas in a domain
- /compare [a] vs [b] — Compare two opportunities

USER CONTEXT:
${context || "No specific user data available yet."}

Respond in a helpful, conversational tone. Use markdown for formatting.`
}

async function callOpenRouter(systemPrompt: string, userMessage: string): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY
  const model = process.env.OPENROUTER_MODEL || "openai/gpt-4o-mini"

  if (!apiKey) {
    return getFallbackResponse(userMessage)
  }

  try {
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://vijeta.app",
      },
      body: JSON.stringify({
        model,
        messages: [{ role: "system", content: systemPrompt }],
        max_tokens: 800,
        temperature: 0.7,
      }),
    })
    if (!res.ok) {
      console.error("OpenRouter API error:", res.status, await res.text())
      return getFallbackResponse(userMessage)
    }
    const data = await res.json()
    return data.choices?.[0]?.message?.content ?? getFallbackResponse(userMessage)
  } catch (err) {
    console.error("AI call failed:", err)
    return getFallbackResponse(userMessage)
  }
}

function getFallbackResponse(userMessage: string): string {
  const lower = userMessage.toLowerCase()
  if (lower.includes("hello") || lower.includes("hi") || lower.includes("namaste")) {
    return "Namaste! I'm Margdarshak, your AI guide. Try **slash commands** like `/findhackathon`, `/mystats`, or `/summarize` — or switch to **Mentor Mode** for detailed career guidance! What would you like to explore?"
  }
  if (lower.includes("help") || lower.includes("what can you")) {
    return "I can help in 3 modes:\n\n**Default Mode (current):** General AI assistant\n• `/findhackathon [query]` — Search hackathons\n• `/findteam [query]` — Search open teams\n• `/mystats` — Your platform stats\n• `/summarize [name]` — Chat summaries\n• `/suggest [topic]` — Project ideas\n• `/compare [a] vs [b]` — Compare opportunities\n\n**Mentor Mode (click top-left):** Career coach & competition guide\n**Debate Mode:** Both AIs respond — compare perspectives!"
  }
  return "I'm currently running in offline mode. Try a **slash command** like `/findhackathon`, `/mystats`, or `/summarize` — they work without AI! Or click the model selector above to try **Mentor Mode**."
}
