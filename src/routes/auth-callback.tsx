import type { MetaFunction } from "react-router";
import { AuthCallbackPage } from "@/pages/auth-callback-page";

export const meta: MetaFunction = () => [
  { title: "Autenticando… — Bizu SaaS" },
  { name: "robots", content: "noindex" },
];

export default function AuthCallback() {
  return <AuthCallbackPage />;
}
