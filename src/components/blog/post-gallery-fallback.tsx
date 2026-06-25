import type { PostImage } from "@/db/schema";

type PostGalleryFallbackProps = {
  images: PostImage[];
};

/** Grid estático para fallback SSR (Suspense) — sem dependências client-only. */
export function PostGalleryFallback({ images }: PostGalleryFallbackProps) {
  const sortedImages = [...images].sort((a, b) => a.position - b.position);

  if (sortedImages.length === 0) return null;

  return (
    <section className="mt-10">
      <h2 className="mb-4 text-lg font-semibold text-foreground">Galeria</h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {sortedImages.map((image) => (
          <img
            key={image.id}
            src={image.url}
            alt={image.alt}
            loading="lazy"
            className="aspect-[4/5] w-full rounded-lg border border-border/60 object-cover"
          />
        ))}
      </div>
    </section>
  );
}
