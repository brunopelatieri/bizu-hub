import { Link } from "react-router";
import { PostCategoryBadges } from "@/components/blog/post-category-badges";
import { EMPTY_CATEGORY_MESSAGE } from "@/lib/content/category-constants";
import {
  SEARCH_EMPTY_MESSAGE,
  SEARCH_ERROR_MESSAGE,
} from "@/lib/content/search-constants";
import type { BlogPostSummary } from "@/lib/content/types";
import type { BlogSearchStatus } from "@/lib/blog/use-blog-search";

type BlogPostGridProps = {
  posts: BlogPostSummary[];
  status: BlogSearchStatus;
  isSearchActive: boolean;
};

export function BlogPostGrid({
  posts,
  status,
  isSearchActive,
}: BlogPostGridProps) {
  if (status === "loading") {
    return (
      <p role="status" className="py-12 text-center text-muted-foreground">
        Buscando…
      </p>
    );
  }

  if (status === "error") {
    return (
      <p role="alert" className="py-12 text-center text-destructive">
        {SEARCH_ERROR_MESSAGE}
      </p>
    );
  }

  if (posts.length === 0) {
    return (
      <p role="status" className="py-12 text-center text-muted-foreground">
        {isSearchActive ? SEARCH_EMPTY_MESSAGE : EMPTY_CATEGORY_MESSAGE}
      </p>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {posts.map((post) => (
        <Link
          key={post.slug}
          to={`/blog/${post.slug}`}
          className="group flex flex-col rounded-xl border border-border/60 bg-card shadow-sm transition-shadow hover:shadow-md"
        >
          {post.cover ? (
            <img
              src={post.cover}
              alt=""
              className="aspect-[4/5] w-full rounded-t-xl object-cover"
            />
          ) : (
            <div className="aspect-[4/5] rounded-t-xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent" />
          )}
          <div className="flex flex-1 flex-col p-5">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <PostCategoryBadges categories={post.categories} />
              <span className="shrink-0 text-xs text-muted-foreground">
                {post.readTime} de leitura
              </span>
            </div>
            <h2 className="mb-2 flex-1 text-base font-semibold leading-snug text-foreground transition group-hover:text-primary">
              {post.title}
            </h2>
            <p className="mb-4 text-base leading-relaxed text-muted-foreground">
              {post.excerpt}
            </p>
            <time
              dateTime={post.publishedAt}
              className="text-xs text-muted-foreground"
            >
              {post.date}
            </time>
          </div>
        </Link>
      ))}
    </div>
  );
}
