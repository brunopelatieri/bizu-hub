import { Link } from "react-router";
import { ArrowRight, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GithubIcon, GitlabIcon, DockerIcon } from "@/components/ui/brand-icons";
import { siteConfig } from "@/lib/constants/navigation";

type Project = {
  emoji: string;
  title: string;
  description: string;
  tags: string[];
  href: string | null;
  linkLabel?: string;
};

const featured: Project[] = [
  {
    emoji: "🏦",
    title: "Phyonext — AI Automation (Crédito + Saúde)",
    description:
      "Agentes de IA para atendimento e qualificação de leads em crédito (consignado, pessoal, empresarial) e recepção virtual para clínicas: agendamento, confirmação e reativação de pacientes. Operação 24/7 via WhatsApp e Instagram com memória de contexto e handoff humano.",
    tags: ["n8n", "LangGraph", "EvoAI", "Evolution API", "Meta Cloud API"],
    href: siteConfig.links.linkedin,
    linkLabel: "Ver no LinkedIn",
  },
  {
    emoji: "🍽️",
    title: "Gestão Inteligente — SaaS para Restaurantes",
    description:
      "Plataforma SaaS que usa agentes de IA e automação para a operação de restaurantes: atendimento, pedidos por voz/chat, análise de cardápio, reservas e controle de estoque com alertas inteligentes. IA operacional real — não um chatbot. Em fase beta.",
    tags: ["Claude", "GPT", "n8n", "Supabase", "Node.js", "React"],
    href: siteConfig.links.linkedin,
    linkLabel: "Ver no LinkedIn",
  },
];

const openSource: Project[] = [
  {
    emoji: "🤖",
    title: "MCP Server para n8n",
    description:
      "Servidor MCP que conecta o Cursor AI ao n8n via chat — cria, edita e executa workflows de automação em linguagem natural. Deploy em Docker Swarm com autenticação por usuário.",
    tags: ["MCP", "n8n", "Docker Swarm"],
    href: siteConfig.links.github,
  },
  {
    emoji: "📅",
    title: "Agente de IA para Google Calendar",
    description:
      "Agente construído com n8n + GPT que gerencia eventos via linguagem natural, com memória de sessão e persistência de dados.",
    tags: ["n8n", "GPT", "Google API"],
    href: siteConfig.links.github,
  },
  {
    emoji: "✍️",
    title: "AI XML Tag Guide",
    description:
      "Guia padronizado para construção de prompts estruturados em XML, compatível com Claude (Anthropic), GPT (OpenAI) e Gemini (Google).",
    tags: ["Prompt Engineering", "XML", "RAG"],
    href: siteConfig.links.github,
  },
  {
    emoji: "🛠️",
    title: "Setup Orion",
    description:
      "Automação completa de infraestrutura VPS: deploy instantâneo de Dify, Ollama, n8n, ActivePieces, Chatwoot, bancos de dados e proxy reverso.",
    tags: ["Docker", "Traefik", "Dify", "Ollama"],
    href: siteConfig.links.github,
  },
  {
    emoji: "⛓️",
    title: "DApps & Smart Contracts",
    description:
      "Aplicações descentralizadas com Solidity + React + Web3.js na Ethereum, incluindo contratos de doação e proteção de links on-chain.",
    tags: ["Solidity", "Ethereum", "Web3.js"],
    href: siteConfig.links.github,
  },
  {
    emoji: "📈",
    title: "Bot de Cripto (Binance)",
    description:
      "Bot inteligente para trading automatizado na Binance integrando blockchain, APIs financeiras e automação de estratégias.",
    tags: ["Python", "Binance API", "Blockchain"],
    href: siteConfig.links.github,
  },
];

const thisPlatform: Project = {
  emoji: "🧩",
  title: "Bizu Hub — esta plataforma",
  description:
    "Site pessoal, blog com SSR e hub de clientes na mesma base full-stack. React Router v7 Framework Mode, API Hono no mesmo processo, Drizzle/Postgres e Supabase Auth. Deploy em VPS com Docker e Portainer.",
  tags: ["React Router v7", "Hono", "Drizzle", "Postgres", "Docker"],
  href: siteConfig.url,
  linkLabel: "Ver ao vivo",
};

function TagList({ tags }: { tags: string[] }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {tags.map((tag) => (
        <span
          key={tag}
          className="rounded-md border border-slate-700/60 bg-slate-900/60 px-2 py-0.5 font-mono text-[11px] text-brand-blue"
        >
          {tag}
        </span>
      ))}
    </div>
  );
}

function ProjectLink({ project }: { project: Project }) {
  if (!project.href) return null;
  return (
    <a
      href={project.href}
      target="_blank"
      rel="noreferrer"
      className="mt-4 inline-flex items-center gap-1.5 font-mono text-sm font-medium text-brand-teal transition hover:opacity-80"
    >
      {project.linkLabel ?? "Ver no GitHub"}
      <ExternalLink className="h-3.5 w-3.5" />
    </a>
  );
}

