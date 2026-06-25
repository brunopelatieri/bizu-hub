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
- Imagem: **GitLab Container Registry** (`registry.gitlab.com/brunopelatieri/bizu-hub`) — **pública para pull** (VPS/Portainer sem registry nem `docker login`).
- Supabase (Auth auxiliar): project ref **`kpersdlqtrxlytwbuvvv`** — MCP em `.cursor/mcp.json` (só neste repo).
- React Router Framework Mode com `ssr: true`.
- Hono integrado via `react-router-hono-server`.
- Blog SSR com fonte estática em `src/lib/content/posts.ts`.
- Hub de clientes protegido no cliente (`/dashboard/**`).
- Stack Portainer em `deploy/portainer-stack.yml` e `deploy/portainer-stack.npm.yml`.
- Scripts `npm run docker:build` / `docker:push` em `scripts/docker-build.mjs`.
- CI/CD GitLab (`.gitlab-ci.yml`) — build + push automático na branch principal.

## Acesso Externo ao PostgreSQL (Jun 2026)

- **Porta 5432 exposta no host** da VPS (`212.85.19.156`) via Docker Swarm `mode: host`.
- **Firewall ufw** com allowlist de IP: apenas IPs autorizados (ex: IP do PC de dev) acessam o banco — tudo mais é `DENY`.
- Ferramentas **internas ao Swarm** (container `app`, serviços na rede `bru`) continuam usando o hostname interno `bizu-hub_postgres:5432` — sem mudança.
- Ferramentas **externas** (HeidiSQL, n8n externo, PC de desenvolvimento) conectam via `212.85.19.156:5432` com IP liberado no ufw.
- **Migrations em produção** agora rodam do PC de dev sem SSH:
  ```bash
  DIRECT_URL="postgresql://bizu_hub:SENHA@212.85.19.156:5432/bizu_hub" npm run db:migrate:prod
  ```
- Documentação completa de infra: `INFRA_POSTGRES_EXTERNAL_ACCESS.md`.
- Stack atualizada: `deploy/portainer-stack.yml` e `deploy/portainer-stack.npm.yml` incluem o bloco `ports` para o serviço `postgres`.
- **Nota para agentes:** nunca expor `DIRECT_URL` com credenciais reais em commits. Usar `.env.local` (no `.gitignore`) ou variável de ambiente na sessão.

## Header Público Responsivo (adicionado Jun 2026)

- `src/components/layout/site-nav-links.tsx` — `NavLink` com estado ativo + prop `onNavigate` para fechar Sheet.
- `src/components/layout/site-header.tsx` refatorado: desktop `≥ md` inline; mobile `< md` hambúrguer + `Sheet` lateral (direita) com nav + botões de auth.
- Anti-overflow: `shrink-0` no logo, `min-w-0` no container de nav, `px-4 sm:px-6` adaptável.
- **`headerNavItems` vs `navItems`**: o header contém apenas Home/Sobre/Projetos/Contato (4 itens) para manter compactação visual. Blog é vitrine secundária — acessível na landing via `BlogSection`, no footer e via link direto. Essa distinção mantém a navegação principal focada em conversão (Contato/Fale com Especialista).

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

## Google Tag Manager + Google Analytics 4 (adicionado Jun 2026)

- **GTM Container:** `GTM-KXX8MMKS`
- **Componente:** `src/components/gtm/google-tag-manager.tsx` — injeta script de GTM no client
- **Eventos:** `src/lib/gtm/events.ts` — 6 helpers (`trackContactFormSubmission`, `trackCTAClick`, etc.)
- **Integração:** `src/root.tsx` renderiza `GoogleTagManager` + tracking de conversão no form de contato
- **Variável:** `VITE_GTM_ID=GTM-KXX8MMKS` — embutida no bundle via `--build-arg` (build time, não runtime Portainer)
- **Status:** ✅ Ativo em produção — GTM container criado, GA4 conectado, tag publicada e aplicada

## SEO Técnico (Jun 2026)

