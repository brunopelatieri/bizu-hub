import { Link } from "react-router";
import { Badge } from "@/components/ui/badge";
import { getAllPosts } from "@/lib/content/posts";

export function BlogSection() {
  const posts = getAllPosts().slice(0, 3);

  return (
    <section className="border-b border-border/50 bg-muted/30 py-24">
      <div className="mx-auto max-w-5xl px-6">
        <div className="mb-14 flex flex-col items-start gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-3 text-sm font-medium uppercase tracking-widest text-primary">
              Blog
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              Insights para profissionais digitais
            </h2>
          </div>
          <Link
            to="/blog"
            className="shrink-0 text-sm font-medium text-primary transition hover:opacity-80"
          >
            Ver todos os posts →
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {posts.map((post) => (
            <Link
              key={post.slug}
              to={`/blog/${post.slug}`}
              className="group flex flex-col rounded-xl border border-border/60 bg-card shadow-sm transition-shadow hover:shadow-md"
            >
              {post.cover ? (
                <img
                  src={post.cover}
                  alt=""
                  className="h-44 w-full rounded-t-xl object-cover"
                />
              ) : (
                <div className="h-44 rounded-t-xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent" />
              )}
              <div className="flex flex-1 flex-col p-5">
                <div className="mb-3 flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">
                    {post.tag}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {post.readTime} de leitura
                  </span>
                </div>
                <h3 className="mb-2 flex-1 text-base font-semibold leading-snug text-foreground transition group-hover:text-primary">
                  {post.title}
                </h3>
                <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
                  {post.excerpt}
                </p>
                <time
                  dateTime={post.publishedAt}
                  className="text-xs text-muted-foreground"
                >
                  {post.date}
                </time>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
