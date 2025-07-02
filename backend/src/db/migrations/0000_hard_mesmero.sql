CREATE TYPE "public"."category_enum" AS ENUM('Technology', 'Food', 'Travel', 'Lifestyle', 'Education', 'Other');--> statement-breakpoint
CREATE TABLE "blog_posts" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"category" "category_enum" NOT NULL,
	"content" text NOT NULL,
	"image" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
