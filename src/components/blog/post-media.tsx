import type { PostMedia as PostMediaType } from "@/db/schema";

interface PostMediaProps {
  items: PostMediaType[];
}

export function PostMedia({ items }: PostMediaProps) {
  if (items.length === 0) return null;

  const sorted = [...items].sort((a, b) => a.position - b.position);

  return (
    <section className="mt-10 space-y-6">
      <h2 className="text-lg font-semibold text-foreground">Mídia</h2>
      {sorted.map((item) => (
        <div key={item.id}>
          <p className="mb-2 text-sm font-medium text-muted-foreground">
            {item.title}
          </p>
          {item.deliveryMode === "embed" ? (
            <iframe
              src={item.url}
              title={item.title}
              className="aspect-video w-full rounded-lg border border-border/60"
              allowFullScreen
            />
          ) : item.mediaType === "mp3" ? (
            // eslint-disable-next-line jsx-a11y/media-has-caption
            <audio controls src={item.url} className="w-full" />
          ) : (
            // eslint-disable-next-line jsx-a11y/media-has-caption
            <video
              controls
              src={item.url}
              className="w-full rounded-lg border border-border/60"
            />
          )}
        </div>
      ))}
    </section>
  );
}
