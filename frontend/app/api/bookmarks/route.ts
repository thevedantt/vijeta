import { getOrCreateCurrentUser } from "@/backend/db/queries/users"
import { getOpportunityById } from "@/backend/db/queries/opportunities"
import {
  getBookmarkedOpportunities,
  addBookmark,
  removeBookmark,
} from "@/backend/db/queries/bookmarks"
import { recordBookmark } from "@/backend/services/activity"

export async function GET() {
  const user = await getOrCreateCurrentUser()
  if (!user) return new Response("Unauthorized", { status: 401 })

  const opportunities = await getBookmarkedOpportunities(user.id)
  return Response.json(opportunities)
}

export async function POST(request: Request) {
  const user = await getOrCreateCurrentUser()
  if (!user) return new Response("Unauthorized", { status: 401 })

  const { opportunityId } = await request.json()
  const opportunity = await getOpportunityById(opportunityId)
  if (!opportunity) return new Response("Not found", { status: 404 })

  await addBookmark(user.id, opportunityId)
  await recordBookmark(user.id, opportunity.title, opportunityId)

  return Response.json({ ok: true })
}

export async function DELETE(request: Request) {
  const user = await getOrCreateCurrentUser()
  if (!user) return new Response("Unauthorized", { status: 401 })

  const { opportunityId } = await request.json()
  await removeBookmark(user.id, opportunityId)

  return Response.json({ ok: true })
}
