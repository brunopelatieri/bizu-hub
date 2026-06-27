import { BlogMarkdown } from "@/components/blog/blog-markdown";
import { PostCategoryBadges } from "@/components/blog/post-category-badges";
import { Link } from "react-router";
import { PostAttachments } from "@/components/blog/post-attachments";
import { PostGallery } from "@/components/blog/post-gallery";
import { PostMedia } from "@/components/blog/post-media";
import { getPostBySlug } from "@/lib/content/posts.server";
import { siteConfig } from "@/lib/constants/navigation";
import { buildMeta, absoluteAsset } from "@/lib/seo";
import type { Route } from "./+types/blog-post";

export async function loader({ params }: Route.LoaderArgs) {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    throw new Response("Post não encontrado", { status: 404 });
  }

  return { post };
}

export const meta: Route.MetaFunction = ({ data }) => {
  if (!data?.post) {
    return [{ title: `Post não encontrado — ${siteConfig.name}` }];
  }

  const { post } = data;

  return [
    ...buildMeta({
      title: `${post.title} — ${siteConfig.name}`,
      description: post.excerpt,
      path: `/blog/${post.slug}`,
      type: "article",
      ...(post.cover ? { image: absoluteAsset(post.cover) } : {}),
    }),
    { property: "article:published_time", content: post.publishedAt },
    { property: "article:author", content: "https://brunogoulart.com.br/#author" },
  ];
};

export default function BlogPost({ loaderData }: Route.ComponentProps) {
  const { post } = loaderData;
  const baseUrl = siteConfig.url.replace(/\/$/, "");

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt,
    url: `${baseUrl}/blog/${post.slug}`,
    author: { "@id": "https://brunogoulart.com.br/#author" },
    publisher: { "@id": "https://brunogoulart.com.br/#website" },
    ...(post.cover ? { image: absoluteAsset(post.cover) } : {}),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <article className="px-6 py-16">
      <div className="mx-auto max-w-3xl">
        <Link
          to="/blog"
          className="mb-8 inline-block text-sm text-primary underline-offset-4 hover:underline"
        >
          ← Voltar para o blog
        </Link>

        <div className="mb-4 flex flex-wrap items-center gap-2">
          <PostCategoryBadges categories={post.categories} />
          <span className="text-xs text-muted-foreground">
            {post.readTime} de leitura
          </span>
        </div>

        <h1 className="mb-3 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
          {post.title}
        </h1>

        <time
          dateTime={post.publishedAt}
          className="mb-10 block text-sm text-muted-foreground"
        >
          {post.date}
        </time>

        {post.cover ? (
          <img
            src={post.cover}
            alt={`Capa do post: ${post.title}`}
            className="mb-10 aspect-[4/5] w-full rounded-xl border border-border/60 object-cover"
          />
        ) : null}

        <BlogMarkdown content={post.content} />

        <PostGallery images={post.images} />
        <PostMedia items={post.media} />
        <PostAttachments attachments={post.attachments} />
      </div>
    </article>
    </>
  );
}
