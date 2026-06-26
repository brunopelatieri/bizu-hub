-- Legacy contact_messages rows predate required phone — delete before NOT NULL (no backfill).
DELETE FROM "contact_messages";
--> statement-breakpoint
ALTER TABLE "contact_messages" ADD COLUMN "phone" varchar(20) NOT NULL;
