import { Link } from "react-router";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/constants/navigation";
import { trackCTAClick } from "@/lib/gtm/events";

export function CtaSection() {
  return (
    <section className="bg-slate-950 py-24">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <div className="relative overflow-hidden rounded-3xl border border-slate-800/50 bg-slate-900/40 px-8 py-16 backdrop-blur-md">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-px"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(16,150,230,0.6), rgba(0,205,186,0.6), transparent)",
            }}
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-24 left-1/2 h-48 w-72 -translate-x-1/2 rounded-full blur-3xl"
            style={{ background: "rgba(60,81,196,0.15)" }}
          />

          <p className="relative mb-3 font-mono text-sm uppercase tracking-widest text-brand-teal">
            Vamos construir
          </p>
          <h2 className="relative mb-4 text-3xl font-bold tracking-tight text-white md:text-4xl">
            Seu produto ainda não tem{" "}
            <span className="text-gradient-brand">IA no atendimento?</span>
          </h2>
          <p className="relative mx-auto mb-8 max-w-xl text-lg text-slate-400">
            Agentes que trabalham 24/7, custam menos que um funcionário e escalam
            sem limite. Me conte seu desafio — retorno com os próximos passos.
          </p>

          <div className="relative flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link to="/contato">
              <Button
                size="lg"
                className="min-w-48 bg-brand-blue text-base font-semibold text-white shadow-lg shadow-brand-blue/25 hover:bg-brand-blue/90"
                onClick={() => trackCTAClick("cta_section_fale_especialista")}
              >
                Falar comigo
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
            <a href={siteConfig.links.whatsapp} target="_blank" rel="noreferrer">
              <Button
                variant="outline"
                size="lg"
                className="min-w-48 border-slate-700 bg-slate-900/40 text-base text-slate-200 hover:bg-slate-800/60 hover:text-white"
              >
                WhatsApp direto
              </Button>
            </a>
          </div>

          <p className="relative mt-5 font-mono text-sm text-slate-500">
            {siteConfig.author.name} · {siteConfig.author.role}
          </p>
        </div>
      </div>
    </section>
  );
}
