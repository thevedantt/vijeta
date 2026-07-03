import { type NextRequest } from "next/server"
import { getOrCreateCurrentUser } from "@/backend/db/queries/users"
import { getTeams, createTeam } from "@/backend/db/queries/teams"
import { insertActivity } from "@/backend/db/queries/activities"

export async function GET(request: NextRequest) {
  const user = await getOrCreateCurrentUser()
  if (!user) return new Response("Unauthorized", { status: 401 })

  const params = request.nextUrl.searchParams

  const teams = await getTeams({
    opportunityId: params.get("opportunityId") ?? undefined,
    isOpen: params.has("isOpen") ? params.get("isOpen") === "true" : undefined,
    college: params.get("college") ?? undefined,
    search: params.get("search") ?? undefined,
  })

  return Response.json(teams)
}

export async function POST(request: Request) {
  const user = await getOrCreateCurrentUser()
  if (!user) return new Response("Unauthorized", { status: 401 })

  const body = await request.json()
  const team = await createTeam({
    name: body.name,
    opportunityId: body.opportunityId,
    description: body.description,
    college: body.college,
    city: body.city,
    rolesNeeded: body.rolesNeeded,
    skills: body.skills,
    leaderId: user.id,
  })

  await insertActivity({
    userId: user.id,
    type: "created_team",
    description: `Created team "${team.name}"`,
    referenceId: team.id,
    referenceType: "team",
  })

  return Response.json(team, { status: 201 })
}
