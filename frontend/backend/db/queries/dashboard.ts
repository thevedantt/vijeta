import { and, count, eq, gt } from "drizzle-orm"
import { db, bookmarks, teamMembers, teams, opportunities } from "@/src/db"
import { getOpportunities, getUpcomingOpportunityDeadlines } from "./opportunities"
import type { Opportunity } from "@/types"

export async function getDashboardStats(userId: string, wins: number, profileViews: number) {
  const [{ savedCount }] = await db
    .select({ savedCount: count() })
    .from(bookmarks)
    .where(eq(bookmarks.userId, userId))

  const [{ activeTeamCount }] = await db
    .select({ activeTeamCount: count() })
    .from(teamMembers)
    .innerJoin(teams, eq(teamMembers.teamId, teams.id))
    .where(and(eq(teamMembers.userId, userId), eq(teams.isOpen, true)))

  return { savedCount, activeTeamCount, wins, profileViews }
}

export async function getUpcomingDeadlinesForUser(
  userId: string,
  limit = 5,
): Promise<Opportunity[]> {
  const rows = await db
    .select({ opportunityId: bookmarks.opportunityId })
    .from(bookmarks)
    .innerJoin(opportunities, eq(bookmarks.opportunityId, opportunities.id))
    .where(and(eq(bookmarks.userId, userId), gt(opportunities.deadline, new Date())))
    .orderBy(opportunities.deadline)
    .limit(limit)

  const ids = rows.map((r) => r.opportunityId)
  if (ids.length === 0) return getUpcomingOpportunityDeadlines(limit)

  const opps = await getOpportunities({ ids })
  const byId = new Map(opps.map((o) => [o.id, o]))
  return ids.map((id) => byId.get(id)).filter((o): o is Opportunity => !!o)
}
