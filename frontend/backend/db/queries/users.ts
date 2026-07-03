import { randomUUID } from "crypto"
import { and, eq, ilike, inArray, or, sql } from "drizzle-orm"
import { auth, currentUser } from "@clerk/nextjs/server"
import { db, users, userTags, tags } from "@/src/db"
import type { Student } from "@/types"

type UserRow = typeof users.$inferSelect
type TagGroups = { skill: string[]; interest: string[]; looking_for: string[] }

function deriveBadges(user: UserRow): Student["badges"] {
  const badges: Student["badges"] = []
  if ((user.wins ?? 0) >= 3) badges.push({ label: "Top Performer", color: "yellow" })
  else if ((user.wins ?? 0) >= 1) badges.push({ label: "Winner", color: "green" })
  if ((user.projects ?? 0) >= 5) badges.push({ label: "Builder", color: "blue" })
  if (user.availability === "Full-time") badges.push({ label: "Available", color: "green" })
  return badges
}

async function attachTags(userIds: string[]): Promise<Map<string, TagGroups>> {
  const map = new Map<string, TagGroups>()
  for (const id of userIds) map.set(id, { skill: [], interest: [], looking_for: [] })
  if (userIds.length === 0) return map

  const rows = await db
    .select({ userId: userTags.userId, type: userTags.type, name: tags.name })
    .from(userTags)
    .innerJoin(tags, eq(userTags.tagId, tags.id))
    .where(inArray(userTags.userId, userIds))

  for (const row of rows) {
    const entry = map.get(row.userId)
    if (!entry) continue
    if (row.type === "skill") entry.skill.push(row.name)
    else if (row.type === "interest") entry.interest.push(row.name)
    else if (row.type === "looking_for") entry.looking_for.push(row.name)
  }
  return map
}

function toStudent(user: UserRow, tagGroups?: TagGroups): Student {
  return {
    id: user.id,
    name: user.name,
    avatar: user.avatar ?? "",
    college: user.college ?? "",
    degree: user.degree ?? "",
    year: user.year ?? 1,
    city: user.city ?? "",
    skills: tagGroups?.skill ?? [],
    interests: tagGroups?.interest ?? [],
    lookingFor: tagGroups?.looking_for ?? [],
    bio: user.bio ?? "",
    wins: user.wins ?? 0,
    projects: user.projects ?? 0,
    badges: deriveBadges(user),
    lat: user.lat ? Number(user.lat) : 0,
    lng: user.lng ? Number(user.lng) : 0,
    github: user.github ?? undefined,
    linkedin: user.linkedin ?? undefined,
    portfolio: user.portfolio ?? undefined,
    currentOpportunity: user.currentOpportunity ?? undefined,
    availability: user.availability ?? undefined,
  }
}

export async function getUserByClerkId(clerkId: string): Promise<UserRow | null> {
  const [row] = await db.select().from(users).where(eq(users.clerkId, clerkId)).limit(1)
  return row ?? null
}

export async function getUserRowById(id: string): Promise<UserRow | null> {
  const [row] = await db.select().from(users).where(eq(users.id, id)).limit(1)
  return row ?? null
}

export async function getUserRowsByIds(ids: string[]): Promise<UserRow[]> {
  if (ids.length === 0) return []
  return db.select().from(users).where(inArray(users.id, ids))
}

export async function getUserById(id: string): Promise<Student | null> {
  const row = await getUserRowById(id)
  if (!row) return null
  const tagMap = await attachTags([id])
  return toStudent(row, tagMap.get(id))
}

export async function upsertUserFromClerk(data: {
  clerkId: string
  name: string
  email: string
  avatar?: string
}): Promise<UserRow> {
  const [row] = await db
    .insert(users)
    .values({
      id: randomUUID(),
      clerkId: data.clerkId,
      name: data.name,
      email: data.email,
      avatar: data.avatar ?? "",
    })
    .onConflictDoUpdate({
      target: users.clerkId,
      set: {
        name: data.name,
        email: data.email,
        avatar: data.avatar ?? "",
        updatedAt: new Date(),
      },
    })
    .returning()
  return row
}

export async function getOrCreateCurrentUser(): Promise<UserRow | null> {
  const { userId: clerkId } = await auth()
  if (!clerkId) return null

  const existing = await getUserByClerkId(clerkId)
  if (existing) return existing

  const clerkUser = await currentUser()
  if (!clerkUser) return null

  const name =
    [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ") ||
    clerkUser.username ||
    "New User"
  const email = clerkUser.emailAddresses[0]?.emailAddress ?? ""

  return upsertUserFromClerk({ clerkId, name, email, avatar: clerkUser.imageUrl })
}

export async function updateUser(
  id: string,
  patch: Partial<{
    name: string
    college: string
    degree: string
    year: number
    city: string
    bio: string
    lat: number
    lng: number
    github: string
    linkedin: string
    portfolio: string
    availability: "Full-time" | "Part-time" | "Weekends" | "Not Available"
    currentOpportunity: string
    preferences: Record<string, boolean>
  }>,
): Promise<UserRow> {
  const { lat, lng, ...rest } = patch
  const [row] = await db
    .update(users)
    .set({
      ...rest,
      ...(lat !== undefined ? { lat: lat.toString() } : {}),
      ...(lng !== undefined ? { lng: lng.toString() } : {}),
      updatedAt: new Date(),
    })
    .where(eq(users.id, id))
    .returning()
  return row
}

export async function incrementProfileViews(id: string): Promise<void> {
  await db
    .update(users)
    .set({ profileViews: sql`${users.profileViews} + 1` })
    .where(eq(users.id, id))
}

export async function listUsers(
  opts: { ids?: string[]; city?: string; search?: string } = {},
): Promise<Student[]> {
  const conditions = []
  if (opts.ids?.length) conditions.push(inArray(users.id, opts.ids))
  if (opts.city) conditions.push(eq(users.city, opts.city))
  if (opts.search) {
    conditions.push(
      or(ilike(users.name, `%${opts.search}%`), ilike(users.college, `%${opts.search}%`)),
    )
  }

  const rows =
    conditions.length > 0
      ? await db.select().from(users).where(and(...conditions))
      : await db.select().from(users)

  const tagMap = await attachTags(rows.map((r) => r.id))
  return rows.map((r) => toStudent(r, tagMap.get(r.id)))
}

export async function getNearbyStudents(user: UserRow, limit = 10): Promise<Student[]> {
  const rows = await db
    .select()
    .from(users)
    .where(and(eq(users.city, user.city ?? ""), sql`${users.id} != ${user.id}`))
    .limit(limit)
  const tagMap = await attachTags(rows.map((r) => r.id))
  return rows.map((r) => toStudent(r, tagMap.get(r.id)))
}
