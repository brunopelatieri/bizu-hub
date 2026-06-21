import type { MetaFunction } from "react-router";
import { LoginPage } from "@/pages/login-page";
import { siteConfig } from "@/lib/constants/navigation";

export const meta: MetaFunction = () => [
  { title: `Entrar — ${siteConfig.name}` },
  { name: "robots", content: "noindex" },
];

export default function Login() {
  return <LoginPage />;
}
