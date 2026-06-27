import { and, asc, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { categories, postCategories, posts } from "@/db/schema";
import type { PostCategorySummary } from "./types";

export async function getCategoriesForBlogMenu(): Promise<PostCategorySummary[]> {
  const db = getDb();

  const rows = await db
    .selectDistinct({
      slug: categories.slug,
      name: categories.name,
      position: categories.position,
    })
    .from(categories)
    .innerJoin(postCategories, eq(postCategories.categoryId, categories.id))
    .innerJoin(
      posts,
      and(eq(postCategories.postId, posts.id), eq(posts.status, "published")),
    )
    .orderBy(asc(categories.position), asc(categories.name));

  return rows;
}
