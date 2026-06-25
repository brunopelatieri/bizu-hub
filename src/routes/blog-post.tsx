import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Link } from "react-router";
import { Badge } from "@/components/ui/badge";
import { PostAttachments } from "@/components/blog/post-attachments";
import { PostGallery } from "@/components/blog/post-gallery";
import { PostMedia } from "@/components/blog/post-media";
import { getPostBySlug } from "@/lib/content/posts.server";
import { siteConfig } from "@/lib/constants/navigation";
import { absoluteAsset } from "@/lib/seo";
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
    { title: `${post.title} — ${siteConfig.name}` },
    { name: "description", content: post.excerpt },
    { property: "og:title", content: post.title },
    { property: "og:description", content: post.excerpt },
    { property: "og:type", content: "article" },
    { property: "article:published_time", content: post.publishedAt },
    ...(post.cover
      ? [{ property: "og:image", content: absoluteAsset(post.cover) }]
      : []),
  ];
};

export default function BlogPost({ loaderData }: Route.ComponentProps) {
  const { post } = loaderData;

  return (
    <article className="px-6 py-16">
      <div className="mx-auto max-w-3xl">
        <Link
          to="/blog"
          className="mb-8 inline-block text-sm text-primary underline-offset-4 hover:underline"
        >
          ← Voltar para o blog
        </Link>

        <div className="mb-4 flex items-center gap-2">
          <Badge variant="secondary" className="text-xs">
            {post.tag}
          </Badge>
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
            alt=""
            className="mb-10 aspect-[4/5] w-full rounded-xl border border-border/60 object-cover"
          />
        ) : null}

        <div className="prose prose-invert max-w-none text-base leading-relaxed text-muted-foreground">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {post.content}
          </ReactMarkdown>
        </div>

        <PostGallery images={post.images} />
        <PostMedia items={post.media} />
        <PostAttachments attachments={post.attachments} />
      </div>
    </article>
  );
}
