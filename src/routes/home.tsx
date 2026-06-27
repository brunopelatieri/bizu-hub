import type { MetaFunction } from "react-router";
import { HomePage } from "@/pages/home-page";
import { getAllPosts } from "@/lib/content/posts.server";
import { siteConfig } from "@/lib/constants/navigation";
import { buildMeta } from "@/lib/seo";
import type { Route } from "./+types/home";

export async function loader() {
  const posts = await getAllPosts();
  return { recentPosts: posts.slice(0, 3) };
}

export const meta: MetaFunction = () =>
  buildMeta({
    title: siteConfig.title,
    description: siteConfig.description,
    path: "/",
  });

export default function Home({ loaderData }: Route.ComponentProps) {
  return <HomePage recentPosts={loaderData.recentPosts} />;
}
