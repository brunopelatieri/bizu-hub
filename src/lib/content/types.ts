import type { Post, PostAttachment, PostImage, PostMedia } from "@/db/schema";

export type PostCategorySummary = {
  slug: string;
  name: string;
  position: number;
};

export type PostWithRelations = Post & {
  categories: PostCategorySummary[];
  images: PostImage[];
  media: PostMedia[];
  attachments: PostAttachment[];
  readTime: string;
};

/** Resumo de post para listagem e busca AJAX (sem content). */
export type BlogPostSummary = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  publishedAt: string;
  cover: string | null;
  readTime: string;
  categories: PostCategorySummary[];
};
