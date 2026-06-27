import { eq, inArray } from "drizzle-orm";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import * as schema from "../src/db/schema";

export async function linkPostToCategories(
  db: PostgresJsDatabase<typeof schema>,
  postSlug: string,
  categorySlugs: string[],
): Promise<void> {
  if (categorySlugs.length === 0) return;

  const postRows = await db
    .select({ id: schema.posts.id })
    .from(schema.posts)
    .where(eq(schema.posts.slug, postSlug))
    .limit(1);

  const post = postRows[0];
  if (!post) return;

  const categoryRows = await db
    .select({ id: schema.categories.id })
    .from(schema.categories)
    .where(inArray(schema.categories.slug, categorySlugs));

  if (categoryRows.length === 0) return;

  await db
    .insert(schema.postCategories)
    .values(
      categoryRows.map((category) => ({
        postId: post.id,
        categoryId: category.id,
      })),
    )
    .onConflictDoNothing();
}
