import { Link } from "react-router";
import { PostCategoryBadges } from "@/components/blog/post-category-badges";
import type { PostWithRelations } from "@/lib/content/types";

type BlogSectionProps = {
  posts: PostWithRelations[];
};

export function BlogSection({ posts }: BlogSectionProps) {
  return (
    <section className="border-b border-slate-800/50 bg-slate-900 py-24">
      <div className="mx-auto max-w-5xl px-6">
        <div className="mb-14 flex flex-col items-start gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-3 font-mono text-sm uppercase tracking-widest text-brand-teal">
              Blog
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
              Insights sobre IA & automação
            </h2>
          </div>
          <Link
            to="/blog"
            className="shrink-0 font-mono text-sm font-medium text-brand-blue transition hover:opacity-80"
          >
            Ver todos os posts →
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {posts.map((post) => (
            <Link
              key={post.slug}
              to={`/blog/${post.slug}`}
              className="group flex flex-col overflow-hidden rounded-2xl border border-slate-800/50 bg-slate-950/40 backdrop-blur-md transition-colors duration-200 hover:border-brand-blue/40"
            >
              {post.cover ? (
                <img
                  src={post.cover}
                  alt={`Capa do post: ${post.title}`}
                  className="aspect-[4/5] w-full object-cover"
                />
              ) : (
                <div className="aspect-[4/5] bg-gradient-to-br from-brand-blue/15 via-brand-indigo/10 to-transparent" />
              )}
              <div className="flex flex-1 flex-col p-5">
                <div className="mb-3 flex items-center gap-2">
                  <PostCategoryBadges
                    categories={post.categories}
                    badgeClassName="bg-slate-800 font-mono text-xs text-slate-300"
                  />
                  <span className="font-mono text-xs text-slate-500">
                    {post.readTime} de leitura
                  </span>
                </div>
                <h3 className="mb-2 flex-1 text-base font-semibold leading-snug text-white transition group-hover:text-brand-blue">
                  {post.title}
                </h3>
                <p className="mb-4 text-base leading-relaxed text-slate-400">
                  {post.excerpt}
                </p>
                <time
                  dateTime={post.publishedAt}
                  className="font-mono text-xs text-slate-500"
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
