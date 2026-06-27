import { Badge } from "@/components/ui/badge";
import { UNCATEGORIZED_LABEL } from "@/lib/content/category-constants";
import type { PostCategorySummary } from "@/lib/content/types";

type PostCategoryBadgesProps = {
  categories: PostCategorySummary[];
  className?: string;
  badgeClassName?: string;
};

export function PostCategoryBadges({
  categories,
  className,
  badgeClassName,
}: PostCategoryBadgesProps) {
  if (categories.length === 0) {
    return (
      <div className={className}>
        <Badge variant="secondary" className={badgeClassName ?? "text-xs"}>
          {UNCATEGORIZED_LABEL}
        </Badge>
      </div>
    );
  }

  return (
    <div className={`flex flex-wrap gap-2 ${className ?? ""}`}>
      {categories.map((category) => (
        <Badge
          key={category.slug}
          variant="secondary"
          className={badgeClassName ?? "text-xs"}
        >
          {category.name}
        </Badge>
      ))}
    </div>
  );
}
