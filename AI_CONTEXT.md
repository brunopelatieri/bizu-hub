# AI Context — Bruno Goulart AI Automation Specialist & Full Stack Developer

**Identidade do projeto:** `Bruno Goulart AI Automation Specialist & Full Stack Developer`
**Repo/slug:** `bizu-hub` | **Domínio:** `brunogoulart.com.br`

Este arquivo é o ponto de entrada rápido para qualquer LLM/AI Agent entender o
projeto antes de propor ou executar mudanças.

## Objetivo

Plataforma pessoal de **Bruno Pelatieri Goulart** que reúne em uma única plataforma:

- **Site pessoal** — landing, sobre, projetos, contato e presença profissional.
- **Blog** — artigos com SSR, SEO e Open Graph.
- **Hub de clientes** — área autenticada (`/dashboard/**`) para clientes acompanharem projetos, entregas e recursos.

Stack full-stack com metodologia de **AI Software Engineering**: contexto explícito, decisões documentadas e desenvolvimento guiado por especificação.

## Arquivos Que Devem Ser Lidos Primeiro

1. `AI_CONTEXT.md` — visão rápida e regras de atualização de contexto.
2. `PROJECT_TECHNICAL_SPEC.md` — especificação técnica completa.
3. `MIGRATION_NOTES.md` — decisões da migração para React Router Framework Mode.
4. `.specify/memory/constitution.md` — constituição SpecifyX.
5. `.cursor/rules/*.mdc` — regras operacionais do workspace.

## Arquitetura Atual

