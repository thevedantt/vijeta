import { type NextRequest } from "next/server"
import { getOpportunities } from "@/backend/db/queries/opportunities"

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams
  const tags = params.get("tags")

  const opportunities = await getOpportunities({
    type: params.get("type") ?? undefined,
    difficulty: params.get("difficulty") ?? undefined,
    search: params.get("search") ?? undefined,
    tags: tags ? tags.split(",").filter(Boolean) : undefined,
    isRemote: params.has("remote") ? params.get("remote") === "true" : undefined,
    location: params.get("location") ?? undefined,
  })

  return Response.json(opportunities)
}
