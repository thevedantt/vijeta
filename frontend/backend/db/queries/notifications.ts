import { and, desc, eq } from "drizzle-orm"
import { db, notifications } from "@/src/db"

type NotificationType = (typeof notifications.$inferInsert)["type"]

export async function getUserNotifications(userId: string, limit = 30) {
  return db
    .select()
    .from(notifications)
    .where(eq(notifications.userId, userId))
    .orderBy(desc(notifications.createdAt))
    .limit(limit)
}

export async function insertNotification(data: {
  userId: string
  type: NotificationType
  title: string
  description?: string
  referenceId?: string
  referenceType?: string
  metadata?: Record<string, unknown>
}): Promise<void> {
  await db.insert(notifications).values(data)
}

export async function markNotificationRead(id: number, userId: string): Promise<boolean> {
  const rows = await db
    .update(notifications)
    .set({ isRead: true })
    .where(and(eq(notifications.id, id), eq(notifications.userId, userId)))
    .returning()
  return rows.length > 0
}
