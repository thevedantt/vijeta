import { getOrCreateCurrentUser, getUserById, updateUser } from "@/backend/db/queries/users"
import { notifyCollegeMatches } from "@/backend/services/activity"

export async function GET() {
  const user = await getOrCreateCurrentUser()
  if (!user) return new Response("Unauthorized", { status: 401 })

  const student = await getUserById(user.id)
  return Response.json(student)
}

export async function PATCH(request: Request) {
  const user = await getOrCreateCurrentUser()
  if (!user) return new Response("Unauthorized", { status: 401 })

  const body = await request.json()
  const collegeChanged =
    typeof body.college === "string" && body.college.trim() !== "" && body.college !== user.college

  const updated = await updateUser(user.id, {
    name: body.name,
    college: body.college,
    degree: body.degree,
    year: body.year,
    city: body.city,
    bio: body.bio,
    lat: body.lat,
    lng: body.lng,
    github: body.github,
    linkedin: body.linkedin,
    portfolio: body.portfolio,
    availability: body.availability,
    currentOpportunity: body.currentOpportunity,
    preferences: body.preferences,
  })

  if (collegeChanged) {
    await notifyCollegeMatches(updated)
  }

  const student = await getUserById(user.id)
  return Response.json(student)
}
