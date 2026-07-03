import { and, desc, eq, ilike, inArray, or, sql } from "drizzle-orm"
import { db, showcases, showcaseTags, showcaseLikes, tags } from "@/src/db"
import type { Showcase } from "@/types"

type ShowcaseRow = typeof showcases.$inferSelect

async function attachTags(showcaseIds: string[]): Promise<Map<string, string[]>> {
  const map = new Map<string, string[]>()
  for (const id of showcaseIds) map.set(id, [])
  if (showcaseIds.length === 0) return map

  const rows = await db
    .select({ showcaseId: showcaseTags.showcaseId, name: tags.name })
    .from(showcaseTags)
    .innerJoin(tags, eq(showcaseTags.tagId, tags.id))
    .where(inArray(showcaseTags.showcaseId, showcaseIds))

  for (const row of rows) map.get(row.showcaseId)?.push(row.name)
  return map
}

function toShowcase(row: ShowcaseRow, tagList: string[]): Showcase {
  return {
    id: row.id,
    title: row.title,
    team: row.team ?? "",
    members: row.members,
    competition: row.competition,
    rank: row.rank,
    year: row.year,
    description: row.description,
    techStack: row.techStack,
    tags: tagList,
    github: row.github ?? undefined,
    demo: row.demo ?? undefined,
    ppt: row.ppt ?? undefined,
    image: row.image,
    views: row.views ?? 0,
    likes: row.likes ?? 0,
    college: row.college ?? "",
  }
}

export async function getShowcases(
  opts: { search?: string; year?: number; tags?: string[]; college?: string; limit?: number } = {},
): Promise<Showcase[]> {
  const conditions = []
  if (opts.year) conditions.push(eq(showcases.year, opts.year))
  if (opts.college) conditions.push(eq(showcases.college, opts.college))
  if (opts.search) {
    conditions.push(
      or(ilike(showcases.title, `%${opts.search}%`), ilike(showcases.description, `%${opts.search}%`)),
    )
  }
  if (opts.tags?.length) {
    conditions.push(
      inArray(
        showcases.id,
        db
          .select({ id: showcaseTags.showcaseId })
          .from(showcaseTags)
          .innerJoin(tags, eq(showcaseTags.tagId, tags.id))
          .where(inArray(tags.name, opts.tags)),
      ),
    )
  }

  let query = db
    .select()
    .from(showcases)
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(desc(showcases.createdAt))
    .$dynamic()

  if (opts.limit) query = query.limit(opts.limit)

  const rows = await query
  const tagMap = await attachTags(rows.map((r) => r.id))
  return rows.map((row) => toShowcase(row, tagMap.get(row.id) ?? []))
}

export async function getShowcaseById(id: string): Promise<Showcase | null> {
  const [row] = await db.select().from(showcases).where(eq(showcases.id, id)).limit(1)
  if (!row) return null
  const tagMap = await attachTags([id])
  return toShowcase(row, tagMap.get(id) ?? [])
}

export async function likeShowcase(userId: string, showcaseId: string): Promise<number> {
  const inserted = await db
    .insert(showcaseLikes)
    .values({ userId, showcaseId })
    .onConflictDoNothing()
    .returning()

  if (inserted.length > 0) {
    await db
      .update(showcases)
      .set({ likes: sql`${showcases.likes} + 1` })
      .where(eq(showcases.id, showcaseId))
  }

  const [row] = await db
    .select({ likes: showcases.likes })
    .from(showcases)
    .where(eq(showcases.id, showcaseId))
    .limit(1)
  return row?.likes ?? 0
}
