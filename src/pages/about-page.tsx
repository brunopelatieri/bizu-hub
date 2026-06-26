import { Link } from "react-router";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/constants/navigation";

const timeline = [
  {
    year: "2006",
    title: "O início com PHP clássico",
    body: "Primeiros sistemas robustos com PHP, CodeIgniter, Zend Framework e Laravel. Base sólida em desenvolvimento web e arquitetura de sistemas.",
  },
  {
    year: "2012+",
    title: "Expansão Full Stack",
    body: "Node.js, Express, React e Next.js. APIs de alta performance, interfaces modernas e migração de sistemas legados para stacks atuais.",
  },
  {
    year: "2018+",
    title: "Dados, DevOps & Web3",
    body: "PostgreSQL, MongoDB, Redis e Supabase. Docker, Docker Swarm, Traefik e Portainer. Solidity, Ethereum, DApps e smart contracts.",
  },
  {
    year: "2023+",
    title: "Engenharia de IA & Agentes",
    body: "LangChain, LangGraph, MCP Servers e Prompt Engineering em XML. Integração de Claude, GPT, Gemini, DeepSeek e Grok em produtos reais.",
  },
  {
    year: "2025",
    title: "AI Automation Specialist",
    body: "Foco em automação inteligente aplicada a crédito, saúde e food service. Agentes autônomos que atendem, qualificam e convertem 24/7.",
  },
];

const philosophy = [
  {
    title: "Especificação primeiro",
    body: "Spec-Driven Development: contexto explícito e decisões documentadas antes do código. Menos retrabalho, mais previsibilidade.",
  },
  {
    title: "Código limpo é requisito",
    body: "TypeScript estrito, schemas Zod compartilhados e mudanças pequenas e verificáveis. Qualidade não é negociável.",
  },
  {
    title: "Contexto vivo para LLMs",
    body: "Arquitetura preparada para desenvolvimento assistido por IA. Documentação rastreável que humanos e agentes entendem.",
  },
];

const stats = [
  { value: "18+", label: "anos CODANDO" },
  { value: "2006", label: "início da carreira" },
  { value: "5", label: "LLMs em produção" },
  { value: "∞", label: "agentes rodando 24/7" },
];

