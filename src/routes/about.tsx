import type { MetaFunction } from "react-router";
import { AboutPage } from "@/pages/about-page";
import { siteConfig } from "@/lib/constants/navigation";
import { buildMeta } from "@/lib/seo";

export const meta: MetaFunction = () =>
  buildMeta({
    title: `Sobre — Bruno Pelatieri Goulart | ${siteConfig.title}`,
    description:
      "AI Automation Specialist & Full Stack Developer desde 2006: automação inteligente com n8n, agentes LLM, LangChain, Web3 e arquitetura escalável.",
    path: "/sobre",
  });

export default function About() {
  return <AboutPage />;
}
