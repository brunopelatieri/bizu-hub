import type { MetaFunction } from "react-router";
import { ProjectsPage } from "@/pages/projects-page";
import { siteConfig } from "@/lib/constants/navigation";
import { buildMeta } from "@/lib/seo";

export const meta: MetaFunction = () =>
  buildMeta({
    title: `Projetos — ${siteConfig.name}`,
    description:
      `O propósito do ${siteConfig.name} em detalhe: site pessoal, blog, hub de clientes, arquitetura e stack.`,
    path: "/projetos",
  });

export default function Projects() {
  return <ProjectsPage />;
}
