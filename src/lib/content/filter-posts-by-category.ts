import {
  ALL_FILTER_SLUG,
  UNCATEGORIZED_FILTER_SLUG,
} from "./category-constants";
import type { PostWithRelations } from "./types";

export function filterPostsByCategory(
  posts: PostWithRelations[],
  activeSlug: string,
): PostWithRelations[] {
  if (activeSlug === ALL_FILTER_SLUG) return posts;

  if (activeSlug === UNCATEGORIZED_FILTER_SLUG) {
    return posts.filter((post) => post.categories.length === 0);
  }

  return posts.filter((post) =>
    post.categories.some((category) => category.slug === activeSlug),
  );
}
