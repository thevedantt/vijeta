import { and, desc, eq, gt, ilike, inArray, or, sql } from "drizzle-orm"
import { db, opportunities, opportunityTags, tags, bookmarks } from "@/src/db"
import type { Opportunity } from "@/types"

type OpportunityRow = typeof opportunities.$inferSelect

async function attachTags(opportunityIds: string[]): Promise<Map<string, string[]>> {
  const map = new Map<string, string[]>()
  for (const id of opportunityIds) map.set(id, [])
  if (opportunityIds.length === 0) return map

  const rows = await db
    .select({ opportunityId: opportunityTags.opportunityId, name: tags.name })
    .from(opportunityTags)
    .innerJoin(tags, eq(opportunityTags.tagId, tags.id))
    .where(inArray(opportunityTags.opportunityId, opportunityIds))

  for (const row of rows) map.get(row.opportunityId)?.push(row.name)
  return map
}

function toOpportunity(row: OpportunityRow, tagList: string[]): Opportunity {
  return {
    id: row.id,
    title: row.title,
    organizer: row.organizer,
    type: row.type,
    difficulty: row.difficulty,
    deadline: row.deadline.toISOString(),
    prize: row.prize,
    teamSize: row.teamSize,
    tags: tagList,
    description: row.description,
    eligibility: row.eligibility,
    location: row.location,
    isRemote: row.isRemote ?? false,
    applicants: row.applicants ?? 0,
    image: row.image ?? undefined,
    lat: row.lat ? Number(row.lat) : undefined,
    lng: row.lng ? Number(row.lng) : undefined,
  }
}

export async function getOpportunities(
  opts: {
    type?: string
    difficulty?: string
    search?: string
    tags?: string[]
    isRemote?: boolean
    location?: string
    limit?: number
    ids?: string[]
    bookmarkedByUserId?: string
  } = {},
): Promise<Opportunity[]> {
  const conditions = []
  if (opts.ids) conditions.push(inArray(opportunities.id, opts.ids))
  if (opts.type) conditions.push(eq(opportunities.type, opts.type as OpportunityRow["type"]))
  if (opts.difficulty) {
    conditions.push(eq(opportunities.difficulty, opts.difficulty as OpportunityRow["difficulty"]))
  }
  if (opts.search) {
    conditions.push(
      or(
        ilike(opportunities.title, `%${opts.search}%`),
        ilike(opportunities.organizer, `%${opts.search}%`),
        ilike(opportunities.description, `%${opts.search}%`),
      ),
    )
  }
  if (opts.isRemote !== undefined) conditions.push(eq(opportunities.isRemote, opts.isRemote))
  if (opts.location) conditions.push(ilike(opportunities.location, `%${opts.location}%`))
  if (opts.tags?.length) {
    conditions.push(
      inArray(
        opportunities.id,
        db
          .select({ id: opportunityTags.opportunityId })
          .from(opportunityTags)
          .innerJoin(tags, eq(opportunityTags.tagId, tags.id))
          .where(inArray(tags.name, opts.tags)),
      ),
    )
  }

  let query = db
    .select()
    .from(opportunities)
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(desc(opportunities.createdAt))
    .$dynamic()

  if (opts.limit) query = query.limit(opts.limit)

  const rows = await query
  const tagMap = await attachTags(rows.map((r) => r.id))

  const bookmarkedIds = opts.bookmarkedByUserId
    ? new Set(
        (
          await db
            .select({ opportunityId: bookmarks.opportunityId })
            .from(bookmarks)
            .where(eq(bookmarks.userId, opts.bookmarkedByUserId))
        ).map((b) => b.opportunityId),
      )
    : null

  return rows.map((row) => ({
    ...toOpportunity(row, tagMap.get(row.id) ?? []),
    ...(bookmarkedIds ? { isBookmarked: bookmarkedIds.has(row.id) } : {}),
  }))
}

export async function getOpportunityById(id: string): Promise<Opportunity | null> {
  const [row] = await db.select().from(opportunities).where(eq(opportunities.id, id)).limit(1)
  if (!row) return null
  const tagMap = await attachTags([id])
  return toOpportunity(row, tagMap.get(id) ?? [])
}

export async function incrementApplicants(id: string): Promise<void> {
  await db
    .update(opportunities)
    .set({ applicants: sql`${opportunities.applicants} + 1` })
    .where(eq(opportunities.id, id))
}

export async function getUpcomingOpportunityDeadlines(limit = 5): Promise<Opportunity[]> {
  const rows = await db
    .select()
    .from(opportunities)
    .where(gt(opportunities.deadline, new Date()))
    .orderBy(opportunities.deadline)
    .limit(limit)
  const tagMap = await attachTags(rows.map((r) => r.id))
  return rows.map((row) => toOpportunity(row, tagMap.get(row.id) ?? []))
}
