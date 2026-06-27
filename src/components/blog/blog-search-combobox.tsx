import { useEffect, useId, useRef, useState } from "react";
import { Link } from "react-router";
import { Loader2, Search, X } from "lucide-react";
import { PostCategoryBadges } from "@/components/blog/post-category-badges";
import { Input } from "@/components/ui/input";
import type { BlogSearchStatus } from "@/lib/blog/use-blog-search";
import type { BlogPostSummary } from "@/lib/content/types";
import {
  SEARCH_EMPTY_MESSAGE,
  SEARCH_ERROR_MESSAGE,
  SEARCH_HINT_MIN_CHARS,
  SEARCH_LOADING_LABEL,
  SEARCH_PLACEHOLDER,
} from "@/lib/content/search-constants";

type BlogSearchComboboxProps = {
  query: string;
  onQueryChange: (value: string) => void;
  status: BlogSearchStatus;
  previewResults: BlogPostSummary[];
  isSearchActive: boolean;
  trimmed: string;
};

export function BlogSearchCombobox({
  query,
  onQueryChange,
  status,
  previewResults,
  isSearchActive,
  trimmed,
}: BlogSearchComboboxProps) {
  const listboxId = useId();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  const showPreview =
    isOpen &&
    (status === "loading" ||
      status === "results" ||
      status === "empty" ||
      status === "error");

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);

  function handleClear() {
    onQueryChange("");
    setIsOpen(false);
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Escape") {
      setIsOpen(false);
    }
  }

  return (
    <div ref={wrapperRef} className="relative mb-8">
      <label htmlFor="blog-search" className="sr-only">
        Buscar posts
      </label>
      <div className="relative">
        <Search
          className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
        <Input
          id="blog-search"
          type="search"
          value={query}
          onChange={(event) => {
            onQueryChange(event.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={SEARCH_PLACEHOLDER}
          autoComplete="off"
          role="combobox"
          aria-expanded={showPreview}
          aria-busy={status === "loading"}
          aria-controls={showPreview ? listboxId : undefined}
          aria-autocomplete="list"
          className="h-10 pl-9 pr-9"
        />
        {status === "loading" && (
          <Loader2
            className="absolute top-1/2 right-3 size-4 -translate-y-1/2 animate-spin text-muted-foreground"
            aria-hidden
          />
        )}
        {query.length > 0 && status !== "loading" && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground transition hover:text-foreground"
            aria-label="Limpar busca"
          >
            <X className="size-4" aria-hidden />
          </button>
        )}
      </div>

      {!isSearchActive && query.trim().length > 0 && (
        <p className="mt-2 text-sm text-muted-foreground">
          {SEARCH_HINT_MIN_CHARS}
        </p>
      )}

      <p aria-live="polite" className="sr-only">
        {status === "loading" && SEARCH_LOADING_LABEL}
        {status === "results" &&
          `${previewResults.length} resultado${previewResults.length === 1 ? "" : "s"} encontrado${previewResults.length === 1 ? "" : "s"}.`}
        {status === "empty" && SEARCH_EMPTY_MESSAGE}
        {status === "error" && SEARCH_ERROR_MESSAGE}
      </p>

      {showPreview && (
        <div
          id={listboxId}
          role="listbox"
          aria-label="Resultados da busca"
          className="absolute z-20 mt-1 w-full overflow-hidden rounded-lg border border-border bg-popover shadow-md"
        >
          {status === "loading" && (
            <p
              role="status"
              className="px-4 py-3 text-sm text-muted-foreground"
            >
              {SEARCH_LOADING_LABEL}
            </p>
          )}

          {status === "error" && (
            <p role="alert" className="px-4 py-3 text-sm text-destructive">
              {SEARCH_ERROR_MESSAGE}
            </p>
          )}

          {status === "empty" && (
            <p
              role="status"
              className="px-4 py-3 text-sm text-muted-foreground"
            >
              {SEARCH_EMPTY_MESSAGE}
            </p>
          )}

          {status === "results" &&
            previewResults.map((post) => (
              <Link
                key={post.slug}
                role="option"
                to={`/blog/${post.slug}`}
                onClick={() => setIsOpen(false)}
                className="block border-b border-border/60 px-4 py-3 transition last:border-b-0 hover:bg-muted/50"
              >
                <span className="block text-sm font-medium text-foreground">
                  {post.title}
                </span>
                <span className="mt-1 flex flex-wrap gap-1">
                  <PostCategoryBadges categories={post.categories} />
                </span>
                <span className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                  {post.excerpt}
                </span>
              </Link>
            ))}

          {status === "results" && trimmed && (
            <p className="px-4 py-2 text-xs text-muted-foreground">
              Pressione Enter ou veja todos os resultados abaixo.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
