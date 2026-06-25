CREATE TABLE "expenses" (
	"uuid" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(255) NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	"date" date NOT NULL,
	"category" varchar(100) NOT NULL,
	"notes" text,
	"user_id" uuid NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "migrations_history" (
	"id" serial PRIMARY KEY NOT NULL,
	"timestamp" bigint NOT NULL,
	"name" varchar NOT NULL,
	"executed_at" timestamp DEFAULT now() NOT NULL,
	"execution_time" integer,
	"success" boolean DEFAULT true NOT NULL,
	"error_message" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"uuid" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "expenses" ADD CONSTRAINT "expenses_user_id_users_uuid_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("uuid") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
CREATE INDEX "IDX_EXPENSES_USER_ID" ON "expenses" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "IDX_EXPENSES_USER_CATEGORY" ON "expenses" USING btree ("user_id","category");--> statement-breakpoint
CREATE INDEX "IDX_EXPENSES_USER_DATE" ON "expenses" USING btree ("user_id","date");--> statement-breakpoint
CREATE INDEX "IDX_EXPENSES_USER_CATEGORY_DATE" ON "expenses" USING btree ("user_id","category","date");--> statement-breakpoint
CREATE INDEX "IDX_EXPENSES_DATE" ON "expenses" USING btree ("date");--> statement-breakpoint
CREATE INDEX "IDX_EXPENSES_CATEGORY" ON "expenses" USING btree ("category");--> statement-breakpoint
CREATE INDEX "IDX_EXPENSES_CREATED_AT" ON "expenses" USING btree ("createdAt");