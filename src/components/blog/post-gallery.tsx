import type { PostImage } from "@/db/schema";

interface PostGalleryProps {
  images: PostImage[];
}

export function PostGallery({ images }: PostGalleryProps) {
  if (images.length === 0) return null;

  return (
    <section className="mt-10">
      <h2 className="mb-4 text-lg font-semibold text-foreground">Galeria</h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {[...images]
          .sort((a, b) => a.position - b.position)
          .map((image) => (
            <img
              key={image.id}
              src={image.url}
              alt={image.alt}
              loading="lazy"
              className="w-full rounded-lg border border-border/60 object-cover"
            />
          ))}
      </div>
    </section>
  );
}
