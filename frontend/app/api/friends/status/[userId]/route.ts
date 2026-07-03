import { getOrCreateCurrentUser } from "@/backend/db/queries/users"
import { getFriendStatus } from "@/backend/db/queries/friends"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ userId: string }> },
) {
  const user = await getOrCreateCurrentUser()
  if (!user) return new Response("Unauthorized", { status: 401 })

  const { userId } = await params
  const status = await getFriendStatus(user.id, userId)

  return Response.json({ status })
}
