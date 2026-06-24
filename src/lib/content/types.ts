import type { Post, PostAttachment, PostImage, PostMedia } from "@/db/schema";

export type PostWithRelations = Post & {
  images: PostImage[];
  media: PostMedia[];
  attachments: PostAttachment[];
  readTime: string;
};
