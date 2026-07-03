import { getOrCreateCurrentUser } from "@/backend/db/queries/users"
import { getShowcaseById, likeShowcase } from "@/backend/db/queries/showcases"
import { recordShowcaseLike } from "@/backend/services/activity"

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getOrCreateCurrentUser()
  if (!user) return new Response("Unauthorized", { status: 401 })

  const { id } = await params
  const showcase = await getShowcaseById(id)
  if (!showcase) return new Response("Not found", { status: 404 })

  const likes = await likeShowcase(user.id, id)
  await recordShowcaseLike(user.id, id, showcase.title)

  return Response.json({ likes })
}
