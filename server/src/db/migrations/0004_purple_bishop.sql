ALTER TABLE "Blacklist" ALTER COLUMN "expiresAt" SET DEFAULT '2024-08-20 11:32:15.184';--> statement-breakpoint
ALTER TABLE "Blacklist" ADD COLUMN "deletedAt" timestamp;