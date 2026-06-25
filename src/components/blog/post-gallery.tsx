import { lazy, Suspense } from "react";
import type { PostImage } from "@/db/schema";
import { PostGalleryFallback } from "@/components/blog/post-gallery-fallback";

const PostGalleryLightbox = lazy(() =>
  import("@/components/blog/post-gallery-lightbox").then((module) => ({
    default: module.PostGalleryLightbox,
  })),
);

interface PostGalleryProps {
  images: PostImage[];
}

export function PostGallery({ images }: PostGalleryProps) {
  if (images.length === 0) return null;

  return (
    <Suspense fallback={<PostGalleryFallback images={images} />}>
      <PostGalleryLightbox images={images} />
    </Suspense>
  );
}
