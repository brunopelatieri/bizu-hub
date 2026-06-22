import type { MetaFunction } from "react-router";
import { ProjectsPage } from "@/pages/projects-page";
import { siteConfig } from "@/lib/constants/navigation";
import { buildMeta } from "@/lib/seo";

export const meta: MetaFunction = () =>
  buildMeta({
    title: `Projetos — ${siteConfig.title}`,
    description:
      "Cases e projetos de Bruno Goulart: automação com IA, SaaS, agentes LLM, arquitetura full-stack e hub de clientes.",
    path: "/projetos",
  });

export default function Projects() {
  return <ProjectsPage />;
}
