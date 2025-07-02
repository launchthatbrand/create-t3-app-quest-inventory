CREATE SCHEMA "auth";
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "app_role" AS ENUM('admin', 'moderator', 'user');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "auth"."users" (
	"id" uuid PRIMARY KEY NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "create-t3-app_products" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256) NOT NULL,
	"description" varchar(256),
	"quantity" integer DEFAULT 0 NOT NULL,
	"price" real DEFAULT 0 NOT NULL,
	"category" varchar(256),
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "create-t3-app_user_roles" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"role" "app_role" NOT NULL,
	CONSTRAINT "user_role_unique" UNIQUE("user_id","role")
);
--> statement-breakpoint
ALTER TABLE "create-t3-app_formResponses" DROP CONSTRAINT "create-t3-app_formResponses_createdById_fkey";
--> statement-breakpoint
ALTER TABLE "create-t3-app_formResponses" ALTER COLUMN "createdById" SET NOT NULL;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "product_name_idx" ON "create-t3-app_products" ("name");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "create-t3-app_formResponses" ADD CONSTRAINT "create-t3-app_formResponses_createdById_create-t3-app_user_id_fk" FOREIGN KEY ("createdById") REFERENCES "create-t3-app_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "create-t3-app_user_roles" ADD CONSTRAINT "create-t3-app_user_roles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
