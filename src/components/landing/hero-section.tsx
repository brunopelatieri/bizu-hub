import { Link } from "react-router";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/constants/navigation";

const stackBadges = [
  "Automação",
  "IA",
  "n8n",
  "Full Stack",
  "DevOps",
  "Web3",
];

export function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b border-border/50 bg-background">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:56px_56px] opacity-40"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,oklch(0.74_0.14_230/15%),transparent)]"
      />

      <div className="relative mx-auto max-w-5xl px-6 py-28 text-center md:py-36">
        <Badge variant="outline" className="mb-6 gap-2 px-3 py-1.5 text-xs">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary" />
          Site pessoal · Blog · Hub de clientes
        </Badge>

        <h1 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight text-foreground md:text-6xl">
          Tecnologia, automação e IA —{" "}
          <span className="text-primary">na prática.</span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl">
          O <strong className="text-foreground">{siteConfig.name}</strong> reúne
          minha presença profissional, blog e portal onde clientes acompanham
          projetos, entregas e recursos — tudo em uma plataforma integrada.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link to="/sobre">
            <Button size="lg" className="min-w-44 text-base font-semibold">
              Sobre mim
            </Button>
          </Link>
          <Link to="/login">
            <Button variant="outline" size="lg" className="min-w-44 text-base">
              Área do cliente
            </Button>
          </Link>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
          {stackBadges.map((tech) => (
            <span
              key={tech}
              className="rounded-full border border-border/60 bg-muted/40 px-3 py-1 text-xs text-muted-foreground"
            >
              {tech}
            </span>
          ))}
        </div>

        <div className="relative mx-auto mt-16 max-w-4xl overflow-hidden rounded-xl border border-border/60 bg-card shadow-2xl">
          <div className="flex items-center gap-2 border-b border-border/60 bg-muted/40 px-4 py-3">
            <span className="h-3 w-3 rounded-full bg-destructive/70" />
            <span className="h-3 w-3 rounded-full bg-yellow-500/70" />
            <span className="h-3 w-3 rounded-full bg-green-500/70" />
            <span className="ml-3 text-xs text-muted-foreground">
              {new URL(siteConfig.url).host}
            </span>
          </div>
          <img
            src={siteConfig.screenshot}
            alt={`Preview do ${siteConfig.name}`}
            className="block w-full object-cover object-top"
          />
        </div>
      </div>
    </section>
  );
}
