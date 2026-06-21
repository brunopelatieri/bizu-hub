import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/constants/navigation";

export function CtaSection() {
  return (
    <section className="bg-background py-24">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <div className="rounded-2xl border border-primary/20 bg-primary/5 px-8 py-16 shadow-sm">
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Vamos conversar sobre seu projeto?
          </h2>
          <p className="mx-auto mb-8 max-w-xl text-lg text-muted-foreground">
            Automação, IA, integrações ou arquitetura full-stack — entre em
            contato ou acesse o hub se você já é cliente.
          </p>

          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link to="/contato">
              <Button size="lg" className="min-w-48 text-base font-semibold">
                Falar comigo
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" size="lg" className="min-w-48 text-base">
                Área do cliente
              </Button>
            </Link>
          </div>

          <p className="mt-5 text-sm text-muted-foreground">
            {siteConfig.author.name} · {siteConfig.author.role}
          </p>
        </div>
      </div>
    </section>
  );
}
