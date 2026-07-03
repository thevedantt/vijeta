import { type NextRequest } from "next/server"
import { getShowcases } from "@/backend/db/queries/showcases"

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams
  const tags = params.get("tags")

  const showcases = await getShowcases({
    search: params.get("search") ?? undefined,
    year: params.has("year") ? Number(params.get("year")) : undefined,
    tags: tags ? tags.split(",").filter(Boolean) : undefined,
    college: params.get("college") ?? undefined,
  })

  return Response.json(showcases)
}