- **`src/lib/seo.ts`** — `buildMeta()` centralizado. Gera: canonical, og:*, twitter:card/site/creator, robots meta. Default de robots: `index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1`. Bug de URL dupla corrigido (strip trailing slash de `siteConfig.url`).
- **Todas as rotas públicas** usam `buildMeta()` — incluindo `/blog` e `/blog/:slug` (antes tinham meta manual incompleto).
- **JSON-LD `@graph` em `src/root.tsx`** — `WebSite` + `Person` (Bruno Pelatieri Goulart, Campinas/SP, sameAs 8 redes) injetado no `<head>` via `<script dangerouslySetInnerHTML>` — SSR-safe, sem hydration mismatch.
- **JSON-LD `TechArticle` em `src/routes/blog-post.tsx`** — dinâmico por post, com `author/@id` e `publisher/@id` referenciando o `@graph` global. Renderizado via fragment no corpo do componente.
- **`public/robots.txt`** — `Disallow: /login`, `/auth/`, `/dashboard/`. Aponta para sitemap.
- **`public/sitemap.xml`** — rotas estáticas (home, sobre, projetos, blog, contato). Posts do blog não estão incluídos dinamicamente — atualizar manualmente ao publicar posts relevantes.
- **Alt em imagens de conteúdo:** `post.cover` em `blog-section.tsx` (home preview) e `blog-post.tsx` (artigo) usam `alt={\`Capa do post: ${post.title}\`}` — dinâmico e descritivo.

## Blog Dinâmico com Mídia Relacional (spec 001 — Jun 2026)

- **Schema Drizzle:** 4 tabelas — `posts`, `post_images`, `post_media`, `post_attachments`.
- `posts`: slug (unique), title, excerpt, content (Markdown), tag, date (display), publishedAt (ISO), cover (URL/path opcional), status (`published` | `draft`).
- `post_images`: postId (FK cascade), url, alt (obrigatório), position.
- `post_media`: postId (FK cascade), mediaType (`mp3`|`mp4`), deliveryMode (`embed`|`file`), url, title, position.
- `post_attachments`: postId (FK cascade), name, description, url, position.
- **readTime:** calculado em `src/lib/content/read-time.ts` (200 palavras/min). Não armazenado.
- **Loaders:** `getAllPosts()` e `getPostBySlug()` em `src/lib/content/posts.server.ts` (Drizzle). Filtram `status = 'published'` — drafts retornam 404.
- **Componentes:** `PostGallery`, `PostMedia`, `PostAttachments` em `src/components/blog/`.
- **Markdown:** renderizado com `react-markdown` + `remark-gfm`.
- **Seeds (3 scripts — Jun 2026):**
  - `npm run db:seed` → 3 posts originais (`onConflictDoNothing` por slug).
  - `npm run db:seed:test` → 1 post de teste com galeria (3 imgs), mídia (mp3/mp4/iframe YouTube) e anexos (zip/docx/pdf).
  - `npm run db:seed:full` → test post + 3 originais; test post é o mais recente (`publishedAt DESC`).
- **Arquitetura dos scripts de seed:** funções exportadas (`seedOriginalPosts`, `seedTestPost`) recebem `PostgresJsDatabase` — conexão gerenciada pelo chamador. Guard ESM `import.meta.url === pathToFileURL(process.argv[1]).href` evita execução ao importar. Tabelas relacionadas usam delete+reinsert para idempotência determinística.
- `src/lib/content/posts.ts` marcado `@deprecated` — remover após validação em produção.

## Scripts de Migrations (Jun 2026)

- **`npm run db:migrate:prod`** — aplica migrations pendentes via `DIRECT_URL` (prod) ou `DATABASE_URL` (dev). Idempotente: verifica `__drizzle_migrations` antes de executar.
- **`npm run db:migrate:baseline`** — registra migrations já aplicadas manualmente no journal SEM executar SQL. Uso: quando schema foi criado via Portainer/SQL direto e precisa sincronizar com Drizzle.
- **`npm run db:migrate:rollback`** — reverte últimas N migrations (default: 1) removendo registros do journal. Suporte a `--steps=N --dry-run --force`.
- **Scripts em `scripts/`:** `migrate-production.ts`, `migrate-baseline.ts`, `migrate-rollback.ts` — ESM com guard module-is-main, mascaramento de credenciais em logs.

## Pendências Técnicas Conhecidas

- Criar schemas compartilhados adicionais conforme novos forms/APIs surgirem.
