import { asc, eq } from "drizzle-orm";
import { desc } from "drizzle-orm";
import { getDb } from "@/db";
import {
  postAttachments,
  postImages,
  postMedia,
  posts,
} from "@/db/schema";
import { calculateReadTime } from "./read-time";
import type { PostWithRelations } from "./types";

export async function getAllPosts(): Promise<PostWithRelations[]> {
  const db = getDb();
  const rows = await db
    .select()
    .from(posts)
    .where(eq(posts.status, "published"))
    .orderBy(desc(posts.publishedAt));

  return rows.map((post) => ({
    ...post,
    images: [],
    media: [],
    attachments: [],
    readTime: calculateReadTime(post.content),
  }));
}

export async function getPostBySlug(
  slug: string,
): Promise<PostWithRelations | undefined> {
  const db = getDb();

  const postRows = await db
    .select()
    .from(posts)
    .where(eq(posts.slug, slug))
    .limit(1);

  const post = postRows[0];
  if (!post || post.status !== "published") return undefined;

  const [images, media, attachments] = await Promise.all([
    db
      .select()
      .from(postImages)
      .where(eq(postImages.postId, post.id))
      .orderBy(asc(postImages.position)),
    db
      .select()
      .from(postMedia)
      .where(eq(postMedia.postId, post.id))
      .orderBy(asc(postMedia.position)),
    db
      .select()
      .from(postAttachments)
      .where(eq(postAttachments.postId, post.id))
      .orderBy(asc(postAttachments.position)),
  ]);

  return {
    ...post,
    images,
    media,
    attachments,
    readTime: calculateReadTime(post.content),
  };
}
