import { useEffect, useRef, useState } from "react";
import type { BlogPostSummary } from "@/lib/content/types";
import {
  SEARCH_DEBOUNCE_MS,
  SEARCH_MIN_CHARS,
  SEARCH_PREVIEW_LIMIT,
} from "@/lib/content/search-constants";

export type BlogSearchStatus =
  | "idle"
  | "typing"
  | "loading"
  | "results"
  | "empty"
  | "error";

type SearchResponse = {
  posts: BlogPostSummary[];
};

export function useBlogSearch(activeCategorySlug: string) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<BlogSearchStatus>("idle");
  const [results, setResults] = useState<BlogPostSummary[]>([]);
  const abortRef = useRef<AbortController | null>(null);

  const trimmed = query.trim();
  const isSearchActive = trimmed.length >= SEARCH_MIN_CHARS;

  useEffect(() => {
    if (!isSearchActive) {
      abortRef.current?.abort();
      setStatus("idle");
      setResults([]);
      return;
    }

    setStatus("typing");

    const timer = window.setTimeout(async () => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;
      setStatus("loading");

      try {
        const params = new URLSearchParams({
          q: trimmed,
          category: activeCategorySlug,
        });
        const response = await fetch(`/api/blog/search?${params}`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("search failed");
        }

        const data = (await response.json()) as SearchResponse;

        if (controller.signal.aborted) {
          return;
        }

        setResults(data.posts);
        setStatus(data.posts.length > 0 ? "results" : "empty");
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }
        setStatus("error");
      }
    }, SEARCH_DEBOUNCE_MS);

    return () => {
      window.clearTimeout(timer);
    };
  }, [trimmed, activeCategorySlug, isSearchActive]);

  const previewResults = results.slice(0, SEARCH_PREVIEW_LIMIT);

  return {
    query,
    setQuery,
    status,
    results,
    previewResults,
    isSearchActive,
    trimmed,
  };
}
