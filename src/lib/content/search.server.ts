import {
  and,
  desc,
  eq,
  exists,
  ilike,
  notExists,
  or,
} from "drizzle-orm";
import { getDb } from "@/db";
import { categories, postCategories, posts } from "@/db/schema";
import {
  ALL_FILTER_SLUG,
  UNCATEGORIZED_FILTER_SLUG,
} from "@/lib/content/category-constants";
import { escapeIlike } from "@/lib/content/escape-ilike";
import { attachCategoriesToPosts } from "@/lib/content/post-categories.server";
import { calculateReadTime } from "@/lib/content/read-time";
import { SEARCH_API_LIMIT } from "@/lib/content/search-constants";
import type { BlogPostSummary } from "@/lib/content/types";

export async function searchPublishedPosts(
  q: string,
  categorySlug: string,
): Promise<BlogPostSummary[]> {
  const db = getDb();
  const pattern = `%${escapeIlike(q)}%`;

  const textMatch = or(
    ilike(posts.title, pattern),
    ilike(posts.excerpt, pattern),
    ilike(posts.content, pattern),
  )!;

  let categoryCondition;
  if (categorySlug === ALL_FILTER_SLUG) {
    categoryCondition = undefined;
  } else if (categorySlug === UNCATEGORIZED_FILTER_SLUG) {
    categoryCondition = notExists(
      db
        .select({ id: postCategories.postId })
        .from(postCategories)
        .where(eq(postCategories.postId, posts.id)),
    );
  } else {
    categoryCondition = exists(
      db
        .select({ id: postCategories.postId })
        .from(postCategories)
        .innerJoin(categories, eq(postCategories.categoryId, categories.id))
        .where(
          and(
            eq(postCategories.postId, posts.id),
            eq(categories.slug, categorySlug),
          ),
        ),
    );
  }

  const conditions = [eq(posts.status, "published"), textMatch];
  if (categoryCondition) {
    conditions.push(categoryCondition);
  }

  const rows = await db
    .select({
      id: posts.id,
      slug: posts.slug,
      title: posts.title,
      excerpt: posts.excerpt,
      content: posts.content,
      date: posts.date,
      publishedAt: posts.publishedAt,
      cover: posts.cover,
    })
    .from(posts)
    .where(and(...conditions))
    .orderBy(desc(posts.publishedAt))
    .limit(SEARCH_API_LIMIT);

  const categoryMap = await attachCategoriesToPosts(
    db,
    rows.map((row) => row.id),
  );

  return rows.map((post) => ({
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    date: post.date,
    publishedAt: post.publishedAt,
    cover: post.cover,
    readTime: calculateReadTime(post.content),
    categories: categoryMap.get(post.id) ?? [],
  }));
}
