import { getOpportunityById } from "@/backend/db/queries/opportunities"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  const opportunity = await getOpportunityById(id)
  if (!opportunity) return new Response("Not found", { status: 404 })
  return Response.json(opportunity)
}
