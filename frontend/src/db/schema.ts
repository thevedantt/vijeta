import { defineRelations } from "drizzle-orm"
import {
  boolean,
  decimal,
  index,
  integer,
  json,
  pgEnum,
  pgTable,
  primaryKey,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core"

export const opportunityTypeEnum = pgEnum("opportunity_type", [
  "Hackathon",
  "Scholarship",
  "Competition",
  "Fellowship",
  "Internship",
  "Research",
])

export const difficultyLevelEnum = pgEnum("difficulty_level", [
  "Beginner",
  "Intermediate",
  "Advanced",
])

export const availabilityEnum = pgEnum("availability", [
  "Full-time",
  "Part-time",
  "Weekends",
  "Not Available",
])

export const teamRoleEnum = pgEnum("team_role", [
  "Team Lead", "AI Engineer", "Backend", "Frontend", "Full Stack",
  "UI/UX", "Data Science", "Mobile Dev", "DevOps", "Research",
  "Hardware", "Content", "Presentation", "Documentation", "Blockchain",
  "Video", "3D Designer", "IoT", "AR/VR",
])

export const applicationStatusEnum = pgEnum("application_status", [
  "pending", "accepted", "rejected",
])

export const notificationTypeEnum = pgEnum("notification_type", [
  "team_invite", "application_received", "application_accepted",
  "application_rejected", "new_message", "deadline_reminder",
  "opportunity_match", "teammate_suggestion", "showcase_like",
])

export const activityTypeEnum = pgEnum("activity_type", [
  "saved_opportunity", "joined_team", "created_team", "applied_team",
  "submitted_project", "won_competition", "earned_badge", "updated_profile",
  "connected_mentor", "showcase_liked", "showcase_viewed",
])

/* ------------------------------------------------------------------ */
/*  USERS                                                              */
/* ------------------------------------------------------------------ */
export const users = pgTable("users", {
  id: text("id").primaryKey(),
  clerkId: text("clerk_id").unique().notNull(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  avatar: text("avatar").default(""),
  college: text("college").default(""),
  degree: text("degree").default(""),
  year: integer("year").default(1),
  city: text("city").default(""),
  bio: text("bio").default(""),
  lat: decimal("lat", { precision: 10, scale: 7 }),
  lng: decimal("lng", { precision: 10, scale: 7 }),
  github: text("github"),
  linkedin: text("linkedin"),
  portfolio: text("portfolio"),
  availability: availabilityEnum("availability").default("Not Available"),
  currentOpportunity: text("current_opportunity"),
  wins: integer("wins").default(0),
  projects: integer("projects").default(0),
  profileViews: integer("profile_views").default(0),
  preferences: json("preferences").$type<Record<string, boolean>>().default({}),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

/* ------------------------------------------------------------------ */
/*  TAGS                                                               */
/* ------------------------------------------------------------------ */
export const tags = pgTable("tags", {
  id: serial("id").primaryKey(),
  name: text("name").unique().notNull(),
  category: text("category").default("skill"),
})

/* ------------------------------------------------------------------ */
/*  USER-TAGS                                                          */
/* ------------------------------------------------------------------ */
export const userTags = pgTable(
  "user_tags",
  {
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    tagId: integer("tag_id")
      .notNull()
      .references(() => tags.id, { onDelete: "cascade" }),
    type: text("type").notNull().default("skill"),
  },
  (t) => [primaryKey({ columns: [t.userId, t.tagId, t.type] })],
)

/* ------------------------------------------------------------------ */
/*  OPPORTUNITIES                                                      */
/* ------------------------------------------------------------------ */
export const opportunities = pgTable("opportunities", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  organizer: text("organizer").notNull(),
  type: opportunityTypeEnum("type").notNull(),
  difficulty: difficultyLevelEnum("difficulty").notNull(),
  deadline: timestamp("deadline").notNull(),
  prize: text("prize").notNull(),
  teamSize: text("team_size").notNull(),
  description: text("description").notNull(),
  eligibility: json("eligibility").$type<string[]>().notNull().default([]),
  location: text("location").notNull(),
  isRemote: boolean("is_remote").default(false),
  applicants: integer("applicants").default(0),
  image: text("image"),
  lat: decimal("lat", { precision: 10, scale: 7 }),
  lng: decimal("lng", { precision: 10, scale: 7 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (t) => [
  index("opportunity_type_idx").on(t.type),
  index("opportunity_deadline_idx").on(t.deadline),
])

/* ------------------------------------------------------------------ */
/*  OPPORTUNITY-TAGS                                                   */
/* ------------------------------------------------------------------ */
export const opportunityTags = pgTable(
  "opportunity_tags",
  {
    opportunityId: text("opportunity_id")
      .notNull()
      .references(() => opportunities.id, { onDelete: "cascade" }),
    tagId: integer("tag_id")
      .notNull()
      .references(() => tags.id, { onDelete: "cascade" }),
  },
  (t) => [primaryKey({ columns: [t.opportunityId, t.tagId] })],
)

/* ------------------------------------------------------------------ */
/*  BOOKMARKS                                                          */
/* ------------------------------------------------------------------ */
export const bookmarks = pgTable(
  "bookmarks",
  {
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    opportunityId: text("opportunity_id")
      .notNull()
      .references(() => opportunities.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.opportunityId] })],
)

/* ------------------------------------------------------------------ */
/*  TEAMS                                                              */
/* ------------------------------------------------------------------ */
export const teams = pgTable("teams", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  opportunityId: text("opportunity_id").references(() => opportunities.id, {
    onDelete: "set null",
  }),
  leaderId: text("leader_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  description: text("description").notNull(),
  college: text("college").default(""),
  city: text("city").default(""),
  rolesNeeded: json("roles_needed").$type<string[]>().notNull().default([]),
  isOpen: boolean("is_open").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (t) => [index("team_open_idx").on(t.isOpen)])

/* ------------------------------------------------------------------ */
/*  TEAM MEMBERS                                                       */
/* ------------------------------------------------------------------ */
export const teamMembers = pgTable(
  "team_members",
  {
    teamId: text("team_id")
      .notNull()
      .references(() => teams.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    role: teamRoleEnum("role").notNull(),
    joinedAt: timestamp("joined_at").defaultNow().notNull(),
  },
  (t) => [primaryKey({ columns: [t.teamId, t.userId] })],
)

/* ------------------------------------------------------------------ */
/*  TEAM APPLICATIONS                                                  */
/* ------------------------------------------------------------------ */
export const teamApplications = pgTable("team_applications", {
  id: serial("id").primaryKey(),
  teamId: text("team_id")
    .notNull()
    .references(() => teams.id, { onDelete: "cascade" }),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  message: text("message").default(""),
  role: teamRoleEnum("role"),
  status: applicationStatusEnum("status").default("pending"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

/* ------------------------------------------------------------------ */
/*  TEAM-TAGS                                                          */
/* ------------------------------------------------------------------ */
export const teamTags = pgTable(
  "team_tags",
  {
    teamId: text("team_id")
      .notNull()
      .references(() => teams.id, { onDelete: "cascade" }),
    tagId: integer("tag_id")
      .notNull()
      .references(() => tags.id, { onDelete: "cascade" }),
  },
  (t) => [primaryKey({ columns: [t.teamId, t.tagId] })],
)

/* ------------------------------------------------------------------ */
/*  SHOWCASES                                                          */
/* ------------------------------------------------------------------ */
export const showcases = pgTable("showcases", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  team: text("team"),
  competition: text("competition").notNull(),
  rank: text("rank").notNull(),
  year: integer("year").notNull(),
  description: text("description").notNull(),
  techStack: json("tech_stack").$type<string[]>().notNull().default([]),
  members: json("members")
    .$type<{ name: string; avatar: string; role: string }[]>()
    .notNull()
    .default([]),
  image: text("image").notNull(),
  github: text("github"),
  demo: text("demo"),
  ppt: text("ppt"),
  views: integer("views").default(0),
  likes: integer("likes").default(0),
  college: text("college").default(""),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (t) => [index("showcase_year_idx").on(t.year)])

/* ------------------------------------------------------------------ */
/*  SHOWCASE LIKES                                                     */
/* ------------------------------------------------------------------ */
export const showcaseLikes = pgTable(
  "showcase_likes",
  {
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    showcaseId: text("showcase_id")
      .notNull()
      .references(() => showcases.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.showcaseId] })],
)

/* ------------------------------------------------------------------ */
/*  SHOWCASE-TAGS                                                      */
/* ------------------------------------------------------------------ */
export const showcaseTags = pgTable(
  "showcase_tags",
  {
    showcaseId: text("showcase_id")
      .notNull()
      .references(() => showcases.id, { onDelete: "cascade" }),
    tagId: integer("tag_id")
      .notNull()
      .references(() => tags.id, { onDelete: "cascade" }),
  },
  (t) => [primaryKey({ columns: [t.showcaseId, t.tagId] })],
)

/* ------------------------------------------------------------------ */
/*  ACTIVITIES                                                         */
/* ------------------------------------------------------------------ */
export const activities = pgTable("activities", {
  id: serial("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  type: activityTypeEnum("type").notNull(),
  description: text("description").notNull(),
  referenceId: text("reference_id"),
  referenceType: text("reference_type"),
  metadata: json("metadata").$type<Record<string, unknown>>().default({}),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

/* ------------------------------------------------------------------ */
/*  NOTIFICATIONS                                                      */
/* ------------------------------------------------------------------ */
export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  type: notificationTypeEnum("type").notNull(),
  title: text("title").notNull(),
  description: text("description").default(""),
  isRead: boolean("is_read").default(false),
  referenceId: text("reference_id"),
  referenceType: text("reference_type"),
  metadata: json("metadata").$type<Record<string, unknown>>().default({}),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (t) => [index("notification_unread_idx").on(t.userId, t.isRead)])

/* ------------------------------------------------------------------ */
/*  MENTORS                                                            */
/* ------------------------------------------------------------------ */
export const mentors = pgTable("mentors", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  avatar: text("avatar").default(""),
  role: text("role").notNull(),
  company: text("company").notNull(),
  expertise: json("expertise").$type<string[]>().notNull().default([]),
  bio: text("bio").notNull(),
  sessions: integer("sessions").default(0),
  rating: decimal("rating", { precision: 3, scale: 2 }).default("0"),
  college: text("college").default(""),
  wins: json("wins").$type<string[]>().notNull().default([]),
  available: boolean("available").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

/* ------------------------------------------------------------------ */
/*  RELATIONS (Drizzle 1.0.0-rc API)                                   */
/*  Access via: schema.users.relations.bookmarks                       */
/* ------------------------------------------------------------------ */
export const schema = defineRelations(
  {
    users,
    tags,
    userTags,
    opportunities,
    opportunityTags,
    bookmarks,
    teams,
    teamMembers,
    teamApplications,
    teamTags,
    showcases,
    showcaseLikes,
    showcaseTags,
    activities,
    notifications,
    mentors,
  },
  (h) => ({
    users: {
      bookmarks: h.many.bookmarks({ from: h.users.id, to: h.bookmarks.userId }),
      teamMembers: h.many.teamMembers({
        from: h.users.id,
        to: h.teamMembers.userId,
      }),
      teamApplications: h.many.teamApplications({
        from: h.users.id,
        to: h.teamApplications.userId,
      }),
      showcaseLikes: h.many.showcaseLikes({
        from: h.users.id,
        to: h.showcaseLikes.userId,
      }),
      activities: h.many.activities({ from: h.users.id, to: h.activities.userId }),
      notifications: h.many.notifications({
        from: h.users.id,
        to: h.notifications.userId,
      }),
      userTags: h.many.userTags({ from: h.users.id, to: h.userTags.userId }),
      ledTeams: h.many.teams({ from: h.users.id, to: h.teams.leaderId }),
    },
    tags: {
      users: h.many.userTags({ from: h.tags.id, to: h.userTags.tagId }),
      opportunities: h.many.opportunityTags({
        from: h.tags.id,
        to: h.opportunityTags.tagId,
      }),
      teams: h.many.teamTags({ from: h.tags.id, to: h.teamTags.tagId }),
      showcases: h.many.showcaseTags({
        from: h.tags.id,
        to: h.showcaseTags.tagId,
      }),
    },
    userTags: {
      user: h.one.users({ from: h.userTags.userId, to: h.users.id }),
      tag: h.one.tags({ from: h.userTags.tagId, to: h.tags.id }),
    },
    opportunities: {
      bookmarks: h.many.bookmarks({
        from: h.opportunities.id,
        to: h.bookmarks.opportunityId,
      }),
      teams: h.many.teams({
        from: h.opportunities.id,
        to: h.teams.opportunityId,
      }),
      tags: h.many.opportunityTags({
        from: h.opportunities.id,
        to: h.opportunityTags.opportunityId,
      }),
    },
    opportunityTags: {
      opportunity: h.one.opportunities({
        from: h.opportunityTags.opportunityId,
        to: h.opportunities.id,
      }),
      tag: h.one.tags({ from: h.opportunityTags.tagId, to: h.tags.id }),
    },
    bookmarks: {
      user: h.one.users({ from: h.bookmarks.userId, to: h.users.id }),
      opportunity: h.one.opportunities({
        from: h.bookmarks.opportunityId,
        to: h.opportunities.id,
      }),
    },
    teams: {
      opportunity: h.one.opportunities({
        from: h.teams.opportunityId,
        to: h.opportunities.id,
      }),
      leader: h.one.users({ from: h.teams.leaderId, to: h.users.id }),
      members: h.many.teamMembers({ from: h.teams.id, to: h.teamMembers.teamId }),
      applications: h.many.teamApplications({
        from: h.teams.id,
        to: h.teamApplications.teamId,
      }),
      tags: h.many.teamTags({ from: h.teams.id, to: h.teamTags.teamId }),
    },
    teamMembers: {
      team: h.one.teams({ from: h.teamMembers.teamId, to: h.teams.id }),
      user: h.one.users({ from: h.teamMembers.userId, to: h.users.id }),
    },
    teamApplications: {
      team: h.one.teams({ from: h.teamApplications.teamId, to: h.teams.id }),
      user: h.one.users({ from: h.teamApplications.userId, to: h.users.id }),
    },
    teamTags: {
      team: h.one.teams({ from: h.teamTags.teamId, to: h.teams.id }),
      tag: h.one.tags({ from: h.teamTags.tagId, to: h.tags.id }),
    },
    showcases: {
      likedBy: h.many.showcaseLikes({
        from: h.showcases.id,
        to: h.showcaseLikes.showcaseId,
      }),
      tags: h.many.showcaseTags({
        from: h.showcases.id,
        to: h.showcaseTags.showcaseId,
      }),
    },
    showcaseLikes: {
      user: h.one.users({ from: h.showcaseLikes.userId, to: h.users.id }),
      showcase: h.one.showcases({
        from: h.showcaseLikes.showcaseId,
        to: h.showcases.id,
      }),
    },
    showcaseTags: {
      showcase: h.one.showcases({
        from: h.showcaseTags.showcaseId,
        to: h.showcases.id,
      }),
      tag: h.one.tags({ from: h.showcaseTags.tagId, to: h.tags.id }),
    },
    activities: {
      user: h.one.users({ from: h.activities.userId, to: h.users.id }),
    },
    notifications: {
      user: h.one.users({ from: h.notifications.userId, to: h.users.id }),
    },
  }),
)
