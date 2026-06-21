const features = [
  {
    icon: "🌐",
    title: "Site pessoal com SSR",
    body: "Landing, sobre, projetos e contato renderizados no servidor, com meta tags e Open Graph para presença profissional indexável.",
  },
  {
    icon: "✍️",
    title: "Blog integrado",
    body: "Artigos com SSR, SEO por rota e estrutura pronta para evoluir de conteúdo estático para posts no Postgres.",
  },
  {
    icon: "🔐",
    title: "Hub de clientes",
    body: "Área autenticada em /dashboard para clientes acompanharem projetos e recursos, sem expor dados sensíveis no HTML público.",
  },
  {
    icon: "🔌",
    title: "API no mesmo processo",
    body: "Hono montado junto do SSR em um único processo Node. Frontend e API compartilham origem, sem proxy extra.",
  },
  {
    icon: "🗄️",
    title: "Postgres via Drizzle",
    body: "Dados da aplicação no seu Postgres, com migrations versionadas e tipagem ponta a ponta.",
  },
  {
    icon: "🐳",
    title: "Deploy em VPS",
    body: "Dockerfile multi-stage para Ubuntu + Docker + Portainer. Um processo, healthcheck e build de produção enxuto.",
  },
];

export function FeaturesSection() {
  return (
    <section
      id="funcionalidades"
      className="border-b border-border/50 bg-muted/30 py-24"
    >
      <div className="mx-auto max-w-5xl px-6">
        <div className="mb-14 text-center">
          <p className="mb-3 text-sm font-medium uppercase tracking-widest text-primary">
            O que compõe a plataforma
          </p>
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Site, blog e hub — na mesma base
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Três frentes integradas com stack full-stack moderna, prontas para
            evoluir conforme novos clientes e conteúdos entram.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="group rounded-xl border border-border/60 bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <span className="mb-4 block text-3xl">{f.icon}</span>
              <h3 className="mb-2 font-semibold text-foreground">{f.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {f.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
