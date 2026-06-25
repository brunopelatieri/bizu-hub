import { Link } from "react-router";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HeroBackground } from "@/components/ui/hero-background";

const stackBadges = [
  "LangChain",
  "LangGraph",
  "MCP",
  "n8n",
  "Claude",
  "GPT",
  "Node.js",
  "React",
];

export function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b border-slate-800/50 bg-slate-950">
      <HeroBackground />
      <div className="relative mx-auto max-w-5xl px-6 py-28 text-center md:py-36">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-slate-700/60 bg-slate-900/60 px-4 py-1.5 text-xs text-slate-300 backdrop-blur-md">
          <Sparkles className="h-3.5 w-3.5 text-brand-teal" />
          <span className="font-mono">18+ anos CODANDO · desde 2006</span>
        </div>

        <h1 className="mx-auto max-w-4xl text-4xl font-bold tracking-tight text-white md:text-6xl">
          Transformo processos em{" "}
          <span className="text-gradient-brand">agentes de IA</span> que
          trabalham 24/7
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-400 md:text-xl">
          Sou <strong className="text-slate-200">Bruno Goulart</strong>, AI
          Automation Specialist & Full Stack Developer. Uno a robustez de 18+
          anos de código à inteligência de LLMs, automação com n8n e
          arquitetura full-stack — do MVP ao deploy em produção.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link to="/contato">
            <Button
              size="lg"
              className="min-w-48 bg-brand-blue text-base font-semibold text-white shadow-lg shadow-brand-blue/25 hover:bg-brand-blue/90"
            >
              Iniciar um projeto
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
          <Link to="/projetos">
            <Button
              variant="outline"
              size="lg"
              className="min-w-48 border-slate-700 bg-slate-900/40 text-base text-slate-200 backdrop-blur-md hover:bg-slate-800/60 hover:text-white"
            >
              Ver projetos
            </Button>
          </Link>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
          {stackBadges.map((tech) => (
            <span
              key={tech}
              className="rounded-full border border-slate-700/60 bg-slate-900/50 px-3 py-1 font-mono text-xs text-slate-300"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Terminal glassmorphism */}
        <div className="relative mx-auto mt-16 max-w-3xl overflow-hidden rounded-xl border border-slate-800/60 bg-slate-900/50 text-left shadow-2xl backdrop-blur-md">
          <div className="flex items-center gap-2 border-b border-slate-800/60 bg-slate-900/60 px-4 py-3">
            <span className="h-3 w-3 rounded-full bg-red-500/70" />
            <span className="h-3 w-3 rounded-full bg-yellow-500/70" />
            <span className="h-3 w-3 rounded-full bg-green-500/70" />
            <span className="ml-3 font-mono text-xs text-slate-500">
              bruno@goulart:~/ai-automation
            </span>
          </div>
          <pre className="overflow-x-auto px-5 py-5 font-mono text-xs leading-relaxed text-slate-300 md:text-sm">
            <span className="text-brand-teal">$</span> deploy agent
            --stack=langgraph,n8n,mcp{"\n"}
            <span className="text-slate-500">
              {"// "}qualificação → atendimento → conversão → CRM
            </span>
            {"\n"}
            <span className="text-brand-blue">✓</span> agente de IA online ·
            WhatsApp + Instagram · 24/7{"\n"}
            <span className="text-brand-indigo">→</span> Claude · GPT · Gemini ·
            DeepSeek · Grok
          </pre>
        </div>
      </div>
    </section>
  );
}
