const audiences = [
  {
    icon: "🚀",
    title: "Empreendedores & Startups",
    body: "Transformo ideias em produtos digitais completos — do MVP ao escalável, com IA integrada que automatiza processos e acelera crescimento real.",
  },
  {
    icon: "📈",
    title: "Investidores",
    body: "Visão de produto e execução técnica comprovada em mercados emergentes (IA, Web3, Automação), com 18+ anos de mercado e fluência multi-LLM.",
  },
  {
    icon: "🏢",
    title: "Empresas",
    body: "Seu time comercial ainda responde lead manualmente? Modernizo sistemas legados e coloco agentes de IA que atendem 24/7, custam menos e escalam sem limite.",
  },
  {
    icon: "💻",
    title: "Devs & Recrutadores",
    body: "Full Stack com profundidade rara — backend, frontend, blockchain, IA e DevOps em um perfil só, com projetos open source verificáveis no GitHub e Docker Hub.",
  },
];

export function AudienceSection() {
  return (
    <section className="border-b border-slate-800/50 bg-slate-950 py-24">
      <div className="mx-auto max-w-5xl px-6">
        <div className="mb-14 text-center">
          <p className="mb-3 font-mono text-sm uppercase tracking-widest text-brand-teal">
            Para quem trabalho
          </p>
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-white md:text-4xl">
            Cada público, uma entrega
          </h2>
          <p className="mx-auto max-w-2xl text-slate-400">
            Mensagem direta, prova verificável e execução comprovada — sem
            promessa vazia.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {audiences.map((a) => (
            <div
              key={a.title}
              className="flex flex-col rounded-2xl border border-slate-800/50 bg-slate-900/40 p-6 backdrop-blur-md transition-colors duration-200 hover:border-brand-indigo/40"
            >
              <span className="mb-4 block text-3xl">{a.icon}</span>
              <h3 className="mb-2 font-semibold text-white">{a.title}</h3>
              <p className="text-sm leading-relaxed text-slate-400">{a.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
