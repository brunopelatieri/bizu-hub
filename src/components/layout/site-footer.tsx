import type { ReactNode } from "react";
import { Link } from "react-router";
import { Mail } from "lucide-react";
import {
  DockerIcon,
  FacebookIcon,
  GithubIcon,
  GitlabIcon,
  InstagramIcon,
  LinkedinIcon,
  TikTokIcon,
  WhatsAppIcon,
  XIcon,
  YoutubeIcon,
} from "@/components/ui/brand-icons";
import { SiteLogo } from "@/components/layout/site-logo";
import { navItems, siteConfig, socialLinks } from "@/lib/constants/navigation";

const brandIcons: Record<string, ReactNode> = {
  LinkedIn: <LinkedinIcon className="h-4 w-4 shrink-0" />,
  GitHub: <GithubIcon className="h-4 w-4 shrink-0" />,
  GitLab: <GitlabIcon className="h-4 w-4 shrink-0" />,
  "Docker Hub": <DockerIcon className="h-4 w-4 shrink-0" />,
  YouTube: <YoutubeIcon className="h-4 w-4 shrink-0" />,
  TikTok: <TikTokIcon className="h-4 w-4 shrink-0" />,
  X: <XIcon className="h-4 w-4 shrink-0" />,
  Instagram: <InstagramIcon className="h-4 w-4 shrink-0" />,
  Facebook: <FacebookIcon className="h-4 w-4 shrink-0" />,
  WhatsApp: <WhatsAppIcon className="h-4 w-4 shrink-0" />,
  "E-mail": <Mail className="h-4 w-4 shrink-0" />,
};

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-border bg-background">
      <div className="mx-auto max-w-5xl px-6 py-12">
        <div className="grid gap-8 md:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <SiteLogo size="md" asLink={false} />
            <p className="mt-3 max-w-sm text-sm text-muted-foreground">
              {siteConfig.description}
            </p>
          </div>

          <div>
            <p className="mb-3 text-sm font-semibold text-foreground">
              Navegação
            </p>
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    className="text-sm text-muted-foreground transition-colors duration-200 hover:text-primary"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-3 text-sm font-semibold text-foreground">
              Redes & contato
            </p>
            <ul className="space-y-2">
              {socialLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={link.label}
                    className="flex items-center gap-2 text-sm text-muted-foreground transition-colors duration-200 hover:text-primary"
                  >
                    {brandIcons[link.label] ?? null}
                    <span>{link.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-border/60 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            © {year} {siteConfig.author.name}. Todos os direitos reservados.
          </p>
          <p className="text-xs text-muted-foreground">
            {siteConfig.author.role}
          </p>
        </div>
      </div>
    </footer>
  );
}
