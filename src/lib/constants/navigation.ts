export const siteConfig = {
  name: "Bruno Goulart",
  title: "Bruno Goulart AI Automation Specialist & Full Stack Developer",
  description:
    "Bruno Goulart — AI Automation Specialist & Full Stack Developer. Automação inteligente com IA, n8n, agentes LLM e arquitetura full-stack.",
  locale: "pt-BR",
  url: "https://brunogoulart.com.br/",
  logo: "/bruno_goulart_logo_horizontal_v1.png",
  favicon: "/favicon.ico",
  ogImage: "/og-image.webp",
  screenshot: "/bizu_bru_ia_screenshot.webp",
  author: {
    name: "Bruno Pelatieri Goulart",
    displayName: "Bruno Goulart",
    role: "AI Automation Specialist & Full Stack Developer",
    email: "brunopelatieri@gmail.com",
    phone: "+55 (19) 9 9249-6598",
    photo: "/bruno_pelatieri_goulart_bizu_bru_ia.webp",
    location: "Campinas, São Paulo, Brasil",
  },
  links: {
    site: "https://brunogoulart.com.br/",
    repo: "https://gitlab.com/brunopelatieri/bizu-hub",
    github: "https://github.com/brunopelatieri",
    gitlab: "https://gitlab.com/brunopelatieri",
    dockerhub: "https://hub.docker.com/u/brunopelatieri",
    linkedin: "https://www.linkedin.com/in/bruno-pelatieri-goulart/",
    youtube: "https://www.youtube.com/@brunopelatieri",
    tiktok: "https://www.tiktok.com/@brunopelatieri",
    x: "https://x.com/brunopelatieri",
    instagram: "https://www.instagram.com/brunopelatieri/",
    facebook: "https://www.facebook.com/bruno.pelatierigoulart",
    discord: "https://discord.com/users/1248366465929711648",
    whatsapp: "https://wa.me/5519992496598",
  },
} as const;

export const headerNavItems = [
  { href: "/", label: "Home" },
  { href: "/sobre", label: "Sobre" },
  { href: "/projetos", label: "Projetos" },
  { href: "/contato", label: "Contato" },
] as const;

export const navItems = [
  { href: "/", label: "Início" },
  { href: "/sobre", label: "Sobre" },
  { href: "/projetos", label: "Projetos" },
  { href: "/blog", label: "Blog" },
  { href: "/contato", label: "Contato" },
] as const;

export type NavItem = (typeof navItems)[number];

export const socialLinks = [
  { label: "LinkedIn", href: siteConfig.links.linkedin },
  { label: "GitHub", href: siteConfig.links.github },
  { label: "GitLab", href: siteConfig.links.gitlab },
  { label: "Docker Hub", href: siteConfig.links.dockerhub },
  { label: "YouTube", href: siteConfig.links.youtube },
  { label: "TikTok", href: siteConfig.links.tiktok },
  { label: "X", href: siteConfig.links.x },
  { label: "Instagram", href: siteConfig.links.instagram },
  { label: "Facebook", href: siteConfig.links.facebook },
  { label: "WhatsApp", href: siteConfig.links.whatsapp },
] as const;

/** Canais exibidos no footer com handle visível. */
export const footerChannels = [
  { label: "YouTube", handle: "@brunopelatieri", href: siteConfig.links.youtube },
  { label: "TikTok", handle: "@brunopelatieri", href: siteConfig.links.tiktok },
  { label: "GitHub", handle: "@brunopelatieri", href: siteConfig.links.github },
  { label: "GitLab", handle: "@brunopelatieri", href: siteConfig.links.gitlab },
  { label: "Docker Hub", handle: "brunopelatieri", href: siteConfig.links.dockerhub },
  { label: "LinkedIn", handle: "bruno-pelatieri-goulart", href: siteConfig.links.linkedin },
  { label: "X", handle: "@brunopelatieri", href: siteConfig.links.x },
  { label: "Instagram", handle: "@brunopelatieri", href: siteConfig.links.instagram },
  { label: "Discord", handle: "brunopelatieri", href: siteConfig.links.discord },
  { label: "WhatsApp", handle: "+55 (19) 9 9249-6598", href: siteConfig.links.whatsapp },
] as const;
