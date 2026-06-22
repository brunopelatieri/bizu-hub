const services = [
  {
    icon: "🤖",
    title: "Desenvolvimento de AI Agents",
    body: "Agentes autônomos com LangChain, LangGraph e MCP Protocol conectando LLMs a fluxos de negócio reais via n8n, APIs e bancos de dados. Do protótipo ao deploy em Docker.",
    tags: ["LangGraph", "MCP", "RAG"],
  },
  {
    icon: "⚙️",
    title: "Automação Inteligente com n8n",
    body: "Workflows integrados a LLMs, WhatsApp (Evolution API), CRMs e bancos. Processos manuais repetitivos viram pipelines inteligentes e auditáveis.",
    tags: ["n8n", "Evolution API", "Webhooks"],
  },
  {
    icon: "🧩",
    title: "SaaS Full Stack",
    body: "Produtos completos com React/Next.js no front, Hono/Node.js no back, Postgres via Drizzle e auth Supabase. Arquitetura escalável com SSR e deploy em VPS.",
    tags: ["Hono", "Drizzle", "Postgres"],
  },
  {
    icon: "🔌",
    title: "Integração de LLMs em produtos",
    body: "Claude, GPT, Gemini, DeepSeek e Grok em sistemas existentes — com RAG, memória de contexto, Prompt Engineering em XML e observabilidade via LangSmith.",
    tags: ["Claude", "GPT", "LangSmith"],
  },
  {
    icon: "🛠️",
    title: "Infraestrutura DevOps",
    body: "Docker Swarm, Traefik com SSL automático, Portainer e MinIO. Deploy de stacks completas de IA (n8n, Dify, Ollama) em VPS própria — como o Setup Orion.",
    tags: ["Docker Swarm", "Traefik", "Portainer"],
  },
  {
    icon: "♻️",
    title: "Migração de legado PHP",
    body: "Sistemas em Zend, CodeIgniter, WordPress e Magento migrados para Node.js, Laravel ou Next.js — sem downtime e com documentação técnica completa.",
    tags: ["PHP", "Laravel", "Next.js"],
  },
];

export function FeaturesSection() {
  return (
    <section
      id="funcionalidades"
      className="border-b border-slate-800/50 bg-slate-900 py-24"
    >
      <div className="mx-auto max-w-5xl px-6">
        <div className="mb-14 text-center">
          <p className="mb-3 font-mono text-sm uppercase tracking-widest text-brand-teal">
            Serviços
          </p>
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-white md:text-4xl">
            Pilares reais de atuação
          </h2>
          <p className="mx-auto max-w-2xl text-slate-400">
            AI Software Engineering aplicada de ponta a ponta: dos agentes
            autônomos à infraestrutura que os sustenta em produção.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <div
              key={s.title}
              className="group rounded-2xl border border-slate-800/50 bg-slate-950/40 p-6 backdrop-blur-md transition-all duration-200 hover:border-brand-teal/40 hover:shadow-lg hover:shadow-brand-teal/5"
            >
              <span className="mb-4 block text-3xl">{s.icon}</span>
              <h3 className="mb-2 font-semibold text-white">{s.title}</h3>
              <p className="mb-4 text-sm leading-relaxed text-slate-400">
                {s.body}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {s.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-md border border-slate-700/60 bg-slate-900/60 px-2 py-0.5 font-mono text-[11px] text-brand-blue"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
