import { getOrCreateCurrentUser } from "@/backend/db/queries/users"
import { getDashboardStats, getUpcomingDeadlinesForUser } from "@/backend/db/queries/dashboard"
import { getTeams } from "@/backend/db/queries/teams"
import { getOpportunities } from "@/backend/db/queries/opportunities"
import { getUnreadCount } from "@/backend/db/queries/notifications"

export async function GET() {
  const user = await getOrCreateCurrentUser()
  if (!user) return new Response("Unauthorized", { status: 401 })

  const [stats, deadlines, activeTeams, recommended, unreadNotifications] = await Promise.all([
    getDashboardStats(user.id, user.wins ?? 0, user.profileViews ?? 0),
    getUpcomingDeadlinesForUser(user.id, 5),
    getTeams({ memberOrLeaderId: user.id }),
    getOpportunities({ limit: 3 }),
    getUnreadCount(user.id),
  ])

  return Response.json({
    stats,
    deadlines,
    activeTeams: activeTeams.slice(0, 2),
    recommended,
    unreadNotifications,
  })
}
