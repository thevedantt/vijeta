import { getOrCreateCurrentUser } from "@/backend/db/queries/users"
import { getTeamRowById } from "@/backend/db/queries/teams"
import { createApplication } from "@/backend/db/queries/applications"
import { notifyTeamApplication } from "@/backend/services/activity"

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getOrCreateCurrentUser()
  if (!user) return new Response("Unauthorized", { status: 401 })

  const { id } = await params
  const team = await getTeamRowById(id)
  if (!team) return new Response("Not found", { status: 404 })

  const body = await request.json()
  const application = await createApplication({
    teamId: id,
    userId: user.id,
    message: body.message,
    role: body.role,
  })

  await notifyTeamApplication(team.leaderId, user, team)

  return Response.json({ id: application.id, status: application.status }, { status: 201 })
}
