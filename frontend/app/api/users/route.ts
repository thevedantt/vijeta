import { type NextRequest } from "next/server"
import { getOrCreateCurrentUser, listUsers } from "@/backend/db/queries/users"

export async function GET(request: NextRequest) {
  const user = await getOrCreateCurrentUser()
  if (!user) return new Response("Unauthorized", { status: 401 })

  const params = request.nextUrl.searchParams
  const ids = params.get("ids")

  const users = await listUsers({
    ids: ids ? ids.split(",").filter(Boolean) : undefined,
    city: params.get("city") ?? undefined,
    search: params.get("search") ?? undefined,
  })

  return Response.json(users)
}
