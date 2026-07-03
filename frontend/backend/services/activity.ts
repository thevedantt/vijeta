import { insertActivity } from "@/backend/db/queries/activities"
import { insertNotification } from "@/backend/db/queries/notifications"
import type { getUserRowById } from "@/backend/db/queries/users"

type UserRow = NonNullable<Awaited<ReturnType<typeof getUserRowById>>>
type TeamRow = { id: string; name: string }

export async function recordBookmark(userId: string, opportunityTitle: string, opportunityId: string) {
  await insertActivity({
    userId,
    type: "saved_opportunity",
    description: `Saved "${opportunityTitle}"`,
    referenceId: opportunityId,
    referenceType: "opportunity",
  })
}

export async function notifyTeamApplication(
  leaderId: string,
  applicant: UserRow,
  team: TeamRow,
) {
  await insertNotification({
    userId: leaderId,
    type: "application_received",
    title: `${applicant.name} applied to join "${team.name}"`,
    referenceId: String(team.id),
    referenceType: "team",
  })
  await insertActivity({
    userId: applicant.id,
    type: "applied_team",
    description: `Applied to join "${team.name}"`,
    referenceId: team.id,
    referenceType: "team",
  })
}

export async function notifyApplicationDecision(
  applicantId: string,
  team: TeamRow,
  status: "accepted" | "rejected",
) {
  await insertNotification({
    userId: applicantId,
    type: status === "accepted" ? "application_accepted" : "application_rejected",
    title:
      status === "accepted"
        ? `You were accepted into "${team.name}"`
        : `Your application to "${team.name}" was declined`,
    referenceId: team.id,
    referenceType: "team",
  })
}

export async function recordTeamJoin(userId: string, team: TeamRow) {
  await insertActivity({
    userId,
    type: "joined_team",
    description: `Joined "${team.name}"`,
    referenceId: team.id,
    referenceType: "team",
  })
}

export async function recordShowcaseLike(userId: string, showcaseId: string, showcaseTitle: string) {
  await insertActivity({
    userId,
    type: "showcase_liked",
    description: `Liked "${showcaseTitle}"`,
    referenceId: showcaseId,
    referenceType: "showcase",
  })
}
