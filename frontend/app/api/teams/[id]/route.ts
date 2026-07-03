import { getOrCreateCurrentUser } from "@/backend/db/queries/users"
import { getTeamRowById, updateTeam } from "@/backend/db/queries/teams"

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getOrCreateCurrentUser()
  if (!user) return new Response("Unauthorized", { status: 401 })

  const { id } = await params
  const team = await getTeamRowById(id)
  if (!team) return new Response("Not found", { status: 404 })
  if (team.leaderId !== user.id) return new Response("Forbidden", { status: 403 })

  const body = await request.json()
  const updated = await updateTeam(id, {
    name: body.name,
    description: body.description,
    college: body.college,
    city: body.city,
    rolesNeeded: body.rolesNeeded,
    isOpen: body.isOpen,
  })

  return Response.json(updated)
}
