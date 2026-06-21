import type { MetaFunction } from "react-router";
import { AuthCallbackPage } from "@/pages/auth-callback-page";
import { siteConfig } from "@/lib/constants/navigation";

export const meta: MetaFunction = () => [
  { title: `Autenticando… — ${siteConfig.name}` },
  { name: "robots", content: "noindex" },
];

export default function AuthCallback() {
  return <AuthCallbackPage />;
}
