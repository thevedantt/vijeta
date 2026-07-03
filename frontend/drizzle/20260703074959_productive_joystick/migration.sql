CREATE TYPE "activity_type" AS ENUM('saved_opportunity', 'joined_team', 'created_team', 'applied_team', 'submitted_project', 'won_competition', 'earned_badge', 'updated_profile', 'connected_mentor', 'showcase_liked', 'showcase_viewed');--> statement-breakpoint
CREATE TYPE "application_status" AS ENUM('pending', 'accepted', 'rejected');--> statement-breakpoint
CREATE TYPE "availability" AS ENUM('Full-time', 'Part-time', 'Weekends', 'Not Available');--> statement-breakpoint
CREATE TYPE "difficulty_level" AS ENUM('Beginner', 'Intermediate', 'Advanced');--> statement-breakpoint
CREATE TYPE "notification_type" AS ENUM('team_invite', 'application_received', 'application_accepted', 'application_rejected', 'new_message', 'deadline_reminder', 'opportunity_match', 'teammate_suggestion', 'showcase_like');--> statement-breakpoint
CREATE TYPE "opportunity_type" AS ENUM('Hackathon', 'Scholarship', 'Competition', 'Fellowship', 'Internship', 'Research');--> statement-breakpoint
CREATE TYPE "team_role" AS ENUM('Team Lead', 'AI Engineer', 'Backend', 'Frontend', 'Full Stack', 'UI/UX', 'Data Science', 'Mobile Dev', 'DevOps', 'Research', 'Hardware', 'Content', 'Presentation', 'Documentation', 'Blockchain', 'Video', '3D Designer', 'IoT', 'AR/VR');--> statement-breakpoint
CREATE TABLE "activities" (
	"id" serial PRIMARY KEY,
	"user_id" text NOT NULL,
	"type" "activity_type" NOT NULL,
	"description" text NOT NULL,
	"reference_id" text,
	"reference_type" text,
	"metadata" json DEFAULT '{}',
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "bookmarks" (
	"user_id" text,
	"opportunity_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "bookmarks_pkey" PRIMARY KEY("user_id","opportunity_id")
);
--> statement-breakpoint
CREATE TABLE "conversation_participants" (
	"conversation_id" text,
	"user_id" text,
	"last_read_at" timestamp DEFAULT now(),
	"joined_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "conversation_participants_pkey" PRIMARY KEY("conversation_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "conversations" (
	"id" text PRIMARY KEY,
	"name" text,
	"is_group" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "mentors" (
	"id" text PRIMARY KEY,
	"name" text NOT NULL,
	"avatar" text DEFAULT '',
	"role" text NOT NULL,
	"company" text NOT NULL,
	"expertise" json DEFAULT '[]' NOT NULL,
	"bio" text NOT NULL,
	"sessions" integer DEFAULT 0,
	"rating" numeric(3,2) DEFAULT '0',
	"college" text DEFAULT '',
	"wins" json DEFAULT '[]' NOT NULL,
	"available" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "messages" (
	"id" text PRIMARY KEY,
	"conversation_id" text NOT NULL,
	"sender_id" text NOT NULL,
	"content" text NOT NULL,
	"is_read" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" serial PRIMARY KEY,
	"user_id" text NOT NULL,
	"type" "notification_type" NOT NULL,
	"title" text NOT NULL,
	"description" text DEFAULT '',
	"is_read" boolean DEFAULT false,
	"reference_id" text,
	"reference_type" text,
	"metadata" json DEFAULT '{}',
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "opportunities" (
	"id" text PRIMARY KEY,
	"title" text NOT NULL,
	"organizer" text NOT NULL,
	"type" "opportunity_type" NOT NULL,
	"difficulty" "difficulty_level" NOT NULL,
	"deadline" timestamp NOT NULL,
	"prize" text NOT NULL,
	"team_size" text NOT NULL,
	"description" text NOT NULL,
	"eligibility" json DEFAULT '[]' NOT NULL,
	"location" text NOT NULL,
	"is_remote" boolean DEFAULT false,
	"applicants" integer DEFAULT 0,
	"image" text,
	"lat" numeric(10,7),
	"lng" numeric(10,7),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "opportunity_tags" (
	"opportunity_id" text,
	"tag_id" integer,
	CONSTRAINT "opportunity_tags_pkey" PRIMARY KEY("opportunity_id","tag_id")
);
--> statement-breakpoint
CREATE TABLE "showcase_likes" (
	"user_id" text,
	"showcase_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "showcase_likes_pkey" PRIMARY KEY("user_id","showcase_id")
);
--> statement-breakpoint
CREATE TABLE "showcase_tags" (
	"showcase_id" text,
	"tag_id" integer,
	CONSTRAINT "showcase_tags_pkey" PRIMARY KEY("showcase_id","tag_id")
);
--> statement-breakpoint
CREATE TABLE "showcases" (
	"id" text PRIMARY KEY,
	"title" text NOT NULL,
	"team" text,
	"competition" text NOT NULL,
	"rank" text NOT NULL,
	"year" integer NOT NULL,
	"description" text NOT NULL,
	"tech_stack" json DEFAULT '[]' NOT NULL,
	"image" text NOT NULL,
	"github" text,
	"demo" text,
	"ppt" text,
	"views" integer DEFAULT 0,
	"likes" integer DEFAULT 0,
	"college" text DEFAULT '',
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tags" (
	"id" serial PRIMARY KEY,
	"name" text NOT NULL UNIQUE,
	"category" text DEFAULT 'skill'
);
--> statement-breakpoint
CREATE TABLE "team_applications" (
	"id" serial PRIMARY KEY,
	"team_id" text NOT NULL,
	"user_id" text NOT NULL,
	"message" text DEFAULT '',
	"role" "team_role",
	"status" "application_status" DEFAULT 'pending'::"application_status",
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "team_members" (
	"team_id" text,
	"user_id" text,
	"role" "team_role" NOT NULL,
	"joined_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "team_members_pkey" PRIMARY KEY("team_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "team_tags" (
	"team_id" text,
	"tag_id" integer,
	CONSTRAINT "team_tags_pkey" PRIMARY KEY("team_id","tag_id")
);
--> statement-breakpoint
CREATE TABLE "teams" (
	"id" text PRIMARY KEY,
	"name" text NOT NULL,
	"opportunity_id" text,
	"leader_id" text NOT NULL,
	"description" text NOT NULL,
	"college" text DEFAULT '',
	"city" text DEFAULT '',
	"roles_needed" json DEFAULT '[]' NOT NULL,
	"is_open" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_tags" (
	"user_id" text,
	"tag_id" integer,
	"type" text DEFAULT 'skill',
	CONSTRAINT "user_tags_pkey" PRIMARY KEY("user_id","tag_id","type")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY,
	"clerk_id" text NOT NULL UNIQUE,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"avatar" text DEFAULT '',
	"college" text DEFAULT '',
	"degree" text DEFAULT '',
	"year" integer DEFAULT 1,
	"city" text DEFAULT '',
	"bio" text DEFAULT '',
	"lat" numeric(10,7),
	"lng" numeric(10,7),
	"github" text,
	"linkedin" text,
	"portfolio" text,
	"availability" "availability" DEFAULT 'Not Available'::"availability",
	"current_opportunity" text,
	"wins" integer DEFAULT 0,
	"projects" integer DEFAULT 0,
	"profile_views" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "activities" ADD CONSTRAINT "activities_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "bookmarks" ADD CONSTRAINT "bookmarks_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "bookmarks" ADD CONSTRAINT "bookmarks_opportunity_id_opportunities_id_fkey" FOREIGN KEY ("opportunity_id") REFERENCES "opportunities"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "conversation_participants" ADD CONSTRAINT "conversation_participants_conversation_id_conversations_id_fkey" FOREIGN KEY ("conversation_id") REFERENCES "conversations"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "conversation_participants" ADD CONSTRAINT "conversation_participants_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_conversation_id_conversations_id_fkey" FOREIGN KEY ("conversation_id") REFERENCES "conversations"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_sender_id_users_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "opportunity_tags" ADD CONSTRAINT "opportunity_tags_opportunity_id_opportunities_id_fkey" FOREIGN KEY ("opportunity_id") REFERENCES "opportunities"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "opportunity_tags" ADD CONSTRAINT "opportunity_tags_tag_id_tags_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "tags"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "showcase_likes" ADD CONSTRAINT "showcase_likes_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "showcase_likes" ADD CONSTRAINT "showcase_likes_showcase_id_showcases_id_fkey" FOREIGN KEY ("showcase_id") REFERENCES "showcases"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "showcase_tags" ADD CONSTRAINT "showcase_tags_showcase_id_showcases_id_fkey" FOREIGN KEY ("showcase_id") REFERENCES "showcases"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "showcase_tags" ADD CONSTRAINT "showcase_tags_tag_id_tags_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "tags"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "team_applications" ADD CONSTRAINT "team_applications_team_id_teams_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "team_applications" ADD CONSTRAINT "team_applications_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "team_members" ADD CONSTRAINT "team_members_team_id_teams_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "team_members" ADD CONSTRAINT "team_members_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "team_tags" ADD CONSTRAINT "team_tags_team_id_teams_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "team_tags" ADD CONSTRAINT "team_tags_tag_id_tags_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "tags"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "teams" ADD CONSTRAINT "teams_opportunity_id_opportunities_id_fkey" FOREIGN KEY ("opportunity_id") REFERENCES "opportunities"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "teams" ADD CONSTRAINT "teams_leader_id_users_id_fkey" FOREIGN KEY ("leader_id") REFERENCES "users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "user_tags" ADD CONSTRAINT "user_tags_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "user_tags" ADD CONSTRAINT "user_tags_tag_id_tags_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "tags"("id") ON DELETE CASCADE;