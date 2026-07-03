import { getOrCreateCurrentUser } from "@/backend/db/queries/users"
import { getTeamRowById, addTeamMember } from "@/backend/db/queries/teams"
import { getApplicationById, updateApplicationStatus } from "@/backend/db/queries/applications"
import { notifyApplicationDecision, recordTeamJoin } from "@/backend/services/activity"

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string; appId: string }> },
) {
  const user = await getOrCreateCurrentUser()
  if (!user) return new Response("Unauthorized", { status: 401 })

  const { id, appId } = await params
  const team = await getTeamRowById(id)
  if (!team) return new Response("Not found", { status: 404 })
  if (team.leaderId !== user.id) return new Response("Forbidden", { status: 403 })

  const application = await getApplicationById(Number(appId))
  if (!application || application.teamId !== id) {
    return new Response("Not found", { status: 404 })
  }

  const body = await request.json()
  const status: "accepted" | "rejected" = body.status
  const updated = await updateApplicationStatus(application.id, status)

  if (status === "accepted") {
    await addTeamMember(id, application.userId, application.role ?? "Full Stack")
    await recordTeamJoin(application.userId, team)
  }
  await notifyApplicationDecision(application.userId, team, status)

  return Response.json(updated)
}
