import type { MetaFunction } from "react-router";
import { HomePage } from "@/pages/home-page";
import { siteConfig } from "@/lib/constants/navigation";
import { buildMeta } from "@/lib/seo";
export const meta: MetaFunction = () =>
  buildMeta({
    title: siteConfig.title,
    description: siteConfig.description,
    path: "/",
    image: `${siteConfig.url}${siteConfig.logo}`,
  });

export default function Home() {
  return <HomePage />;
}
