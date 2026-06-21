import type { MetaFunction } from "react-router";
import { ContactPage } from "@/pages/contact-page";
import { siteConfig } from "@/lib/constants/navigation";
import { buildMeta } from "@/lib/seo";

export const meta: MetaFunction = () =>
  buildMeta({
    title: `Contato — ${siteConfig.name}`,
    description:
      "Fale com Bruno Pelatieri Goulart: WhatsApp, e-mail e redes. Projetos de SaaS, automação com IA, agentes e arquitetura full-stack.",
    path: "/contato",
  });

export default function Contact() {
  return <ContactPage />;
}
