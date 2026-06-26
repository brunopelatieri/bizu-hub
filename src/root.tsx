import { useState, type ReactNode } from "react";
import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";
import type { LinksFunction, MetaFunction } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/providers/auth-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { siteConfig } from "@/lib/constants/navigation";
import { GoogleTagManager } from "@/components/gtm/google-tag-manager";
import stylesheet from "@/index.css?url";

const SITE_STRUCTURED_DATA = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://brunogoulart.com.br/#website",
      url: "https://brunogoulart.com.br",
      name: "Bruno Goulart",
      publisher: { "@id": "https://brunogoulart.com.br/#author" },
    },
    {
      "@type": "Person",
      "@id": "https://brunogoulart.com.br/#author",
      name: "Bruno Pelatieri Goulart",
      alternateName: "Bruno Pelatieri",
      jobTitle: "AI Automation Specialist & Full Stack Developer",
      url: "https://brunogoulart.com.br",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Campinas",
        addressRegion: "SP",
        addressCountry: "BR",
      },
      sameAs: [
        "https://github.com/brunopelatieri",
        "https://gitlab.com/brunopelatieri",
        "https://www.linkedin.com/in/bruno-pelatieri-goulart/",
        "https://www.youtube.com/@brunopelatieri",
        "https://www.tiktok.com/@brunopelatieri",
        "https://x.com/brunopelatieri",
        "https://www.instagram.com/brunopelatieri/",
        "https://www.facebook.com/bruno.pelatierigoulart",
      ],
      knowsAbout: [
        "AI Orchestration",
        "n8n",
        "Dify",
        "React Router v7",
        "Drizzle ORM",
        "Docker",
        "Supabase",
        "TypeScript",
        "Python",
      ],
    },
  ],
};

export const links: LinksFunction = () => [
  { rel: "icon", href: siteConfig.favicon, type: "image/png" },
  { rel: "shortcut icon", href: siteConfig.favicon },
  { rel: "apple-touch-icon", href: siteConfig.logo },
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=JetBrains+Mono:wght@400..700&family=Manrope:wght@200..800&display=swap",
  },
  { rel: "stylesheet", href: stylesheet },
];

export const meta: MetaFunction = () => [
  { title: siteConfig.title },
  { name: "description", content: siteConfig.description },
  { name: "theme-color", content: "#0b0b0c" },
];

export function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR" className="dark" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href={siteConfig.favicon} type="image/png" />
        <link rel="shortcut icon" href={siteConfig.favicon} />
        <Meta />
        <Links />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(SITE_STRUCTURED_DATA),
          }}
        />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: { queries: { staleTime: 60_000, retry: 1 } },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ThemeProvider>
          <AuthProvider>
            <Outlet />
            <Toaster richColors closeButton position="top-right" />
            <GoogleTagManager />
          </AuthProvider>
        </ThemeProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export function ErrorBoundary({ error }: { error: unknown }) {
  let title = "Erro inesperado";
  let message = "Algo deu errado. Tente novamente mais tarde.";

  if (isRouteErrorResponse(error)) {
    title = `${error.status} ${error.statusText}`;
    message =
      error.status === 404
        ? "A página que você procura não existe."
        : error.data || message;
  } else if (import.meta.env.DEV && error instanceof Error) {
    message = error.message;
  }

  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-3 px-6 text-center">
      <h1 className="text-3xl font-bold text-foreground">{title}</h1>
      <p className="max-w-md text-muted-foreground">{message}</p>
      <a
        href="/"
        className="mt-2 text-sm font-medium text-primary underline-offset-4 hover:underline"
      >
        ← Voltar para o início
      </a>
    </main>
  );
}
