import { useState } from "react";
import { siteConfig } from "@/lib/constants/navigation";

const faqs = [
  {
    question: "Que tipo de projeto o Bruno desenvolve?",
    answer:
      "Agentes de IA e automação inteligente (LangChain, LangGraph, MCP, n8n), SaaS full-stack (React, Hono, Postgres), integração de LLMs em produtos existentes, migração de sistemas legados PHP e infraestrutura DevOps com Docker. Do MVP à produção em VPS.",
  },
  {
    question: "O que diferencia um agente de IA de um chatbot comum?",
    answer:
      "Um chatbot responde scripts. Um agente pensa, decide e age: qualifica leads, agenda, dispara follow-ups, consulta bancos e integra CRMs — com memória de contexto e handoff humano quando necessário. É IA operacional real, não resposta automática.",
  },
  {
    question: "Quais LLMs você integra?",
    answer:
      "Claude (Anthropic), GPT (OpenAI), Gemini (Google), DeepSeek e Grok (xAI), além de modelos locais via Ollama. A escolha do modelo é feita por critério técnico para cada problema — custo, latência e qualidade.",
  },
  {
    question: "Dá para integrar IA num sistema que já existe?",
    answer:
      "Sim. Integro LLMs em produtos em produção com RAG, memória de contexto, Prompt Engineering em XML e observabilidade via LangSmith — sem reescrever tudo. Também migro legado PHP para stacks modernas sem downtime.",
  },
  {
    question: "Como funciona o atendimento via WhatsApp?",
    answer:
      "Uso Evolution API e Meta Cloud API para conectar agentes ao WhatsApp Business. O funil completo — captação, qualificação, atendimento, conversão e pós-venda — roda 24/7 com integração a CRM e Instagram.",
  },
  {
    question: "Você atende remotamente?",
    answer:
      "Sim. Base em Campinas/SP, disponível para projetos remotos no Brasil e no exterior. O canal primário de contato é o WhatsApp — respondo rápido e com proposta de próximos passos.",
  },
];

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-slate-800/60 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between gap-4 py-5 text-left"
        aria-expanded={open}
      >
        <span className="font-medium text-white">{question}</span>
        <span
          aria-hidden="true"
          className={`shrink-0 text-brand-teal transition-transform duration-200 ${open ? "rotate-45" : ""}`}
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
        <div className="pb-5 text-sm leading-relaxed text-slate-400">
          {answer}
        </div>
      )}
    </div>
  );
}

export function FaqSection() {
  return (
    <section className="border-b border-slate-800/50 bg-slate-950 py-24">
      <div className="mx-auto max-w-3xl px-6">
        <div className="mb-14 text-center">
          <p className="mb-3 font-mono text-sm uppercase tracking-widest text-brand-teal">
            FAQ
          </p>
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-white md:text-4xl">
            Perguntas frequentes
          </h2>
          <p className="text-slate-400">
            Não encontrou o que precisava?{" "}
            <a
              href={siteConfig.links.whatsapp}
              target="_blank"
              rel="noreferrer"
              className="text-brand-blue underline-offset-4 hover:underline"
            >
              Fale comigo no WhatsApp
            </a>
            .
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800/50 bg-slate-900/40 px-6 backdrop-blur-md">
          {faqs.map((faq) => (
            <FaqItem key={faq.question} {...faq} />
          ))}
        </div>
      </div>
    </section>
  );
}
