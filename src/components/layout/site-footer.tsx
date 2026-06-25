import type { ReactNode } from "react";
import { Link } from "react-router";
import { ArrowUp } from "lucide-react";
import {
  DiscordIcon,
  DockerIcon,
  GithubIcon,
  GitlabIcon,
  InstagramIcon,
  LinkedinIcon,
  TikTokIcon,
  WhatsAppIcon,
  XIcon,
  YoutubeIcon,
} from "@/components/ui/brand-icons";
import { footerChannels, navItems, siteConfig } from "@/lib/constants/navigation";
import { SiteLogo } from "@/components/layout/site-logo";

const channelIcons: Record<string, ReactNode> = {
  YouTube: <YoutubeIcon className="h-4 w-4 shrink-0" />,
  TikTok: <TikTokIcon className="h-4 w-4 shrink-0" />,
  GitHub: <GithubIcon className="h-4 w-4 shrink-0" />,
  GitLab: <GitlabIcon className="h-4 w-4 shrink-0" />,
  "Docker Hub": <DockerIcon className="h-4 w-4 shrink-0" />,
  LinkedIn: <LinkedinIcon className="h-4 w-4 shrink-0" />,
  X: <XIcon className="h-4 w-4 shrink-0" />,
  Instagram: <InstagramIcon className="h-4 w-4 shrink-0" />,
  Discord: <DiscordIcon className="h-4 w-4 shrink-0" />,
  WhatsApp: <WhatsAppIcon className="h-4 w-4 shrink-0" />,
};

function ScrollToTop() {
  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-800/60 bg-slate-900/40 px-3 py-1.5 font-mono text-xs text-slate-400 transition-colors duration-200 hover:border-brand-blue/40 hover:text-brand-blue"
    >
      <ArrowUp className="h-3.5 w-3.5" />
      Voltar ao topo
    </button>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-slate-800/50 bg-slate-950">
      <div className="mx-auto max-w-5xl px-6 py-14">
        <div className="grid gap-10 md:grid-cols-3">
          {/* Coluna 1 — Brand Manifesto */}
          <div className="space-y-4">
            <SiteLogo size="lg" subtitle="AI Automation Specialist" />
            <p className="max-w-xs text-base leading-relaxed text-slate-400">
              Unindo 18+ anos de experiência e atualmente escrevendo código com a inteligência do futuro. Agentes de IA, automação com n8n e arquitetura full-stack do MVP ao deploy em produção.
            </p>
            <span className="inline-block rounded-md border border-slate-800/60 bg-slate-900/60 px-3 py-1 font-mono text-[11px] tracking-wide text-brand-teal">
              Desde 2006 · 18+ Anos CODANDO
            </span>
          </div>

          {/* Coluna 2 — Navegação */}
          <div>
            <p className="mb-4 font-mono text-xs uppercase tracking-widest text-brand-blue">
              Navegação
            </p>
            <ul className="space-y-2.5">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    className="text-sm text-slate-400 transition-colors duration-200 hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li className="pt-1">
                <Link
                  to="/login"
                  className="inline-flex items-center rounded-md border border-slate-700/50 bg-slate-900/30 px-2.5 py-1 text-sm font-medium text-brand-teal/90 transition-colors duration-200 hover:border-brand-teal/40 hover:bg-slate-900/60 hover:text-brand-teal"
                >
                  Acessar
                </Link>
              </li>
            </ul>
          </div>

          {/* Coluna 3 — Canais e Conteúdo */}
          <div>
            <p className="mb-4 font-mono text-xs uppercase tracking-widest text-brand-blue">
              Canais & Conteúdo
            </p>
            <ul className="space-y-2.5">
              {footerChannels.map((channel) => (
                <li key={channel.label}>
                  <a
                    href={channel.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={channel.label}
                    className="group flex items-center gap-2.5 text-sm transition-colors duration-200"
                  >
                    <span className="text-slate-500 transition-colors group-hover:text-brand-teal">
                      {channelIcons[channel.label]}
                    </span>
                    <span className="min-w-0">
                      <span className="block text-xs text-slate-500">
                        {channel.label}
                      </span>
                      <span className="block truncate font-medium text-slate-300 group-hover:text-white">
                        {channel.handle}
                      </span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Linha de base */}
        <div className="mt-12 flex flex-col gap-4 border-t border-slate-800/50 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-xs text-slate-500">
            © 2006–2026 {siteConfig.author.name}. Construído com AI Software
            Engineering
          </p>
          <ScrollToTop />
        </div>
      </div>
    </footer>
  );
}
