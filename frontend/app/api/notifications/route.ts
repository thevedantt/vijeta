import { type NextRequest } from "next/server"
import { getOrCreateCurrentUser } from "@/backend/db/queries/users"
import { getUserNotifications } from "@/backend/db/queries/notifications"

export async function GET(request: NextRequest) {
  const user = await getOrCreateCurrentUser()
  if (!user) return new Response("Unauthorized", { status: 401 })

  const limit = request.nextUrl.searchParams.get("limit")
  const notifications = await getUserNotifications(user.id, limit ? Number(limit) : undefined)

  return Response.json(notifications)
}
