CREATE TABLE "drones" (
	"uuid" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company" varchar(100) NOT NULL,
	"model" varchar(100) NOT NULL,
	"full_name" varchar(255) NOT NULL,
	"price_rtf" numeric(12, 2) NOT NULL,
	"tank_capacity" numeric(8, 2) NOT NULL,
	"flight_speed" numeric(8, 2) NOT NULL,
	"spray_width" numeric(8, 2) NOT NULL,
	"coverage_per_day" numeric(10, 2) NOT NULL,
	"rtf_equipment" text DEFAULT '' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "todos" (
	"uuid" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"drone_id" uuid,
	"title" varchar(255) NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"completed" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "todos" ADD CONSTRAINT "todos_user_id_users_uuid_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("uuid") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "todos" ADD CONSTRAINT "todos_drone_id_drones_uuid_fk" FOREIGN KEY ("drone_id") REFERENCES "public"."drones"("uuid") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
CREATE INDEX "IDX_DRONES_COMPANY" ON "drones" USING btree ("company");--> statement-breakpoint
CREATE INDEX "IDX_DRONES_MODEL" ON "drones" USING btree ("model");--> statement-breakpoint
CREATE INDEX "IDX_TODOS_USER_ID" ON "todos" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "IDX_TODOS_USER_DRONE" ON "todos" USING btree ("user_id","drone_id");