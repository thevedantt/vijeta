import { getOrCreateCurrentUser } from "@/backend/db/queries/users"
import { getFriendshipById, respondToFriendRequest } from "@/backend/db/queries/friends"
import { notifyFriendAccepted } from "@/backend/services/activity"

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getOrCreateCurrentUser()
  if (!user) return new Response("Unauthorized", { status: 401 })

  const { id } = await params
  const friendship = await getFriendshipById(Number(id))
  if (!friendship) return new Response("Not found", { status: 404 })
  if (friendship.addresseeId !== user.id) return new Response("Forbidden", { status: 403 })
  if (friendship.status !== "pending") return new Response("Already resolved", { status: 409 })

  const { action } = await request.json()
  if (action !== "accept" && action !== "reject") {
    return new Response("Invalid action", { status: 400 })
  }

  const updated = await respondToFriendRequest(friendship.id, action === "accept" ? "accepted" : "rejected")

  if (action === "accept") {
    await notifyFriendAccepted(friendship.requesterId, user)
  }

  return Response.json(updated)
}