export function AboutPage() {
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
              "radial-gradient(ellipse 60% 50% at 50% -10%, rgba(60,81,196,0.16), transparent 70%)",
          }}
        />
        <div className="relative mx-auto grid max-w-5xl gap-10 md:grid-cols-[260px_1fr] md:items-center">
          <div className="mx-auto w-full max-w-[260px]">
            <div className="relative">
              <div
                aria-hidden="true"
                className="absolute -inset-2 rounded-3xl opacity-40 blur-xl"
                style={{
                  background:
                    "linear-gradient(135deg, #1096E6, #3C51C4, #00CDBA)",
                }}
              />
              <img
                src={siteConfig.author.photo}
                alt={siteConfig.author.name}
                className="relative aspect-square w-full rounded-2xl border border-slate-800 object-cover shadow-2xl"
              />
            </div>
          </div>
          <div>
            <p className="mb-3 font-mono text-sm uppercase tracking-widest text-brand-teal">
              Sobre · Bruno Pelatieri Goulart
            </p>
            <h1 className="text-4xl font-bold tracking-tight text-white md:text-5xl">
              AI Automation Specialist &{" "}
              <span className="text-gradient-brand">Full Stack Developer</span>
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-slate-400">
              Desenvolvedor Full Stack com 18+ anos de experiência, da era do
              PHP clássico à arquitetura moderna de AI Agents. Projeto e entrego
              soluções que unem engenharia de software consolidada ao que há de
              mais atual em Inteligência Artificial, automação e Web3.
            </p>
            <p className="mt-4 font-mono text-sm text-slate-500">
              📍 {siteConfig.author.location} · disponível remotamente
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-slate-800/50 px-6 py-12">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-6 md:grid-cols-4">
          {stats.map((s) => (
            <div
              key={s.label}
              className="rounded-2xl border border-slate-800/50 bg-slate-900/40 p-6 text-center backdrop-blur-md"
            >
              <p className="font-mono text-3xl font-bold text-gradient-brand">
                {s.value}
              </p>
              <p className="mt-1 text-base text-slate-400">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Narrativa */}
      <section className="border-b border-slate-800/50 px-6 py-20">
        <div className="mx-auto max-w-3xl space-y-5 text-slate-400">
          <h2 className="text-2xl font-bold tracking-tight text-white md:text-3xl">
            A jornada: PHP → Node.js/React →{" "}
            <span className="text-gradient-brand">AI Agents</span>
          </h2>
          <p>
            Comecei em 2006 construindo sistemas robustos com PHP, Laravel,
            CodeIgniter e Zend Framework. Ao longo dos anos, expandi para
            tecnologias modernas de alto impacto. Do backend ao frontend,
            automação inteligente, engenharia de IA e blockchain.
          </p>
          <p>
            Minha paixão está em criar soluções{" "}
            <strong className="text-slate-200">
              escaláveis, seguras e inovadoras
            </strong>
            . Migro sistemas legados sem parar a operação, integro LLMs em
            produtos existentes e construo do zero arquiteturas orientadas a
            agentes autônomos.
          </p>
          <p>
            <strong className="text-slate-200">Atualmente</strong>, meu foco está
            em DApps, APIs de alta performance, automação inteligente com n8n e
            LangChain, construção de agentes de IA com LLMs (Claude, GPT, Gemini,
            DeepSeek, Grok) e desenvolvimento de servidores MCP para conectar IA
            a fluxos de negócio reais.
          </p>
        </div>
      </section>

      {/* Timeline */}
      <section className="border-b border-slate-800/50 bg-slate-900 px-6 py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-12 text-2xl font-bold tracking-tight text-white md:text-3xl">
            Linha do tempo
          </h2>
          <div className="relative space-y-8 border-l border-slate-800 pl-8">
            {timeline.map((item) => (
              <div key={item.year} className="relative">
                <span
                  aria-hidden="true"
                  className="absolute -left-[39px] flex h-5 w-5 items-center justify-center rounded-full border border-brand-blue/50 bg-slate-950"
                >
                  <span className="h-2 w-2 rounded-full bg-brand-teal" />
                </span>
                <p className="mb-1 font-mono text-sm font-bold text-brand-blue">
                  {item.year}
                </p>
                <h3 className="mb-1 text-lg font-semibold text-white">
                  {item.title}
                </h3>
                <p className="text-base leading-relaxed text-slate-400">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Filosofia */}
      <section className="border-b border-slate-800/50 px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 text-center">
            <p className="mb-3 font-mono text-sm uppercase tracking-widest text-brand-teal">
              Filosofia de trabalho
            </p>
            <h2 className="text-2xl font-bold tracking-tight text-white md:text-3xl">
              Rigor de engenharia, velocidade de IA
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {philosophy.map((p) => (
              <div
                key={p.title}
                className="rounded-2xl border border-slate-800/50 bg-slate-900/40 p-6 backdrop-blur-md"
              >
                <h3 className="mb-2 font-semibold text-white">{p.title}</h3>
                <p className="text-base leading-relaxed text-slate-400">
                  {p.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Citação + CTA */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <blockquote className="text-xl font-medium italic text-white md:text-2xl">
            &ldquo;Unindo 18 anos de código com a inteligência do futuro. Construindo hoje o que o mercado precisará amanhã.&rdquo;
          </blockquote>
          <p className="mt-4 font-mono text-sm text-slate-500">
            {siteConfig.author.role}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/projetos">
              <Button
                size="lg"
                className="bg-brand-blue font-semibold text-white shadow-lg shadow-brand-blue/25 hover:bg-brand-blue/90"
              >
                Ver projetos
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/contato">
              <Button
                variant="outline"
                size="lg"
                className="border-slate-700 bg-slate-900/40 text-slate-200 hover:bg-slate-800/60 hover:text-white"
              >
                Falar comigo
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
