import { and, desc, eq } from "drizzle-orm"
import { db, bookmarks } from "@/src/db"
import { getOpportunities } from "./opportunities"
import type { Opportunity } from "@/types"

export async function getBookmarkedOpportunities(userId: string): Promise<Opportunity[]> {
  const rows = await db
    .select({ opportunityId: bookmarks.opportunityId })
    .from(bookmarks)
    .where(eq(bookmarks.userId, userId))
    .orderBy(desc(bookmarks.createdAt))

  const ids = rows.map((r) => r.opportunityId)
  if (ids.length === 0) return []
  return getOpportunities({ ids, bookmarkedByUserId: userId })
}

export async function isBookmarked(userId: string, opportunityId: string): Promise<boolean> {
  const [row] = await db
    .select()
    .from(bookmarks)
    .where(and(eq(bookmarks.userId, userId), eq(bookmarks.opportunityId, opportunityId)))
    .limit(1)
  return !!row
}

export async function addBookmark(userId: string, opportunityId: string): Promise<void> {
  await db.insert(bookmarks).values({ userId, opportunityId }).onConflictDoNothing()
}

export async function removeBookmark(userId: string, opportunityId: string): Promise<void> {
  await db
    .delete(bookmarks)
    .where(and(eq(bookmarks.userId, userId), eq(bookmarks.opportunityId, opportunityId)))
}

export async function countBookmarks(userId: string): Promise<number> {
  const rows = await db.select().from(bookmarks).where(eq(bookmarks.userId, userId))
  return rows.length
}
