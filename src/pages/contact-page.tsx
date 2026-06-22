import type { ReactNode } from "react";
import { Mail, MapPin, MessageCircle } from "lucide-react";
import {
  FacebookIcon,
  GithubIcon,
  InstagramIcon,
  LinkedinIcon,
  TikTokIcon,
  XIcon,
  YoutubeIcon,
} from "@/components/ui/brand-icons";
import { ContactForm } from "@/components/contact/contact-form";
import { PageHero } from "@/components/layout/page-hero";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { siteConfig } from "@/lib/constants/navigation";

type Channel = {
  label: string;
  value: string;
  href: string | null;
  icon: ReactNode;
};

const channels: Channel[] = [
  {
    label: "WhatsApp",
    value: "+55 (19) 9 9249-6598",
    href: siteConfig.links.whatsapp,
    icon: <MessageCircle className="h-4 w-4 shrink-0" />,
  },
  {
    label: "E-mail",
    value: siteConfig.author.email,
    href: `mailto:${siteConfig.author.email}`,
    icon: <Mail className="h-4 w-4 shrink-0" />,
  },
  {
    label: "Localização",
    value: siteConfig.author.location,
    href: null,
    icon: <MapPin className="h-4 w-4 shrink-0" />,
  },
  {
    label: "LinkedIn",
    value: "in/bruno-pelatieri-goulart",
    href: siteConfig.links.linkedin,
    icon: <LinkedinIcon className="h-4 w-4 shrink-0" />,
  },
  {
    label: "GitHub",
    value: "@brunopelatieri",
    href: siteConfig.links.github,
    icon: <GithubIcon className="h-4 w-4 shrink-0" />,
  },
  {
    label: "YouTube",
    value: "@devgalactico",
    href: siteConfig.links.youtube,
    icon: <YoutubeIcon className="h-4 w-4 shrink-0" />,
  },
  {
    label: "TikTok",
    value: "@brunopelatieri",
    href: siteConfig.links.tiktok,
    icon: <TikTokIcon className="h-4 w-4 shrink-0" />,
  },
  {
    label: "Instagram",
    value: "@brunopelatieri",
    href: siteConfig.links.instagram,
    icon: <InstagramIcon className="h-4 w-4 shrink-0" />,
  },
  {
    label: "X",
    value: "@brunopelatieri",
    href: siteConfig.links.x,
    icon: <XIcon className="h-4 w-4 shrink-0" />,
  },
  {
    label: "Facebook",
    value: "bruno.pelatierigoulart",
    href: siteConfig.links.facebook,
    icon: <FacebookIcon className="h-4 w-4 shrink-0" />,
  },
];

export function ContactPage() {
  return (
    <>
      <PageHero
        title="Contato"
        description="Vamos conversar sobre seu próximo projeto de SaaS, automação com IA ou arquitetura full-stack."
      />
      <section className="px-6 py-12">
        <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <ContactForm />
          <Card>
            <CardHeader>
              <CardTitle>Canais diretos</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm">
                {channels.map((channel) => (
                  <li key={channel.label} className="flex items-center gap-3">
                    <span className="shrink-0 text-muted-foreground">
                      {channel.icon}
                    </span>
                    {channel.href ? (
                      <a
                        href={channel.href}
                        target={
                          channel.href.startsWith("mailto")
                            ? undefined
                            : "_blank"
                        }
                        rel="noreferrer"
                        className="truncate font-medium text-primary transition-colors duration-200 hover:opacity-80"
                      >
                        {channel.value}
                      </a>
                    ) : (
                      <span className="truncate text-foreground">
                        {channel.value}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  );
}
