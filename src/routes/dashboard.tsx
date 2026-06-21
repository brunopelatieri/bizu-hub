import type { MetaFunction } from "react-router";
import { DashboardPage } from "@/pages/dashboard-page";
import { siteConfig } from "@/lib/constants/navigation";

export const meta: MetaFunction = () => [
  { title: `Dashboard — ${siteConfig.name}` },
  { name: "robots", content: "noindex" },
];

export default function Dashboard() {
  return <DashboardPage />;
}
