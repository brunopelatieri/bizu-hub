const pillars = [
  {
    badge: "BACKEND",
    title: "Da base PHP ao Node.js moderno",
    body: "Comecei em 2006 com PHP, Laravel, CodeIgniter e Zend. Hoje construo APIs de alta performance em Node.js e Python, e migro sistemas legados sem parar a operação.",
  },
  {
    badge: "AI ENGINEERING",
    title: "Agentes autônomos em produção",
    body: "LangChain, LangGraph e MCP Servers conectando Claude, GPT, Gemini, DeepSeek e Grok a fluxos de negócio reais — com RAG, memória de contexto e Prompt Engineering em XML.",
  },
  {
    badge: "AUTOMAÇÃO",
    title: "n8n + IA orquestrando o operacional",
    body: "Workflows que transformam processos manuais em pipelines inteligentes e auditáveis: WhatsApp via Evolution API, CRMs, bancos de dados e disparos automáticos.",
  },
];

export function AboutSection() {
  return (
    <section className="relative border-b border-slate-800/50 bg-slate-950 py-24">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(ellipse 50% 40% at 50% 0%, rgba(60,81,196,0.12), transparent 70%)",
        }}
      />
      <div className="relative mx-auto max-w-5xl px-6">
        <div className="mb-14 max-w-3xl">
          <p className="mb-3 font-mono text-sm uppercase tracking-widest text-brand-teal">
            Quem está por trás
          </p>
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-white md:text-4xl">
            Experiência consolidada unida à{" "}
            <span className="text-gradient-brand">inteligência do futuro</span>
          </h2>
          <p className="text-lg text-slate-400">
            Da era do PHP clássico à arquitetura moderna de AI Agents. 
            Projeto e entrego soluções escaláveis, seguras e inovadoras, 
            integrando LLMs em produtos existentes e construindo do zero 
            arquiteturas orientadas a agentes autônomos.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {pillars.map((p) => (
            <div
              key={p.badge}
              className="rounded-2xl border border-slate-800/50 bg-slate-900/40 p-6 backdrop-blur-md transition-colors duration-200 hover:border-brand-blue/40"
            >
              <span className="mb-4 inline-block rounded-md border border-slate-700/60 bg-slate-950/60 px-2.5 py-1 font-mono text-[11px] tracking-wider text-brand-blue">
                {p.badge}
              </span>
              <h3 className="mb-2 text-lg font-semibold text-white">
                {p.title}
              </h3>
              <p className="text-base leading-relaxed text-slate-400">{p.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
