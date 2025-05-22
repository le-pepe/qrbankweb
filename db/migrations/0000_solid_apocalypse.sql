CREATE TYPE "public"."accountType" AS ENUM('vista', 'corriente', 'ahorro');--> statement-breakpoint
CREATE TABLE "accounts" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"rut" varchar NOT NULL,
	"bank" varchar NOT NULL,
	"email" varchar,
	"alias" varchar,
	"accountType" "accountType" DEFAULT 'vista',
	"accountNumber" varchar NOT NULL,
	"isMine" boolean DEFAULT true NOT NULL,
	"userId" varchar NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "userId_idx" ON "accounts" USING btree ("userId");