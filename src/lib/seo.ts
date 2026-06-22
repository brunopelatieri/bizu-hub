import { siteConfig } from "@/lib/constants/navigation";

type SeoInput = {
  title: string;
  description: string;
  path?: string;
  type?: "website" | "article";
  image?: string;
  robots?: string;
};

export function absoluteAsset(path: string) {
  return path.startsWith("http") ? path : `${siteConfig.url}${path}`;
}

export function buildMeta({
  title,
  description,
  path = "/",
  type = "website",
  image,
  robots,
}: SeoInput) {
  const url = path === "/" ? siteConfig.url : `${siteConfig.url}${path}`;
  const ogImageUrl = image ?? absoluteAsset(siteConfig.ogImage);

  const imageTags = [
    { property: "og:image", content: ogImageUrl },
    { property: "og:image:type", content: "image/webp" },
    { name: "twitter:image", content: ogImageUrl },
    { name: "twitter:card", content: "summary_large_image" },
  ];

  return [
    { title },
    { name: "description", content: description },
    ...(robots ? [{ name: "robots", content: robots }] : []),
    { property: "og:site_name", content: siteConfig.name },
    { property: "og:locale", content: "pt_BR" },
    { property: "og:type", content: type },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:url", content: url },
    ...imageTags,
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:creator", content: "@brunopelatieri" },
    { tagName: "link", rel: "canonical", href: url },
  ];
}
