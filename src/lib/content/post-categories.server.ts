import { and, asc, eq, inArray } from "drizzle-orm";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import * as schema from "@/db/schema";
import type { PostCategorySummary } from "./types";

export async function attachCategoriesToPosts(
  db: PostgresJsDatabase<typeof schema>,
  postIds: string[],
): Promise<Map<string, PostCategorySummary[]>> {
  const map = new Map<string, PostCategorySummary[]>();
  if (postIds.length === 0) return map;

  const rows = await db
    .select({
      postId: schema.postCategories.postId,
      slug: schema.categories.slug,
      name: schema.categories.name,
      position: schema.categories.position,
    })
    .from(schema.postCategories)
    .innerJoin(
      schema.categories,
      eq(schema.postCategories.categoryId, schema.categories.id),
    )
    .where(inArray(schema.postCategories.postId, postIds))
    .orderBy(asc(schema.categories.position), asc(schema.categories.name));

  for (const row of rows) {
    const list = map.get(row.postId) ?? [];
    list.push({
      slug: row.slug,
      name: row.name,
      position: row.position,
    });
    map.set(row.postId, list);
  }

  return map;
}
