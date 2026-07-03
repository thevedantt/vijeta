import { randomUUID } from "crypto"
import { and, desc, eq, ilike, inArray, or } from "drizzle-orm"
import {
  db,
  teams,
  teamMembers,
  teamTags,
  tags,
  users,
  opportunities,
} from "@/src/db"
import { resolveTagIds } from "./tags"
import type { Team, TeamMember } from "@/types"

type TeamRow = typeof teams.$inferSelect

async function attachTeamData(teamIds: string[]) {
  const tagMap = new Map<string, string[]>()
  const memberMap = new Map<string, TeamMember[]>()
  for (const id of teamIds) {
    tagMap.set(id, [])
    memberMap.set(id, [])
  }
  if (teamIds.length === 0) return { tagMap, memberMap }

  const tagRows = await db
    .select({ teamId: teamTags.teamId, name: tags.name })
    .from(teamTags)
    .innerJoin(tags, eq(teamTags.tagId, tags.id))
    .where(inArray(teamTags.teamId, teamIds))
  for (const row of tagRows) tagMap.get(row.teamId)?.push(row.name)

  const memberRows = await db
    .select({
      teamId: teamMembers.teamId,
      role: teamMembers.role,
      userId: users.id,
      name: users.name,
      avatar: users.avatar,
    })
    .from(teamMembers)
    .innerJoin(users, eq(teamMembers.userId, users.id))
    .where(inArray(teamMembers.teamId, teamIds))
  for (const row of memberRows) {
    memberMap.get(row.teamId)?.push({
      id: row.userId,
      name: row.name,
      avatar: row.avatar ?? "",
      role: row.role,
    })
  }

  return { tagMap, memberMap }
}

async function toTeam(
  row: TeamRow,
  tagList: string[],
  members: TeamMember[],
): Promise<Team> {
  const [leader] = await db.select().from(users).where(eq(users.id, row.leaderId)).limit(1)
  let opportunityTitle = ""
  if (row.opportunityId) {
    const [opp] = await db
      .select({ title: opportunities.title })
      .from(opportunities)
      .where(eq(opportunities.id, row.opportunityId))
      .limit(1)
    opportunityTitle = opp?.title ?? ""
  }
  return {
    id: row.id,
    name: row.name,
    opportunity: opportunityTitle,
    opportunityId: row.opportunityId ?? "",
    leader: leader?.name ?? "",
    leaderAvatar: leader?.avatar ?? "",
    members,
    rolesNeeded: row.rolesNeeded,
    description: row.description,
    skills: tagList,
    college: row.college ?? "",
    city: row.city ?? "",
    createdAt: row.createdAt.toISOString(),
    isOpen: row.isOpen ?? true,
  }
}

export async function getTeams(
  opts: {
    opportunityId?: string
    isOpen?: boolean
    college?: string
    search?: string
    memberOrLeaderId?: string
  } = {},
): Promise<Team[]> {
  const conditions = []
  if (opts.opportunityId) conditions.push(eq(teams.opportunityId, opts.opportunityId))
  if (opts.isOpen !== undefined) conditions.push(eq(teams.isOpen, opts.isOpen))
  if (opts.college) conditions.push(eq(teams.college, opts.college))
  if (opts.search) {
    conditions.push(
      or(ilike(teams.name, `%${opts.search}%`), ilike(teams.description, `%${opts.search}%`)),
    )
  }
  if (opts.memberOrLeaderId) {
    conditions.push(
      or(
        eq(teams.leaderId, opts.memberOrLeaderId),
        inArray(
          teams.id,
          db
            .select({ teamId: teamMembers.teamId })
            .from(teamMembers)
            .where(eq(teamMembers.userId, opts.memberOrLeaderId)),
        ),
      ),
    )
  }

  const rows = await db
    .select()
    .from(teams)
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(desc(teams.createdAt))

  const { tagMap, memberMap } = await attachTeamData(rows.map((r) => r.id))
  return Promise.all(
    rows.map((row) => toTeam(row, tagMap.get(row.id) ?? [], memberMap.get(row.id) ?? [])),
  )
}

export async function getTeamById(id: string): Promise<Team | null> {
  const [row] = await db.select().from(teams).where(eq(teams.id, id)).limit(1)
  if (!row) return null
  const { tagMap, memberMap } = await attachTeamData([id])
  return toTeam(row, tagMap.get(id) ?? [], memberMap.get(id) ?? [])
}

export async function getTeamRowById(id: string): Promise<TeamRow | null> {
  const [row] = await db.select().from(teams).where(eq(teams.id, id)).limit(1)
  return row ?? null
}

export async function createTeam(data: {
  name: string
  opportunityId?: string
  description: string
  college?: string
  city?: string
  rolesNeeded?: string[]
  skills?: string[]
  leaderId: string
}): Promise<Team> {
  const id = randomUUID()
  const [row] = await db
    .insert(teams)
    .values({
      id,
      name: data.name,
      opportunityId: data.opportunityId,
      leaderId: data.leaderId,
      description: data.description,
      college: data.college ?? "",
      city: data.city ?? "",
      rolesNeeded: data.rolesNeeded ?? [],
    })
    .returning()

  await addTeamMember(id, data.leaderId, "Team Lead")

  if (data.skills?.length) {
    const tagIds = await resolveTagIds(data.skills, "skill")
    if (tagIds.length) {
      await db
        .insert(teamTags)
        .values(tagIds.map((tagId) => ({ teamId: id, tagId })))
        .onConflictDoNothing()
    }
  }

  const { tagMap, memberMap } = await attachTeamData([id])
  return toTeam(row, tagMap.get(id) ?? [], memberMap.get(id) ?? [])
}

export async function updateTeam(
  id: string,
  patch: Partial<{
    name: string
    description: string
    college: string
    city: string
    rolesNeeded: string[]
    isOpen: boolean
  }>,
): Promise<Team | null> {
  const [row] = await db
    .update(teams)
    .set({ ...patch, updatedAt: new Date() })
    .where(eq(teams.id, id))
    .returning()
  if (!row) return null
  const { tagMap, memberMap } = await attachTeamData([id])
  return toTeam(row, tagMap.get(id) ?? [], memberMap.get(id) ?? [])
}

export async function addTeamMember(
  teamId: string,
  userId: string,
  role: string,
): Promise<void> {
  await db
    .insert(teamMembers)
    .values({ teamId, userId, role: role as (typeof teamMembers.$inferInsert)["role"] })
    .onConflictDoNothing()
}
