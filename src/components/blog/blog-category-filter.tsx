import { Button } from "@/components/ui/button";
import {
  ALL_FILTER_SLUG,
  UNCATEGORIZED_FILTER_SLUG,
  UNCATEGORIZED_LABEL,
} from "@/lib/content/category-constants";
import type { PostCategorySummary } from "@/lib/content/types";

type BlogCategoryFilterProps = {
  menuCategories: PostCategorySummary[];
  activeSlug: string;
  onSelect: (slug: string) => void;
};

export function BlogCategoryFilter({
  menuCategories,
  activeSlug,
  onSelect,
}: BlogCategoryFilterProps) {
  const items = [
    { slug: ALL_FILTER_SLUG, label: "Todos" },
    { slug: UNCATEGORIZED_FILTER_SLUG, label: UNCATEGORIZED_LABEL },
    ...menuCategories.map((c) => ({ slug: c.slug, label: c.name })),
  ];

  return (
    <nav
      aria-label="Filtrar posts por categoria"
      className="mb-8 flex gap-2 overflow-x-auto pb-1"
    >
      {items.map((item) => {
        const isActive = activeSlug === item.slug;
        return (
          <Button
            key={item.slug}
            type="button"
            variant={isActive ? "secondary" : "outline"}
            size="sm"
            className="shrink-0"
            aria-current={isActive ? "true" : undefined}
            onClick={() => onSelect(item.slug)}
          >
            {item.label}
          </Button>
        );
      })}
    </nav>
  );
}
