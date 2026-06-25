import { Link } from "react-router";
import { Badge } from "@/components/ui/badge";
import { PageHero } from "@/components/layout/page-hero";
import { getAllPosts } from "@/lib/content/posts.server";
import { siteConfig } from "@/lib/constants/navigation";
import type { Route } from "./+types/blog";

export async function loader() {
  return { posts: await getAllPosts() };
}

export const meta: Route.MetaFunction = () => [
  { title: `Blog — ${siteConfig.title}` },
  {
    name: "description",
    content:
      "Insights sobre automação com IA, n8n, agentes LLM, arquitetura full-stack e produtividade técnica.",
  },
  { property: "og:title", content: `Blog — ${siteConfig.title}` },
  { property: "og:type", content: "website" },
];

export default function Blog({ loaderData }: Route.ComponentProps) {
  const { posts } = loaderData;

  return (
    <>
      <PageHero
        eyebrow="Blog"
        title="Insights para profissionais digitais"
        description="Conteúdo sobre produtividade, gestão de clientes e a stack por trás de produtos modernos."
      />
      <section className="px-6 py-12">
        <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
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
                  className="aspect-[4/5] w-full rounded-t-xl object-cover"
                />
              ) : (
                <div className="aspect-[4/5] rounded-t-xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent" />
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
                <h2 className="mb-2 flex-1 text-base font-semibold leading-snug text-foreground transition group-hover:text-primary">
                  {post.title}
                </h2>
                <p className="mb-4 text-base leading-relaxed text-muted-foreground">
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
      </section>
    </>
  );
}