```text
React Router v7 Framework Mode (SSR global)
  |
  |-- Rotas públicas com SSR: /, /sobre, /projetos, /contato, /blog, /blog/:slug
  |-- Rotas auth standalone: /login, /auth/callback
  `-- Dashboard client-only por convenção: /dashboard/**

Hono API no mesmo processo:
  |-- src/server.ts
  `-- src/api/app.ts (/api/*)

Dados:
  |-- Drizzle ORM + postgres.js -> Postgres próprio
  `-- Supabase apenas auxiliar (Auth, Storage, Edge Functions, Realtime)
```

## Regras de Decisão

- Não reintroduzir `src/App.tsx`, `src/main.tsx`, `index.html` ou `server/` antigo.
- Não adicionar proxy `/api` no Vite; API e frontend compartilham origem.
- Não usar `supabase.from()` para CRUD da aplicação.
- Não colocar dados sensíveis do dashboard em `loader` server-side.
- Use `meta` nativo do React Router para SEO/Open Graph.
- Use loaders server-side para dados públicos indexáveis (blog, landing dinâmica).
- Use client-side fetching/TanStack Query para área autenticada.
- Use Zod para contratos de entrada de API e formulários.
- Use Drizzle migrations para mudanças de schema.

## Quando Atualizar Contexto

Atualize este arquivo e `PROJECT_TECHNICAL_SPEC.md` quando mudar:

- Arquitetura.
- Rotas.
- Stack ou dependências relevantes.
- Deploy/Docker/Portainer.
- Banco/schema.
- Regras de uso de Supabase.
- Estratégia de auth, billing, multi-tenant ou dashboard.
- Convenções de IA/SpecifyX.

Se a mudança afetar onboarding, atualize também `README.md`.
Se a mudança afetar agentes/LLMs, atualize também `.cursor/rules/`.

## Status Atual

- Produção: [https://brunogoulart.com.br](https://brunogoulart.com.br) — VPS Ubuntu + Docker + Portainer.
- Repositório: [gitlab.com/brunopelatieri/bizu-hub](https://gitlab.com/brunopelatieri/bizu-hub).
- Imagem: **GitLab Container Registry** (`registry.gitlab.com/brunopelatieri/bizu-hub`).
- Supabase (Auth auxiliar): project ref **`kpersdlqtrxlytwbuvvv`** — MCP em `.cursor/mcp.json` (só neste repo).
- React Router Framework Mode com `ssr: true`.
- Hono integrado via `react-router-hono-server`.
- Blog SSR com fonte estática em `src/lib/content/posts.ts`.
- Hub de clientes protegido no cliente (`/dashboard/**`).
- Stack Portainer em `deploy/portainer-stack.yml` e `deploy/portainer-stack.npm.yml`.
- Scripts `npm run docker:build` / `docker:push` em `scripts/docker-build.mjs`.
- CI/CD GitLab (`.gitlab-ci.yml`) — build + push automático na branch principal.

## Header Público Responsivo (adicionado Jun 2026)

- `src/components/layout/site-nav-links.tsx` — `NavLink` com estado ativo + prop `onNavigate` para fechar Sheet.
- `src/components/layout/site-header.tsx` refatorado: desktop `≥ md` inline; mobile `< md` hambúrguer + `Sheet` lateral (direita) com nav + botões de auth.
- Anti-overflow: `shrink-0` no logo, `min-w-0` no container de nav, `px-4 sm:px-6` adaptável.

## Infraestrutura Client-side (adicionada Jun 2026)

- **TanStack Query** (`QueryClientProvider`) em `src/root.tsx` — instância segura via `useState` para evitar cache leak no SSR.
- **TooltipProvider** (shadcn/ui) adicionado em `src/root.tsx`.
- **react-hook-form + @hookform/resolvers/zod** no `AuthForm` (`src/components/auth/auth-form.tsx`).
- **sonner** (toasts) para feedback de auth — sucesso e erro.
- Componentes shadcn disponíveis: `avatar`, `dropdown-menu`, `sheet`, `skeleton`, `tooltip` (além dos já existentes).

## Estrutura do Dashboard (atualizada Jun 2026)

- **Desktop**: Sidebar lateral fixa colapsável (`hidden md:flex`) com avatar do usuário na base.
- **Mobile**: Topbar com botão hambúrguer que dispara `Sheet` lateral (sem sidebar visível em `< md`).
- Navegação centralizada em `src/components/layout/dashboard-nav.tsx` (`DashboardNavItems`).
- User menu com `DropdownMenu` (avatar → logout, site público).
- Convenção mantida: sem loaders SSR com dados sensíveis no dashboard.

## Página de Login (atualizada Jun 2026)

- Visual dark premium "Engineering AI Design": background `oklch(0.08_0.03_264)`, grid cibernético, glow radial.
- Card glassmorphism com borda luminosa superior.
- Tabs `Entrar` / `Criar conta` — formulário de cadastro com campos: Nome, E-mail, Telefone Celular, Senha.
- Validação inline via zod + react-hook-form; notificações via sonner.

## Tema único — Dark Mode Only (atualizado Jun 2026)

- Light mode deprecado. `<html class="dark">` fixo em `src/root.tsx` — sem script de init nem alternância.
- `ThemeProvider` é pass-through; `useResolvedTheme()` retorna sempre `"dark"`.
- Removidos: `ThemeToggle`, `theme-store.ts`, `themeInitScript` e persistência localStorage de tema.
- `Toaster` (sonner) usa `theme="dark"` fixo.

## Páginas Públicas — Design System 2026 (atualizado Jun 2026)

- Tokens de marca fixos em `src/styles/theme.css` (`@theme inline`): `--color-brand-blue #1096E6`, `--color-brand-indigo #3C51C4`, `--color-brand-teal #00CDBA`.
- Tipografia: `Inter` (texto) + `JetBrains Mono` (`--font-mono`, usada em badges, números, stacks e snippets); fontes carregadas em `src/root.tsx`.
- Utilitários em `src/index.css`: `text-gradient-brand` (título com gradiente animado das 3 cores) e `glass-card`.
- `home-page`, `about-page`, `projects-page`, `contact-page` + seções em `src/components/landing/*` adotam dark dominante (slate-950 → slate-900) com glassmorphism (`backdrop-blur-md`, `border-slate-800/50`).
- Conteúdo real derivado do perfil consolidado (GitHub README + full-profile): posicionamento "AI Automation Specialist & Full Stack Developer", cases Phyonext/Gestão Inteligente, projetos open source (MCP Server, Setup Orion, DApps etc.).
- `ContactForm` (`src/components/contact/contact-form.tsx`) usa `sonner` para feedback; canais incluem Discord (`siteConfig.links.discord`).
- Ícones de marca adicionais em `src/components/ui/brand-icons.tsx` (inclui `DiscordIcon`).
- **Header** (`site-header.tsx`): barra flutuante glass (`bg-slate-950/80 backdrop-blur-md`), marca "Bruno Goulart" + subtítulo gradiente, nav central (Home/Sobre/Projetos/Contato), CTA "Fale com o Especialista", Sheet mobile.
- **Footer** (`site-footer.tsx`): grid 3 colunas (manifesto, navegação, canais com handles), copyright 2006–2026, botão scroll-to-top.

## Pendências Técnicas Conhecidas

- Evoluir blog estático para tabela Drizzle quando virar feature real.
- Criar schemas compartilhados adicionais conforme novos forms/APIs surgirem.
- Job de migrations documentado em `deploy/README.md` (fora do container runtime).
