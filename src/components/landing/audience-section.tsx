const audiences = [
  {
    icon: "👋",
    title: "Visitantes",
    body: "Conheça meu trabalho em automação, IA, n8n e arquitetura full-stack — e entre em contato para novos projetos.",
  },
  {
    icon: "📖",
    title: "Leitores do blog",
    body: "Artigos sobre produtividade, tecnologia, negócios e ferramentas — conteúdo prático para profissionais digitais.",
  },
  {
    icon: "🤝",
    title: "Clientes ativos",
    body: "Acesse o hub autenticado para acompanhar entregas, status de projetos e materiais compartilhados.",
  },
  {
    icon: "🏢",
    title: "Empresas e parceiros",
    body: "Busca por automação enterprise, agentes de IA, integrações e arquitetura escalável com execução comprovada.",
  },
];

export function AudienceSection() {
  return (
    <section className="border-b border-border/50 bg-muted/30 py-24">
      <div className="mx-auto max-w-5xl px-6">
        <div className="mb-14 text-center">
          <p className="mb-3 text-sm font-medium uppercase tracking-widest text-primary">
            Para quem é
          </p>
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Público aberto, relacionamento privado
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            A parte pública atrai e informa; o hub de clientes entrega valor
            exclusivo para quem já trabalha comigo.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {audiences.map((a) => (
            <div
              key={a.title}
              className="flex flex-col rounded-xl border border-border/60 bg-card p-6 shadow-sm"
            >
              <span className="mb-4 block text-3xl">{a.icon}</span>
              <h3 className="mb-2 font-semibold text-foreground">{a.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {a.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
