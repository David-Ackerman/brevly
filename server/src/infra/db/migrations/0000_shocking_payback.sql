CREATE TABLE "links" (
	"short_url" text PRIMARY KEY NOT NULL,
	"original_url" text NOT NULL,
	"created_at" timestamp NOT NULL,
	"access_count" integer NOT NULL,
	CONSTRAINT "links_short_url_unique" UNIQUE("short_url")
);
