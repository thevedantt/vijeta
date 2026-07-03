ALTER TABLE "conversation_participants" DROP CONSTRAINT "conversation_participants_conversation_id_conversations_id_fkey";--> statement-breakpoint
ALTER TABLE "messages" DROP CONSTRAINT "messages_conversation_id_conversations_id_fkey";--> statement-breakpoint
DROP TABLE "conversation_participants";--> statement-breakpoint
DROP TABLE "conversations";--> statement-breakpoint
DROP TABLE "messages";