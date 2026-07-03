import { getOrCreateCurrentUser, getUserRowById } from "@/backend/db/queries/users"
import {
  getFriendsList,
  getPendingIncoming,
  getPendingOutgoing,
  createFriendRequest,
} from "@/backend/db/queries/friends"
import { notifyFriendRequest, notifyFriendAccepted } from "@/backend/services/activity"

export async function GET() {
  const user = await getOrCreateCurrentUser()
  if (!user) return new Response("Unauthorized", { status: 401 })

  const [friends, incoming, outgoing] = await Promise.all([
    getFriendsList(user.id),
    getPendingIncoming(user.id),
    getPendingOutgoing(user.id),
  ])

  return Response.json({ friends, incoming, outgoing })
}

export async function POST(request: Request) {
  const user = await getOrCreateCurrentUser()
  if (!user) return new Response("Unauthorized", { status: 401 })

  const { addresseeId } = await request.json()
  if (!addresseeId || addresseeId === user.id) {
    return new Response("Invalid addressee", { status: 400 })
  }

  const addressee = await getUserRowById(addresseeId)
  if (!addressee) return new Response("Not found", { status: 404 })

  const { friendship, autoAccepted } = await createFriendRequest(user.id, addresseeId)

  if (autoAccepted) {
    await notifyFriendAccepted(addresseeId, user)
  } else if (friendship.status === "pending" && friendship.requesterId === user.id) {
    await notifyFriendRequest(addresseeId, user)
  }

  return Response.json(friendship, { status: 201 })
}
