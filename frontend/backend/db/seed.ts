import { config } from "dotenv"
config({ path: ".env.local" })

import { students } from "@/lib/data/students"
import { opportunities as mockOpportunities } from "@/lib/data/opportunities"
import { teams as mockTeams } from "@/lib/data/teams"
import { showcases as mockShowcases } from "@/lib/data/showcases"
import { mentors as mockMentors } from "@/lib/data/mentors"

const TEAM_ROLE_MATCH_ORDER = [
  "3D Designer", "AI Engineer", "Data Science", "Mobile Dev", "Team Lead",
  "UI/UX", "AR/VR", "DevOps", "IoT", "Full Stack", "Backend", "Frontend",
  "Hardware", "Research", "Content", "Presentation", "Documentation",
  "Blockchain", "Video",
] as const

function resolveTeamRole(raw: string): (typeof TEAM_ROLE_MATCH_ORDER)[number] {
  const exact = TEAM_ROLE_MATCH_ORDER.find((v) => v === raw)
  if (exact) return exact
  const match = TEAM_ROLE_MATCH_ORDER.find((v) => raw.includes(v))
  if (match) return match
  console.warn(`[seed] no team_role match for "${raw}", defaulting to "Full Stack"`)
  return "Full Stack"
}

async function main() {
  // Dynamic import: @/src/db calls neon(process.env.DATABASE_URL!) at module
  // evaluation time, and ESM fully evaluates static imports before this
  // file's own body runs — so config() above would run too late for a
  // static import. Deferring via dynamic import() runs it after config().
  const {
    db,
    users,
    userTags,
    opportunities,
    opportunityTags,
    teams,
    teamMembers,
    teamTags,
    showcases,
    showcaseTags,
    mentors,
  } = await import("@/src/db")
  const { resolveTagIds } = await import("./queries/tags")

  async function insertUserTags(userId: string, tagIds: number[], type: string) {
    if (tagIds.length === 0) return
    await db
      .insert(userTags)
      .values(tagIds.map((tagId) => ({ userId, tagId, type })))
      .onConflictDoNothing()
  }

  async function seedUsers() {
    for (const s of students) {
      await db
        .insert(users)
        .values({
          id: s.id,
          clerkId: `seed_${s.id}`,
          name: s.name,
          email: `${s.id}@seed.vijeta.dev`,
          avatar: s.avatar,
          college: s.college,
          degree: s.degree,
          year: s.year,
          city: s.city,
          bio: s.bio,
          lat: s.lat.toString(),
          lng: s.lng.toString(),
          github: s.github,
          linkedin: s.linkedin,
          portfolio: s.portfolio,
          availability: s.availability as (typeof users.$inferInsert)["availability"],
          currentOpportunity: s.currentOpportunity,
          wins: s.wins,
          projects: s.projects,
        })
        .onConflictDoNothing({ target: users.id })

      const skillIds = await resolveTagIds(s.skills, "skill")
      const interestIds = await resolveTagIds(s.interests, "interest")
      const lookingForIds = await resolveTagIds(s.lookingFor, "looking_for")
      await insertUserTags(s.id, skillIds, "skill")
      await insertUserTags(s.id, interestIds, "interest")
      await insertUserTags(s.id, lookingForIds, "looking_for")
    }
    console.log(`Seeded ${students.length} users`)
  }

  async function seedOpportunities() {
    for (const o of mockOpportunities) {
      await db
        .insert(opportunities)
        .values({
          id: o.id,
          title: o.title,
          organizer: o.organizer,
          type: o.type,
          difficulty: o.difficulty,
          deadline: new Date(o.deadline),
          prize: o.prize,
          teamSize: o.teamSize,
          description: o.description,
          eligibility: o.eligibility,
          location: o.location,
          isRemote: o.isRemote,
          applicants: o.applicants,
          image: o.image,
          lat: o.lat?.toString(),
          lng: o.lng?.toString(),
        })
        .onConflictDoNothing({ target: opportunities.id })

      const tagIds = await resolveTagIds(o.tags, "skill")
      if (tagIds.length > 0) {
        await db
          .insert(opportunityTags)
          .values(tagIds.map((tagId) => ({ opportunityId: o.id, tagId })))
          .onConflictDoNothing()
      }
    }
    console.log(`Seeded ${mockOpportunities.length} opportunities`)
  }

  async function seedTeams() {
    let count = 0
    for (const t of mockTeams) {
      const leaderId = t.members.find((m) => m.name === t.leader)?.id ?? t.members[0]?.id
      if (!leaderId) {
        console.warn(`[seed] team "${t.name}" has no members, skipping`)
        continue
      }

      await db
        .insert(teams)
        .values({
          id: t.id,
          name: t.name,
          opportunityId: t.opportunityId,
          leaderId,
          description: t.description,
          college: t.college,
          city: t.city,
          rolesNeeded: t.rolesNeeded,
          isOpen: t.isOpen,
        })
        .onConflictDoNothing({ target: teams.id })
      count++

      for (const m of t.members) {
        await db
          .insert(teamMembers)
          .values({ teamId: t.id, userId: m.id, role: resolveTeamRole(m.role) })
          .onConflictDoNothing()
      }

      const tagIds = await resolveTagIds(t.skills, "skill")
      if (tagIds.length > 0) {
        await db
          .insert(teamTags)
          .values(tagIds.map((tagId) => ({ teamId: t.id, tagId })))
          .onConflictDoNothing()
      }
    }
    console.log(`Seeded ${count} teams`)
  }

  async function seedShowcases() {
    for (const s of mockShowcases) {
      await db
        .insert(showcases)
        .values({
          id: s.id,
          title: s.title,
          team: s.team,
          members: s.members,
          competition: s.competition,
          rank: s.rank,
          year: s.year,
          description: s.description,
          techStack: s.techStack,
          image: s.image,
          github: s.github,
          demo: s.demo,
          ppt: s.ppt,
          views: s.views,
          likes: s.likes,
          college: s.college,
        })
        .onConflictDoNothing({ target: showcases.id })

      const tagIds = await resolveTagIds(s.tags, "skill")
      if (tagIds.length > 0) {
        await db
          .insert(showcaseTags)
          .values(tagIds.map((tagId) => ({ showcaseId: s.id, tagId })))
          .onConflictDoNothing()
      }
    }
    console.log(`Seeded ${mockShowcases.length} showcases`)
  }

  async function seedMentors() {
    for (const m of mockMentors) {
      await db
        .insert(mentors)
        .values({
          id: m.id,
          name: m.name,
          avatar: m.avatar,
          role: m.role,
          company: m.company,
          expertise: m.expertise,
          bio: m.bio,
          sessions: m.sessions,
          rating: m.rating.toString(),
          college: m.college,
          wins: m.wins,
          available: m.available,
        })
        .onConflictDoNothing({ target: mentors.id })
    }
    console.log(`Seeded ${mockMentors.length} mentors`)
  }

  console.log("Seeding database...")
  await seedUsers()
  await seedOpportunities()
  await seedTeams()
  await seedShowcases()
  await seedMentors()
  console.log("Done.")
}

main()
  .catch((err) => {
    console.error("Seed failed:", err)
    process.exitCode = 1
  })
  .finally(() => process.exit())
