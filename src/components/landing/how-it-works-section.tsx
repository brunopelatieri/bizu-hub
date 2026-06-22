const steps = [
  {
    number: "01",
    verb: "Spec",
    title: "Especificação primeiro",
    body: "Antes de uma linha de código: contexto explícito, requisitos claros e decisões técnicas documentadas. Metodologia Spec-Driven que evita retrabalho e escopo difuso.",
  },
  {
    number: "02",
    verb: "Build",
    title: "Engenharia assistida por IA",
    body: "Arquitetura moderna com contexto vivo para LLMs. Mudanças pequenas, verificáveis e tipadas ponta a ponta — código limpo é requisito, não luxo.",
  },
  {
    number: "03",
    verb: "Automate",
    title: "Agentes e automação",
    body: "Integração de LLMs, agentes LangGraph e workflows n8n nos pontos certos: público SSR, API Hono ou processos operacionais que rodam 24/7.",
  },
  {
    number: "04",
    verb: "Ship",
    title: "Deploy e operação",
    body: "Build de produção enxuto, Docker Swarm com Traefik e SSL, observabilidade e healthcheck. Entrega em VPS própria com rollout controlado.",
  },
];

export function HowItWorksSection() {
  return (
    <section
      id="metodologia"
      className="border-b border-slate-800/50 bg-slate-950 py-24"
    >
      <div className="mx-auto max-w-5xl px-6">
        <div className="mb-14 text-center">
          <p className="mb-3 font-mono text-sm uppercase tracking-widest text-brand-teal">
            Metodologia
          </p>
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-white md:text-4xl">
            AI Software Engineering, do{" "}
            <span className="text-gradient-brand">spec ao ship</span>
          </h2>
          <p className="mx-auto max-w-2xl text-slate-400">
            Um processo estruturado e rastreável — especificação clara, execução
            verificável e deploy confiável.
          </p>
        </div>

        <div className="relative grid gap-8 md:grid-cols-4">
          <div
            aria-hidden="true"
            className="absolute left-0 right-0 top-10 hidden h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent md:block"
          />

          {steps.map((step) => (
            <div
              key={step.number}
              className="relative flex flex-col items-center text-center"
            >
              <div className="relative mb-6 flex h-20 w-20 items-center justify-center rounded-2xl border border-brand-blue/30 bg-slate-900/60 backdrop-blur-md">
                <span className="font-mono text-xl font-bold text-brand-blue">
                  {step.number}
                </span>
              </div>
              <p className="mb-1 font-mono text-xs uppercase tracking-widest text-brand-teal">
                {step.verb}
              </p>
              <h3 className="mb-3 text-lg font-semibold text-white">
                {step.title}
              </h3>
              <p className="text-sm leading-relaxed text-slate-400">
                {step.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
