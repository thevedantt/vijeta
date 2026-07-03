import { eq } from "drizzle-orm"
import { db, teamApplications } from "@/src/db"

type ApplicationRow = typeof teamApplications.$inferSelect

export async function createApplication(data: {
  teamId: string
  userId: string
  message?: string
  role?: string
}): Promise<ApplicationRow> {
  const [row] = await db
    .insert(teamApplications)
    .values({
      teamId: data.teamId,
      userId: data.userId,
      message: data.message ?? "",
      role: data.role as ApplicationRow["role"],
    })
    .returning()
  return row
}

export async function getApplicationById(id: number): Promise<ApplicationRow | null> {
  const [row] = await db
    .select()
    .from(teamApplications)
    .where(eq(teamApplications.id, id))
    .limit(1)
  return row ?? null
}

export async function updateApplicationStatus(
  id: number,
  status: "accepted" | "rejected",
): Promise<ApplicationRow | null> {
  const [row] = await db
    .update(teamApplications)
    .set({ status, updatedAt: new Date() })
    .where(eq(teamApplications.id, id))
    .returning()
  return row ?? null
}
