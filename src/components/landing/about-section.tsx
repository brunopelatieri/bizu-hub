import { siteConfig } from "@/lib/constants/navigation";

const painPoints = [
  {
    icon: "🌐",
    title: "Presença profissional fragmentada",
    body: "Site, blog, portfólio e contato espalhados em ferramentas diferentes dificultam a experiência de quem quer conhecer seu trabalho.",
  },
  {
    icon: "🔑",
    title: "Clientes sem um portal central",
    body: "Entregas, status e recursos compartilhados por e-mail ou links soltos geram retrabalho e falta de visibilidade.",
  },
  {
    icon: "⚙️",
    title: "Stack desconectada",
    body: "Manter site público e área logada em plataformas separadas aumenta custo, complexidade e tempo de evolução.",
  },
];

export function AboutSection() {
  return (
    <section className="border-b border-border/50 bg-background py-24">
      <div className="mx-auto max-w-5xl px-6">
        <div className="mb-20">
          <p className="mb-3 text-sm font-medium uppercase tracking-widest text-primary">
            O problema
          </p>
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Presença pública e portal de clientes precisam conviver.
          </h2>
          <p className="mb-12 max-w-2xl text-muted-foreground">
            Quem presta serviços de tecnologia precisa de um lugar para se
            apresentar ao mundo e outro para entregar valor aos clientes — sem
            duplicar esforço.
          </p>
          <div className="grid gap-6 md:grid-cols-3">
            {painPoints.map((p) => (
              <div
                key={p.title}
                className="rounded-xl border border-border/60 bg-card p-6 shadow-sm"
              >
                <span className="mb-4 block text-3xl">{p.icon}</span>
                <h3 className="mb-2 font-semibold text-foreground">
                  {p.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {p.body}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-primary/20 bg-primary/5 p-10 text-center">
          <p className="mb-3 text-sm font-medium uppercase tracking-widest text-primary">
            A solução
          </p>
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Um hub unificado: público por fora, privado por dentro.
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            O <strong className="text-foreground">{siteConfig.name}</strong>{" "}
            concentra site pessoal, blog e área autenticada para clientes na
            mesma base técnica — evoluindo com arquitetura moderna e contexto
            vivo para desenvolvimento assistido por IA.
          </p>
        </div>
      </div>
    </section>
  );
}
