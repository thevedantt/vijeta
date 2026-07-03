import { getOrCreateCurrentUser, getUserById, incrementProfileViews } from "@/backend/db/queries/users"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const viewer = await getOrCreateCurrentUser()
  if (!viewer) return new Response("Unauthorized", { status: 401 })

  const { id } = await params
  const student = await getUserById(id)
  if (!student) return new Response("Not found", { status: 404 })

  if (viewer.id !== id) await incrementProfileViews(id)

  return Response.json(student)
}
