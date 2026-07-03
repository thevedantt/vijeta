import { type NextRequest } from "next/server"
import { getOrCreateCurrentUser } from "@/backend/db/queries/users"
import { getUserActivities } from "@/backend/db/queries/activities"

export async function GET(request: NextRequest) {
  const user = await getOrCreateCurrentUser()
  if (!user) return new Response("Unauthorized", { status: 401 })

  const limit = request.nextUrl.searchParams.get("limit")
  const activities = await getUserActivities(user.id, limit ? Number(limit) : undefined)

  return Response.json(activities)
}
