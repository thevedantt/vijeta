import { desc, eq } from "drizzle-orm"
import { db, activities } from "@/src/db"

type ActivityType = (typeof activities.$inferInsert)["type"]

export async function getUserActivities(userId: string, limit = 20) {
  return db
    .select()
    .from(activities)
    .where(eq(activities.userId, userId))
    .orderBy(desc(activities.createdAt))
    .limit(limit)
}

export async function insertActivity(data: {
  userId: string
  type: ActivityType
  description: string
  referenceId?: string
  referenceType?: string
  metadata?: Record<string, unknown>
}): Promise<void> {
  await db.insert(activities).values(data)
}
