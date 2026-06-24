import type { PostAttachment } from "@/db/schema";

interface PostAttachmentsProps {
  attachments: PostAttachment[];
}

export function PostAttachments({ attachments }: PostAttachmentsProps) {
  if (attachments.length === 0) return null;

  const sorted = [...attachments].sort((a, b) => a.position - b.position);

  return (
    <section className="mt-10">
      <h2 className="mb-4 text-lg font-semibold text-foreground">Downloads</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {sorted.map((attachment) => (
          <div
            key={attachment.id}
            className="flex flex-col gap-2 rounded-lg border border-border/60 bg-card p-4"
          >
            <span className="text-sm font-medium text-foreground">
              {attachment.name}
            </span>
            {attachment.description ? (
              <span className="text-xs text-muted-foreground">
                {attachment.description}
              </span>
            ) : null}
            <a
              href={attachment.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-auto inline-flex items-center gap-1 text-xs font-medium text-primary underline-offset-4 hover:underline"
            >
              Baixar arquivo ↗
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}
