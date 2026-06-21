import type { Project } from "@/types/project";
import { siteConfig } from "@/lib/constants/navigation";

export const sampleProjects: Project[] = [
  {
    id: "1",
    title: siteConfig.name,
    description:
      "Plataforma pessoal com site, blog e hub de clientes — automação, IA e arquitetura full-stack.",
    href: siteConfig.url,
    tags: ["React Router", "Hono", "Drizzle", "Supabase"],
  },
  {
    id: "2",
    title: "Projeto exemplo",
    description:
      "[A DEFINIR] Descreva um case real, resultado alcançado e tecnologias usadas.",
    href: "https://github.com/brunopelatieri",
    tags: ["React", "API"],
  },
];
