import { useState } from "react";
import { siteConfig } from "@/lib/constants/navigation";

const faqs = [
  {
    question: `O que é o ${siteConfig.name}?`,
    answer:
      "É a plataforma pessoal de Bruno Pelatieri Goulart: site profissional, blog e hub autenticado onde clientes acompanham projetos e entregas — tudo integrado em uma única base técnica.",
  },
  {
    question: "Como acesso a área de clientes?",
    answer:
      "Clientes ativos recebem credenciais de acesso. Use o botão 'Área do cliente' ou acesse /login para entrar com e-mail e senha via Supabase Auth.",
  },
  {
    question: "Que serviços o Bruno oferece?",
    answer:
      "Automação enterprise com n8n, arquitetura de IA e agentes autônomos, integrações, DevOps e desenvolvimento full-stack — do MVP à produção em VPS.",
  },
  {
    question: "O blog é atualizado com frequência?",
    answer:
      "Sim. Artigos sobre produtividade, tecnologia, negócios e ferramentas para profissionais digitais. Acesse /blog para ver os posts publicados.",
  },
  {
    question: "Onde a plataforma roda?",
    answer:
      "Deploy em VPS com Docker + Portainer em brunogoulart.com.br.",
  },
  {
    question: "Como contratar um projeto?",
    answer:
      "Pelo formulário de contato em /contato, WhatsApp ou e-mail. Descreva o desafio e retorno com os próximos passos.",
  },
];

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-border/60 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between gap-4 py-5 text-left"
        aria-expanded={open}
      >
        <span className="font-medium text-foreground">{question}</span>
        <span
          aria-hidden="true"
          className={`shrink-0 text-muted-foreground transition-transform duration-200 ${open ? "rotate-45" : ""}`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="h-5 w-5"
          >
            <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
          </svg>
        </span>
      </button>
      {open && (
        <div className="pb-5 text-sm leading-relaxed text-muted-foreground">
          {answer}
        </div>
      )}
    </div>
  );
}

export function FaqSection() {
  return (
    <section className="border-b border-border/50 bg-background py-24">
      <div className="mx-auto max-w-3xl px-6">
        <div className="mb-14 text-center">
          <p className="mb-3 text-sm font-medium uppercase tracking-widest text-primary">
            FAQ
          </p>
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Perguntas frequentes
          </h2>
          <p className="text-muted-foreground">
            Não encontrou o que precisava?{" "}
            <a
              href={siteConfig.links.whatsapp}
              target="_blank"
              rel="noreferrer"
              className="text-primary underline-offset-4 hover:underline"
            >
              Fale comigo
            </a>
            .
          </p>
        </div>

        <div className="rounded-xl border border-border/60 bg-card px-6 shadow-sm">
          {faqs.map((faq) => (
            <FaqItem key={faq.question} {...faq} />
          ))}
        </div>
      </div>
    </section>
  );
}
