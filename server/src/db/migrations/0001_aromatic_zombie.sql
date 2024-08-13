DO $$ BEGIN
 CREATE TYPE "public"."reason" AS ENUM('spam', 'abuse', 'fraud', 'violation_of_terms', 'harassment', 'inappropriate_content', 'chargeback', 'other', 'not_specified');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Blacklist" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" integer NOT NULL,
	"reason" "reason" DEFAULT 'not_specified' NOT NULL,
	"notes" varchar(255) DEFAULT 'Not specified' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Blacklist" ADD CONSTRAINT "Blacklist_userId_Users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."Users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
