import { getOrCreateCurrentUser } from "@/backend/db/queries/users"
import { processAIChat, type AIMode } from "@/backend/ai"

export async function POST(request: Request) {
  const user = await getOrCreateCurrentUser()
  if (!user) return new Response("Unauthorized", { status: 401 })

  let body: { message?: string; mode?: string }
  try {
    body = await request.json()
  } catch {
    return new Response("Invalid JSON body", { status: 400 })
  }

  const { message, mode } = body
  if (!message || typeof message !== "string" || !message.trim()) {
    return new Response("Message is required", { status: 400 })
  }

  const validModes: AIMode[] = ["default", "mentor", "debate"]
  const resolvedMode: AIMode = validModes.includes(mode as AIMode) ? (mode as AIMode) : "default"

  try {
    const result = await processAIChat({ message: message.trim(), userId: user.id, mode: resolvedMode })
    return Response.json(result)
  } catch (err) {
    console.error("AI chat error:", err)
    return Response.json(
      { error: "Failed to process message", details: err instanceof Error ? err.message : String(err) },
      { status: 500 },
    )
  }
}