export function ProjectsPage() {
  return (
    <div className="bg-slate-950">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-slate-800/50 px-6 py-24">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{
            backgroundImage: `linear-gradient(oklch(1 0 0 / 3%) 1px, transparent 1px), linear-gradient(90deg, oklch(1 0 0 / 3%) 1px, transparent 1px)`,
            backgroundSize: "56px 56px",
          }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-96"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 50% -10%, rgba(16,150,230,0.16), transparent 70%)",
          }}
        />
        <div className="relative mx-auto max-w-5xl">
          <p className="mb-3 font-mono text-sm uppercase tracking-widest text-brand-teal">
            Projetos & Cases
          </p>
          <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-white md:text-5xl">
            Da automação de IA ao{" "}
            <span className="text-gradient-brand">full-stack em produção</span>
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-slate-400">
            Projetos reais — comerciais e open source — em IA, automação, Web3 e
            arquitetura full-stack. Código verificável no GitHub e imagens
            publicadas no Docker Hub.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href={siteConfig.links.github} target="_blank" rel="noreferrer">
              <Button className="bg-brand-blue font-semibold text-white shadow-lg shadow-brand-blue/25 hover:bg-brand-blue/90">
                <GithubIcon className="mr-1.5 h-4 w-4" />
                GitHub
              </Button>
            </a>
            <Link to="/contato">
              <Button
                variant="outline"
                className="border-slate-700 bg-slate-900/40 text-slate-200 hover:bg-slate-800/60 hover:text-white"
              >
                Falar comigo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Cases comerciais */}
      <section className="border-b border-slate-800/50 px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-2 text-2xl font-bold tracking-tight text-white md:text-3xl">
            Cases comerciais
          </h2>
          <p className="mb-10 max-w-2xl text-slate-400">
            IA operacional aplicada a verticais reais — crédito, saúde e food
            service.
          </p>
          <div className="grid gap-6 md:grid-cols-2">
            {featured.map((p) => (
              <div
                key={p.title}
                className="flex flex-col rounded-2xl border border-slate-800/50 bg-slate-900/40 p-7 backdrop-blur-md transition-colors duration-200 hover:border-brand-blue/40"
              >
                <span className="mb-4 block text-4xl">{p.emoji}</span>
                <h3 className="mb-2 text-xl font-semibold text-white">
                  {p.title}
                </h3>
                <p className="mb-5 flex-1 text-sm leading-relaxed text-slate-400">
                  {p.description}
                </p>
                <TagList tags={p.tags} />
                <ProjectLink project={p} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open source */}
      <section className="border-b border-slate-800/50 bg-slate-900 px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-2 text-2xl font-bold tracking-tight text-white md:text-3xl">
            Open source & experimentos
          </h2>
          <p className="mb-10 max-w-2xl text-slate-400">
            Repositórios públicos documentados — de servidores MCP a smart
            contracts.
          </p>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {openSource.map((p) => (
              <div
                key={p.title}
                className="flex flex-col rounded-2xl border border-slate-800/50 bg-slate-950/40 p-6 backdrop-blur-md transition-all duration-200 hover:border-brand-teal/40 hover:shadow-lg hover:shadow-brand-teal/5"
              >
                <span className="mb-4 block text-3xl">{p.emoji}</span>
                <h3 className="mb-2 font-semibold text-white">{p.title}</h3>
                <p className="mb-4 flex-1 text-sm leading-relaxed text-slate-400">
                  {p.description}
                </p>
                <TagList tags={p.tags} />
                <ProjectLink project={p} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Esta plataforma */}
      <section className="border-b border-slate-800/50 px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="overflow-hidden rounded-2xl border border-slate-800/50 bg-slate-900/40 backdrop-blur-md md:grid md:grid-cols-[1fr_1.2fr]">
            <div className="border-b border-slate-800/50 bg-slate-950/40 p-7 md:border-b-0 md:border-r">
              <span className="mb-4 block text-4xl">{thisPlatform.emoji}</span>
              <h2 className="mb-2 text-xl font-semibold text-white">
                {thisPlatform.title}
              </h2>
              <p className="mb-5 text-sm leading-relaxed text-slate-400">
                {thisPlatform.description}
              </p>
              <TagList tags={thisPlatform.tags} />
              <ProjectLink project={thisPlatform} />
            </div>
            <div className="p-7">
              <div className="flex items-center gap-2 border-b border-slate-800/60 pb-3 font-mono text-xs text-slate-500">
                <span className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-green-500/70" />
                <span className="ml-2">arquitetura.txt</span>
              </div>
              <pre className="overflow-x-auto pt-4 font-mono text-xs leading-relaxed text-slate-400">
{`Node process único · react-router-hono-server
  |
  |-- /api/*           Hono -> Drizzle -> Postgres
  |-- /, /sobre, /blog SSR + SEO + Open Graph
  |-- /login           Supabase Auth
  \`-- /dashboard/**    client-side, sem dado sensível no SSR`}
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* Links verificáveis */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-10 text-center text-2xl font-bold tracking-tight text-white md:text-3xl">
            Código verificável
          </h2>
          <div className="grid gap-6 sm:grid-cols-3">
            {[
              {
                icon: <GithubIcon className="h-6 w-6" />,
                label: "GitHub",
                desc: "Repositórios públicos, projetos de IA e open source.",
                href: siteConfig.links.github,
              },
              {
                icon: <GitlabIcon className="h-6 w-6" />,
                label: "GitLab",
                desc: "Repositórios e CI/CD — inclusive desta plataforma.",
                href: siteConfig.links.gitlab,
              },
              {
                icon: <DockerIcon className="h-6 w-6" />,
                label: "Docker Hub",
                desc: "Imagens publicadas e prontas para deploy.",
                href: siteConfig.links.dockerhub,
              },
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                className="group rounded-2xl border border-slate-800/50 bg-slate-900/40 p-6 backdrop-blur-md transition-colors duration-200 hover:border-brand-blue/40"
              >
                <span className="mb-4 inline-flex text-brand-blue">
                  {item.icon}
                </span>
                <h3 className="mb-1 flex items-center gap-1.5 font-semibold text-white">
                  {item.label}
                  <ArrowRight className="h-4 w-4 -translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
                </h3>
                <p className="text-sm leading-relaxed text-slate-400">
                  {item.desc}
                </p>
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
