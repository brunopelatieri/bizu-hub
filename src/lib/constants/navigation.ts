export const siteConfig = {
  name: "Bizu Hub Bruno Goulart",
  description:
    "Site pessoal, blog e hub de clientes de Bruno Pelatieri Goulart — automação, IA e arquitetura full-stack.",
  locale: "pt-BR",
  url: "https://brunogoulart.com.br",
  logo: "/bizu_bru_ia.png",
  favicon: "/favicon.ico",
  screenshot: "/bizu_bru_ia_screenshot.webp",
  author: {
    name: "Bruno Pelatieri Goulart",
    role: "Enterprise Automation Architect • AI • DevOps • n8n Specialist",
    email: "brunopelatieri@gmail.com",
    phone: "+55 (19) 99249-6598",
    photo: "/bruno_pelatieri_goulart_bizu_bru_ia.webp",
  },
  links: {
    demo: "https://brunogoulart.com.br",
    repo: "https://gitlab.com/brunopelatieri/bizu-hub",
    github: "https://github.com/brunopelatieri",
    linkedin: "https://www.linkedin.com/in/bruno-pelatieri-goulart/",
    youtube: "https://www.youtube.com/@devgalactico",
    x: "https://x.com/brunopelatieri",
    instagram: "https://www.instagram.com/brunopelatieri/",
    tiktok: "https://www.tiktok.com/@brunopelatieri",
    whatsapp: "https://wa.me/5519992496598",
  },
} as const;

export const navItems = [
  { href: "/", label: "Início" },
  { href: "/sobre", label: "Sobre" },
  { href: "/projetos", label: "Projetos" },
  { href: "/blog", label: "Blog" },
  { href: "/contato", label: "Contato" },
] as const;

export type NavItem = (typeof navItems)[number];

export const socialLinks = [
  { label: "GitHub", href: siteConfig.links.github },
  { label: "GitLab", href: siteConfig.links.repo },
  { label: "LinkedIn", href: siteConfig.links.linkedin },
  { label: "YouTube", href: siteConfig.links.youtube },
  { label: "X", href: siteConfig.links.x },
  { label: "Instagram", href: siteConfig.links.instagram },
  { label: "TikTok", href: siteConfig.links.tiktok },
  { label: "WhatsApp", href: siteConfig.links.whatsapp },
] as const;
