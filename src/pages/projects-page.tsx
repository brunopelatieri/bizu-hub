import { Link } from "react-router";
import { PageHero } from "@/components/layout/page-hero";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { siteConfig } from "@/lib/constants/navigation";

const platformAreas = [
  "Site pessoal (SSR)",
  "Blog com SEO",
  "Hub de clientes",
  "Formulário de contato",
  "Auth Supabase",
  "API Hono + Drizzle",
];

const readyModules = [
  {
    title: "Site e blog públicos",
    body: "Landing, sobre, projetos, contato e blog renderizados no servidor, com meta tags e Open Graph dinâmico por rota.",
  },
  {
    title: "Hub de clientes",
    body: "Dashboard autenticado client-side em /dashboard/** — login via Supabase Auth, sem dados sensíveis no HTML inicial.",
  },
  {
    title: "API Hono integrada",
    body: "Endpoints em /api/* no mesmo processo do SSR, validados com Zod e persistindo no Postgres via Drizzle.",
  },
  {
    title: "Base técnica",
    body: "shadcn/ui + Tailwind v4, tema dark/light, formulários, estado com Zustand e deploy Docker para VPS.",
  },
];

const docs = [
  {
    label: "Produção",
    description:
      "Site em brunogoulart.com.br — VPS Ubuntu, Docker, Portainer e imagem no GitLab Container Registry.",
    href: siteConfig.url,
  },
  {
    label: "Código-fonte",
    description:
      "Repositório e imagem Docker no GitLab — React Router v7, Hono, Drizzle e Supabase auxiliar.",
    href: siteConfig.links.repo,
  },
  {
    label: "Guia de deploy",
    description:
      "Build, push GitLab Registry e stack Portainer documentados em deploy/README.md.",
    href: `${siteConfig.links.repo}/-/tree/main/deploy`,
  },
];

export function ProjectsPage() {
  return (
    <>
      <PageHero
        eyebrow="A plataforma"
        title={siteConfig.name}
        description={siteConfig.description}
        actions={
          <>
            <a href={siteConfig.links.demo} target="_blank" rel="noreferrer">
              <Button>Ver ao vivo</Button>
            </a>
            <Link to="/contato">
              <Button variant="outline">Falar comigo</Button>
            </Link>
          </>
        }
      />

      <section className="px-6 py-16">
        <div className="mx-auto max-w-3xl space-y-5 text-muted-foreground">
          <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            O propósito
          </h2>
          <p>
            O <strong className="text-foreground">{siteConfig.name}</strong> é a
            plataforma pessoal de Bruno Pelatieri Goulart — reúne presença
            profissional pública, blog e portal autenticado para clientes na
            mesma base técnica full-stack.
          </p>
          <p>
            A arquitetura separa o que é indexável (site e blog com SSR) do que
            é privado (hub de clientes client-side), mantendo segurança e
            evolução rápida com metodologia de{" "}
            <strong className="text-foreground">AI Software Engineering</strong>.
          </p>
        </div>
      </section>

      <section className="border-t border-border/50 bg-muted/30 px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-4 text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            O que compõe a plataforma
          </h2>
          <p className="mb-8 max-w-2xl text-muted-foreground">
            Três frentes integradas na mesma stack.
          </p>
          <div className="flex flex-wrap gap-2">
            {platformAreas.map((item) => (
              <span
                key={item}
                className="rounded-full border border-border/60 bg-card px-4 py-1.5 text-sm text-muted-foreground"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-10 text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            Arquitetura e módulos
          </h2>

          <div className="mb-10 overflow-hidden rounded-xl border border-border/60 bg-card shadow-sm">
            <div className="border-b border-border/60 bg-muted/40 px-5 py-3 text-xs text-muted-foreground">
              Node process único · react-router-hono-server
            </div>
            <pre className="overflow-x-auto px-5 py-5 text-xs leading-relaxed text-muted-foreground">
{`React Router v7 Framework Mode + SSR global
  |
  |-- /api/*              Hono API -> Drizzle -> Postgres
  |-- /, /sobre, /blog    rotas públicas com SSR e SEO
  |-- /login              Supabase Auth
  \`-- /dashboard/**       client-side, sem loader sensível no servidor`}
            </pre>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {readyModules.map((module) => (
              <div
                key={module.title}
                className="rounded-xl border border-border/60 bg-card p-6 shadow-sm"
              >
                <h3 className="mb-2 font-semibold text-foreground">
                  {module.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {module.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border/50 bg-muted/30 px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-4 text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            Deploy e repositório
          </h2>
          <p className="mb-8 max-w-2xl text-muted-foreground">
            Produção em{" "}
            <strong className="text-foreground">brunogoulart.com.br</strong> —
            VPS Ubuntu com Docker, Portainer e imagem no GitLab Container Registry.
          </p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {docs.map((doc) => (
              <Card key={doc.label}>
                <CardHeader>
                  <CardTitle>{doc.label}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {doc.description}
                  </p>
                  <a
                    href={doc.href}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm font-medium text-primary transition hover:opacity-80"
                  >
                    Acessar →
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
