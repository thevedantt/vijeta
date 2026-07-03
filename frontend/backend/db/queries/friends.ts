import { and, eq, ne, or } from "drizzle-orm"
import { db, friendships, users } from "@/src/db"
import type { Student } from "@/types"

type FriendshipRow = typeof friendships.$inferSelect

export type FriendStatus = "none" | "pending_outgoing" | "pending_incoming" | "friends"

async function getFriendshipBetween(
  userId1: string,
  userId2: string,
): Promise<FriendshipRow | null> {
  const [row] = await db
    .select()
    .from(friendships)
    .where(
      or(
        and(eq(friendships.requesterId, userId1), eq(friendships.addresseeId, userId2)),
        and(eq(friendships.requesterId, userId2), eq(friendships.addresseeId, userId1)),
      ),
    )
    .limit(1)
  return row ?? null
}

export async function getFriendStatus(meId: string, otherId: string): Promise<FriendStatus> {
  const row = await getFriendshipBetween(meId, otherId)
  if (!row || row.status === "rejected") return "none"
  if (row.status === "accepted") return "friends"
  return row.requesterId === meId ? "pending_outgoing" : "pending_incoming"
}

/**
 * Sends a friend request. If the other person already has a pending request
 * out to us, we accept theirs instead of creating a duplicate/competing row.
 */
export async function createFriendRequest(
  requesterId: string,
  addresseeId: string,
): Promise<{ friendship: FriendshipRow; autoAccepted: boolean }> {
  const existing = await getFriendshipBetween(requesterId, addresseeId)

  if (existing?.status === "accepted") {
    return { friendship: existing, autoAccepted: false }
  }

  if (existing?.status === "pending" && existing.requesterId === addresseeId) {
    const [accepted] = await db
      .update(friendships)
      .set({ status: "accepted", updatedAt: new Date() })
      .where(eq(friendships.id, existing.id))
      .returning()
    return { friendship: accepted, autoAccepted: true }
  }

  if (existing?.status === "pending") {
    return { friendship: existing, autoAccepted: false }
  }

  const [row] = await db
    .insert(friendships)
    .values({ requesterId, addresseeId, status: "pending" })
    .onConflictDoUpdate({
      target: [friendships.requesterId, friendships.addresseeId],
      set: { status: "pending", updatedAt: new Date() },
    })
    .returning()
  return { friendship: row, autoAccepted: false }
}

export async function getFriendshipById(id: number): Promise<FriendshipRow | null> {
  const [row] = await db.select().from(friendships).where(eq(friendships.id, id)).limit(1)
  return row ?? null
}

export async function respondToFriendRequest(
  id: number,
  status: "accepted" | "rejected",
): Promise<FriendshipRow | null> {
  const [row] = await db
    .update(friendships)
    .set({ status, updatedAt: new Date() })
    .where(eq(friendships.id, id))
    .returning()
  return row ?? null
}

async function toStudents(userIds: string[]): Promise<Student[]> {
  if (userIds.length === 0) return []
  const { listUsers } = await import("./users")
  return listUsers({ ids: userIds })
}

export async function getFriendsList(userId: string): Promise<Student[]> {
  const rows = await db
    .select()
    .from(friendships)
    .where(
      and(
        eq(friendships.status, "accepted"),
        or(eq(friendships.requesterId, userId), eq(friendships.addresseeId, userId)),
      ),
    )
  const otherIds = rows.map((r) => (r.requesterId === userId ? r.addresseeId : r.requesterId))
  return toStudents(otherIds)
}

export interface PendingRequest {
  id: number
  student: Student
  createdAt: Date
}

export async function getPendingIncoming(userId: string): Promise<PendingRequest[]> {
  const rows = await db
    .select()
    .from(friendships)
    .where(and(eq(friendships.addresseeId, userId), eq(friendships.status, "pending")))
  const students = await toStudents(rows.map((r) => r.requesterId))
  const byId = new Map(students.map((s) => [s.id, s]))
  return rows
    .map((r) => ({ id: r.id, student: byId.get(r.requesterId), createdAt: r.createdAt }))
    .filter((r): r is PendingRequest => !!r.student)
}

export async function getPendingOutgoing(userId: string): Promise<PendingRequest[]> {
  const rows = await db
    .select()
    .from(friendships)
    .where(and(eq(friendships.requesterId, userId), eq(friendships.status, "pending")))
  const students = await toStudents(rows.map((r) => r.addresseeId))
  const byId = new Map(students.map((s) => [s.id, s]))
  return rows
    .map((r) => ({ id: r.id, student: byId.get(r.addresseeId), createdAt: r.createdAt }))
    .filter((r): r is PendingRequest => !!r.student)
}

export async function getUsersByCollege(college: string, excludeUserId: string) {
  if (!college) return []
  return db
    .select()
    .from(users)
    .where(and(eq(users.college, college), ne(users.id, excludeUserId)))
}
