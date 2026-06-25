import type { ReactNode } from "react";
import { Mail, MapPin } from "lucide-react";
import { ContactForm } from "@/components/contact/contact-form";
import {
  DiscordIcon,
  GithubIcon,
  GitlabIcon,
  LinkedinIcon,
  TikTokIcon,
  WhatsAppIcon,
  YoutubeIcon,
} from "@/components/ui/brand-icons";
import { siteConfig } from "@/lib/constants/navigation";

type Channel = {
  label: string;
  value: string;
  href: string | null;
  icon: ReactNode;
  primary?: boolean;
};

const channels: Channel[] = [
  {
    label: "WhatsApp",
    value: "+55 (19) 9 9249-6598",
    href: siteConfig.links.whatsapp,
    icon: <WhatsAppIcon className="h-5 w-5" />,
    primary: true,
  },
  {
    label: "E-mail",
    value: siteConfig.author.email,
    href: `mailto:${siteConfig.author.email}`,
    icon: <Mail className="h-5 w-5" />,
  },
  {
    label: "LinkedIn",
    value: "bruno-pelatieri-goulart",
    href: siteConfig.links.linkedin,
    icon: <LinkedinIcon className="h-5 w-5" />,
  },
  {
    label: "YouTube",
    value: "@brunopelatieri",
    href: siteConfig.links.youtube,
    icon: <YoutubeIcon className="h-5 w-5" />,
  },
  {
    label: "TikTok",
    value: "@brunopelatieri",
    href: siteConfig.links.tiktok,
    icon: <TikTokIcon className="h-5 w-5" />,
  },
  {
    label: "GitHub",
    value: "@brunopelatieri",
    href: siteConfig.links.github,
    icon: <GithubIcon className="h-5 w-5" />,
  },
  {
    label: "GitLab",
    value: "@brunopelatieri",
    href: siteConfig.links.gitlab,
    icon: <GitlabIcon className="h-5 w-5" />,
  },
  {
    label: "Discord",
    value: "brunopelatieri",
    href: siteConfig.links.discord,
    icon: <DiscordIcon className="h-5 w-5" />,
  },
  {
    label: "Localização",
    value: siteConfig.author.location,
    href: null,
    icon: <MapPin className="h-5 w-5" />,
  },
];

export function ContactPage() {
  return (
    <div className="bg-slate-950">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-slate-800/50 px-6 py-24">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{
            backgroundImage: `linear-gradient(oklch(1 0 0 / 3%) 1px, transparent 1px), linear-gradient(90deg, oklch(1 0 0 / 3%) 1px, transparent 1px)`,
            backgroundSize: "56px 56px",
          }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-96"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 50% -10%, rgba(0,205,186,0.14), transparent 70%)",
          }}
        />
        <div className="relative mx-auto max-w-5xl text-center">
          <p className="mb-3 font-mono text-sm uppercase tracking-widest text-brand-teal">
            Contato
          </p>
          <h1 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight text-white md:text-5xl">
            Vamos construir algo{" "}
            <span className="text-gradient-brand">inteligente</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-400">
            Automação com IA, agentes autônomos, SaaS full-stack ou integração de
            LLMs — descreva seu desafio e retorno com os próximos passos. WhatsApp
            é o canal mais rápido.
          </p>
        </div>
      </section>

      {/* Form + canais */}
      <section className="px-6 py-20">
        <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[1.2fr_1fr]">
          {/* Formulário */}
          <div className="rounded-2xl border border-slate-800/50 bg-slate-900/40 p-7 backdrop-blur-md md:p-9">
            <h2 className="mb-1 text-xl font-semibold text-white">
              Envie uma mensagem
            </h2>
            <p className="mb-7 text-base text-slate-400">
              Resposta normalmente em até 24h úteis.
            </p>
            <ContactForm />
          </div>

          {/* Canais */}
          <div className="space-y-6">
            <div className="rounded-2xl border border-slate-800/50 bg-slate-900/40 p-7 backdrop-blur-md">
              <h2 className="mb-5 text-xl font-semibold text-white">
                Canais diretos
              </h2>
              <ul className="space-y-1">
                {channels.map((channel) => {
                  const content = (
                    <span className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors duration-200">
                      <span
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border ${
                          channel.primary
                            ? "border-brand-teal/40 bg-brand-teal/10 text-brand-teal"
                            : "border-slate-700/60 bg-slate-950/40 text-slate-300"
                        }`}
                      >
                        {channel.icon}
                      </span>
                      <span className="min-w-0">
                        <span className="block font-mono text-xs uppercase tracking-wider text-slate-500">
                          {channel.label}
                        </span>
                        <span className="block truncate text-sm font-medium text-slate-100">
                          {channel.value}
                        </span>
                      </span>
                    </span>
                  );

                  return (
                    <li key={channel.label}>
                      {channel.href ? (
                        <a
                          href={channel.href}
                          target={
                            channel.href.startsWith("mailto")
                              ? undefined
                              : "_blank"
                          }
                          rel="noreferrer"
                          className="block hover:[&>span]:bg-slate-800/50"
                        >
                          {content}
                        </a>
                      ) : (
                        content
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="rounded-2xl border border-brand-blue/20 bg-brand-blue/[0.06] p-7 backdrop-blur-md">
              <p className="font-mono text-sm text-brand-teal">
                Disponível para projetos remotos
              </p>
              <p className="mt-2 text-base leading-relaxed text-slate-400">
                Base em {siteConfig.author.location}. Atendo startups, empresas e
                times técnicos no Brasil e no exterior.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
