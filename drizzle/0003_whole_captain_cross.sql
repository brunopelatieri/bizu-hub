CREATE TABLE "categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"position" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "categories_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
INSERT INTO "categories" ("slug", "name", "position") VALUES
	('produtividade', 'Produtividade', 1),
	('negocios', 'Negócios', 2),
	('ferramentas', 'Ferramentas', 3),
	('teste', 'Teste', 99);
--> statement-breakpoint
CREATE TABLE "post_categories" (
	"post_id" uuid NOT NULL,
	"category_id" uuid NOT NULL,
	CONSTRAINT "post_categories_post_id_category_id_pk" PRIMARY KEY("post_id","category_id")
);
--> statement-breakpoint
ALTER TABLE "post_categories" ADD CONSTRAINT "post_categories_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post_categories" ADD CONSTRAINT "post_categories_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
INSERT INTO "post_categories" ("post_id", "category_id")
SELECT p."id", c."id"
FROM "posts" p
INNER JOIN "categories" c ON c."name" = p."tag";
--> statement-breakpoint
CREATE INDEX "post_categories_post_id_idx" ON "post_categories" ("post_id");--> statement-breakpoint
CREATE INDEX "post_categories_category_id_idx" ON "post_categories" ("category_id");--> statement-breakpoint
ALTER TABLE "posts" DROP COLUMN "tag";
