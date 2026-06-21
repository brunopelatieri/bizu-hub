const steps = [
  {
    number: "01",
    verb: "Site",
    title: "Presença profissional",
    body: "Landing, sobre, projetos e contato — tudo indexável com SSR e SEO para quem quer conhecer meu trabalho e contratar.",
  },
  {
    number: "02",
    verb: "Blog",
    title: "Conteúdo e autoridade",
    body: "Artigos publicados com meta tags e Open Graph. Insights sobre IA, automação, produtividade e arquitetura de software.",
  },
  {
    number: "03",
    verb: "Hub",
    title: "Portal de clientes",
    body: "Login seguro via Supabase Auth e dashboard client-side para acompanhar projetos, entregas e recursos exclusivos.",
  },
];

export function HowItWorksSection() {
  return (
    <section
      id="metodologia"
      className="border-b border-border/50 bg-background py-24"
    >
      <div className="mx-auto max-w-5xl px-6">
        <div className="mb-14 text-center">
          <p className="mb-3 text-sm font-medium uppercase tracking-widest text-primary">
            Como funciona
          </p>
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Três frentes, uma plataforma
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            O visitante explora o site e o blog; o cliente entra no hub com
            credenciais próprias — cada um no lugar certo.
          </p>
        </div>

        <div className="relative grid gap-8 md:grid-cols-3">
          <div
            aria-hidden="true"
            className="absolute left-0 right-0 top-10 hidden h-px bg-gradient-to-r from-transparent via-border to-transparent md:block"
          />

          {steps.map((step) => (
            <div
              key={step.number}
              className="relative flex flex-col items-center text-center"
            >
              <div className="relative mb-6 flex h-20 w-20 items-center justify-center rounded-2xl border-2 border-primary/30 bg-primary/10 shadow-sm">
                <span className="text-xl font-bold text-primary">
                  {step.number}
                </span>
              </div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-primary">
                {step.verb}
              </p>
              <h3 className="mb-3 text-lg font-semibold text-foreground">
                {step.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {step.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
