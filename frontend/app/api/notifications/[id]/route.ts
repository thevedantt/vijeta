import { getOrCreateCurrentUser } from "@/backend/db/queries/users"
import { markNotificationRead } from "@/backend/db/queries/notifications"

export async function PATCH(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getOrCreateCurrentUser()
  if (!user) return new Response("Unauthorized", { status: 401 })

  const { id } = await params
  const ok = await markNotificationRead(Number(id), user.id)
  if (!ok) return new Response("Not found", { status: 404 })

  return Response.json({ ok: true })
}
