import { insertActivity } from "@/backend/db/queries/activities"
import { insertNotification, hasNotification } from "@/backend/db/queries/notifications"
import { getUsersByCollege } from "@/backend/db/queries/friends"
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

export async function notifyFriendRequest(addresseeId: string, requester: UserRow) {
  await insertNotification({
    userId: addresseeId,
    type: "friend_request",
    title: `${requester.name} sent you a friend request`,
    description: requester.college ? `From ${requester.college}` : undefined,
    referenceId: requester.id,
    referenceType: "user",
  })
}

export async function notifyFriendAccepted(requesterId: string, accepter: UserRow) {
  await insertNotification({
    userId: requesterId,
    type: "friend_accepted",
    title: `${accepter.name} accepted your friend request`,
    referenceId: accepter.id,
    referenceType: "user",
  })
  await insertActivity({
    userId: requesterId,
    type: "added_friend",
    description: `Became friends with ${accepter.name}`,
    referenceId: accepter.id,
    referenceType: "user",
  })
  await insertActivity({
    userId: accepter.id,
    type: "added_friend",
    description: `Became friends with ${requesterId}`,
    referenceId: requesterId,
    referenceType: "user",
  })
}

/**
 * When a user sets/changes their college, let existing students at that same
 * college know someone new joined from their school — the entry point into
 * Team Up's "Find Members" tab where they can send a friend request.
 */
export async function notifyCollegeMatches(user: UserRow) {
  if (!user.college) return
  const matches = await getUsersByCollege(user.college, user.id)

  for (const match of matches) {
    const alreadyNotified = await hasNotification(match.id, "teammate_suggestion", user.id)
    if (alreadyNotified) continue

    await insertNotification({
      userId: match.id,
      type: "teammate_suggestion",
      title: `${user.name} joined Vijeta from ${user.college}`,
      description: "Say hello in Team Up → Find Members",
      referenceId: user.id,
      referenceType: "college_match",
    })
  }
}
