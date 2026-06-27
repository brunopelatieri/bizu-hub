import { useState } from "react";
import { BlogCategoryFilter } from "@/components/blog/blog-category-filter";
import { BlogPostGrid } from "@/components/blog/blog-post-grid";
import { BlogSearchCombobox } from "@/components/blog/blog-search-combobox";
import { PageHero } from "@/components/layout/page-hero";
import { useBlogSearch } from "@/lib/blog/use-blog-search";
import { getCategoriesForBlogMenu } from "@/lib/content/categories.server";
import { ALL_FILTER_SLUG } from "@/lib/content/category-constants";
import { filterPostsByCategory } from "@/lib/content/filter-posts-by-category";
import { getAllPosts } from "@/lib/content/posts.server";
import { siteConfig } from "@/lib/constants/navigation";
import { buildMeta } from "@/lib/seo";
import type { Route } from "./+types/blog";

export async function loader() {
  const [posts, menuCategories] = await Promise.all([
    getAllPosts(),
    getCategoriesForBlogMenu(),
  ]);
  return { posts, menuCategories };
}

export const meta: Route.MetaFunction = () =>
  buildMeta({
    title: `Blog — ${siteConfig.name}`,
    description:
      "Insights sobre automação com IA, n8n, agentes LLM, arquitetura full-stack e produtividade técnica.",
    path: "/blog",
  });

export default function Blog({ loaderData }: Route.ComponentProps) {
  const { posts, menuCategories } = loaderData;
  const [activeSlug, setActiveSlug] = useState(ALL_FILTER_SLUG);

  const {
    query,
    setQuery,
    status,
    results,
    previewResults,
    isSearchActive,
    trimmed,
  } = useBlogSearch(activeSlug);

  const categoryFiltered = filterPostsByCategory(posts, activeSlug);
  const displayPosts = isSearchActive ? results : categoryFiltered;

  return (
    <>
      <PageHero
        eyebrow="Blog"
        title="Insights para profissionais digitais"
        description="Conteúdo sobre produtividade, gestão de clientes e a stack por trás de produtos modernos."
      />
      <section className="px-6 py-12">
        <div className="mx-auto max-w-5xl">
          <BlogSearchCombobox
            query={query}
            onQueryChange={setQuery}
            status={status}
            previewResults={previewResults}
            isSearchActive={isSearchActive}
            trimmed={trimmed}
          />

          <BlogCategoryFilter
            menuCategories={menuCategories}
            activeSlug={activeSlug}
            onSelect={setActiveSlug}
          />

          <BlogPostGrid
            posts={displayPosts}
            status={status}
            isSearchActive={isSearchActive}
          />
        </div>
      </section>
    </>
  );
}
