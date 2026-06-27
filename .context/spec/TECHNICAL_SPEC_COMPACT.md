# bizu-hub — Technical Spec (Compact)

**Plataforma:** brunogoulart.com.br | **Identidade:** Bruno Goulart AI Automation Specialist & Full Stack Developer
**Docs completos:** `PROJECT_TECHNICAL_SPEC.md` (nesta pasta) → `technical-spec-full.md` (nesta pasta, histórico/roadmap)

---

## 1. Arquitetura

```
Node process único: react-router-hono-server
  ├── /api/*                  Hono API (src/api/app.ts)
  │     ├── GET  /api/health
  │     └── POST /api/contact  → Drizzle → Postgres
  └── /* React Router Framework Mode SSR (ssr: true global)
        ├── SSR real: /, /sobre, /projetos, /contato, /blog, /blog/:slug
        ├── Auth standalone: /login, /auth/callback
        └── Dashboard client-only: /dashboard/**  (sem loader SSR, gate no cliente)
```

**Decisão crítica:** `ssr: true` global + dashboard sem `loader` server-side = SSR nas públicas sem expor dados sensíveis no HTML inicial. Não reintroduzir `App.tsx`, `main.tsx`, `index.html` ou `server/` antigo.

---

## 2. Stack

| Camada | Ferramenta |
|--------|-----------|
| Runtime | Node.js 22 + TypeScript 5.9 (ESM) |
| Framework | React 19.2 + React Router 7.18 (Framework Mode) |
| Build | Vite 7.2 + `@react-router/dev` |
| Server | `react-router-hono-server` 2.21 + Hono |
| UI | Tailwind CSS v4 + shadcn/ui (base-nova, neutral) |
| Estado/Forms | TanStack Query + React Hook Form + Zod + `@hookform/resolvers` |
| Notificações | Sonner (dark fixo) |
| Banco | Drizzle ORM + postgres.js → Postgres 16 próprio |
| Auth | Supabase JS (somente Auth + Storage + Edge Functions + Realtime) |
| Pagamentos | Stripe (futuro) |
| E-mail | Nodemailer (futuro) |

**Tema:** dark-only fixo (`<html class="dark">` em `src/root.tsx`).
**Fontes:** Inter (texto) + JetBrains Mono (`--font-mono`, badges/snippets).
**Brand colors:** `--color-brand-blue #1096E6`, `--color-brand-indigo #3C51C4`, `--color-brand-teal #00CDBA`.

---

## 3. Estrutura de Pastas (resumida)

```
src/
├── api/app.ts              Hono API
├── components/
│   ├── auth/
│   ├── blog/               PostGallery, PostMedia, PostAttachments
│   ├── contact/
│   ├── gtm/                GoogleTagManager
│   ├── landing/            seções da home
│   ├── layout/             site-header, site-footer, dashboard-layout, dashboard-nav
│   └── ui/                 shadcn/ui
├── db/
│   ├── schema.ts           tabelas Drizzle
│   └── index.ts            client
├── lib/
│   ├── content/
│   │   ├── posts.server.ts getAllPosts(), getPostBySlug() — Drizzle + categories[]
│   │   ├── categories.server.ts getCategoriesForBlogMenu()
│   │   ├── read-time.ts
│   │   └── types.ts        PostWithRelations
│   ├── gtm/events.ts       helpers de tracking
│   ├── schemas/contact.ts  contactMessageSchema (Zod)
│   ├── seo.ts              buildMeta() centralizado
│   └── constants/navigation.ts  siteConfig, headerNavItems, navItems
├── routes/                 route modules (meta + loader + default)
├── root.tsx                HTML raiz, providers, JSON-LD @graph
├── routes.ts               config declarativa de rotas
└── server.ts               entry do servidor
scripts/
├── migrate-production.ts   npm run db:migrate:prod
├── migrate-baseline.ts     npm run db:migrate:baseline
└── migrate-rollback.ts     npm run db:migrate:rollback
```

---

## 4. Scripts Essenciais

| Script | Função |
|--------|--------|
| `npm run dev` | Dev server (SSR + API + HMR, 1 processo) |
| `npm run build` | Gera `build/client` e `build/server` |
| `npm run start` | Produção local: `node ./build/server/index.js` |
| `npm run typecheck` | `react-router typegen && tsc` |
| `npm run db:generate` | Gera migrations Drizzle |
| `npm run db:migrate` | Aplica migrations (dev) |
| `npm run db:migrate:prod` | Aplica migrations em produção via `DIRECT_URL` |
| `npm run db:migrate:baseline` | Registra migrations já aplicadas (sem executar SQL) |
| `npm run db:migrate:rollback` | Reverte última N migrations do journal |
| `npm run db:seed` | 3 posts originais (idempotente) |
| `npm run db:seed:test` | 1 post com galeria + mídia + anexos |
| `npm run db:seed:full` | 4 posts (test + 3 originais) |
| `npm run docker:build` / `docker:push` | Build e push da imagem Docker |

---

## Schema Drizzle

```
contact_messages   id, name, email, phone (varchar 20, NOT NULL), message, created_at
categories         id, slug (unique), name, position, created_at
posts              id, slug (unique), title, excerpt, content (MD), date, publishedAt,
                   cover (nullable), status (published|draft), created_at, updated_at
post_categories    post_id FK→posts(cascade), category_id FK→categories(cascade), PK(post_id, category_id)
post_images        id, post_id FK→posts(cascade), url, alt, position, created_at
post_media         id, post_id FK→posts(cascade), media_type (mp3|mp4), delivery_mode (embed|file),
                   url, title, position, created_at
post_attachments   id, post_id FK→posts(cascade), name, description, url, position, created_at
```

**Migrations (Jun 26 2026):**
- `0000`: initial (contact_messages without phone)
- `0001`: posts + related tables
- `0002`: contact_messages phone column (DELETE old rows, ADD COLUMN phone NOT NULL)
- `0003`: categories + post_categories; seed categorias; migra `tag` → M2M; drop `posts.tag`

**Blog categorias (spec 002):** menu `/blog` com Todos / Sem categoria / categorias com posts publicados; filtro client-side; sem CRUD de categorias.

**Blog busca (spec 003):** `GET /api/blog/search?q=&category=` — ILIKE em title/excerpt/content; debounce 300 ms no client; preview (max 10) + grid; combina com filtro de categoria ativo.

**Variáveis:** `DATABASE_URL` (runtime/API) · `DIRECT_URL` (migrations/Drizzle Kit).
**Regra:** dados da app = Postgres próprio via Drizzle. `supabase.from()` proibido para CRUD da app.
**Local dev setup:** baseline `0000_cloudy_miracleman` e `0001_flippant_marvel_apes` (já applied), then `npm run db:migrate:prod` applies `0002_dusty_squadron_supreme`.

---

## 6. Hono API

Arquivo: `src/api/app.ts`

| Método | Rota | Validação |
|--------|------|-----------|
| GET | `/api/health` | — |
| GET | `/api/blog/search` | `zValidator("query", blogSearchQuerySchema)` — `q` (min 3), `category` (default `todos`) |
| POST | `/api/contact` | `zValidator("json", contactMessageSchema)` |

CORS removido — mesma origem. Reintroduzir se expor a outra origem no futuro.

---

## 7. SEO + GTM

**SEO (5 pilares — Jun 2026):**
- `src/lib/seo.ts` → `buildMeta()`: canonical, og:*, twitter:*, robots (`index, follow, max-image-preview:large, ...`).
- JSON-LD `@graph` (WebSite + Person) em `src/root.tsx` — SSR-safe.
- JSON-LD `TechArticle` dinâmico em `src/routes/blog-post.tsx`.
- `public/robots.txt` — Disallow: /login, /auth/, /dashboard/. Aponta sitemap.
- `public/sitemap.xml` — rotas estáticas. Atualizar manualmente ao publicar posts.

**GTM/GA4 (ativo):**
- Container: `GTM-KXX8MMKS` · Variável: `VITE_GTM_ID=GTM-KXX8MMKS` (build-time).
- Componente: `src/components/gtm/google-tag-manager.tsx` (injetado em `src/root.tsx`).
- 6 helpers de eventos: `src/lib/gtm/events.ts`.

**Phone Validation (FIXED Jun 26 2026):**
- `src/lib/validation/mobile-phone.ts` agora usa `libphonenumber-js/mobile` (mobile bundle).
- Antes: default bundle retornava `undefined` para `getType()` — validação falhava.
- Depois: mobile bundle retorna `MOBILE` — validação funciona em contact + auth signup.

**Login Page (Jun 26 2026):**
- Logo (`<SiteLogo/>`) centralizada com `flex w-fit flex-col items-center mx-auto`.
- Favicon: `public/favicon.ico` deletado; novo favicon é PNG horizontal logo.

---

## 8. Deploy

```
Dev local → docker build (--build-arg VITE_*) → docker push → GitLab Container Registry (pública)
                                                                        ↓
VPS Portainer Stack → pull anônimo → app:3000 ← Traefik/NPM + TLS
                              ↓
                   postgres:5432 (exposto no host via ufw allowlist)
                              ↑
                Dev PC (DIRECT_URL) → npm run db:migrate:prod
```

**Arquivos:**
- `deploy/portainer-stack.yml` — Traefik (produção principal)
- `deploy/portainer-stack.npm.yml` — NPM (alternativa)
- `.gitlab-ci.yml` — CI automático na branch principal

**Migrations em produção (preferido — PC de dev):**
```bash
DIRECT_URL="postgresql://bizu_hub:SENHA@212.85.19.156:5432/bizu_hub" npm run db:migrate:prod
```

---

## 9. Variáveis de Ambiente

| Variável | Onde | Uso |
|---------|------|-----|
| `DATABASE_URL` | Runtime container | Drizzle (app) |
| `DIRECT_URL` | Dev/script | Drizzle Kit / migrations |
| `VITE_SUPABASE_URL` | Build (`--build-arg`) | Auth/Storage no client |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Build (`--build-arg`) | Auth/Storage no client |
| `VITE_GTM_ID` | Build (`--build-arg`) | GTM no client |
| `PORT` | Runtime | Servidor (default 3000) |

Supabase Auth: Site URL `https://brunogoulart.com.br` · Redirect `https://brunogoulart.com.br/auth/callback`.

---

## 10. Regras que não devem ser violadas

- Não reintroduzir `src/App.tsx`, `src/main.tsx`, `index.html` ou `server/`.
- Não adicionar proxy `/api` no Vite.
- Não usar `supabase.from()` para CRUD da app.
- Não colocar dados sensíveis do dashboard em `loader` server-side.
- Não importar Stripe server-side ou Nodemailer em componentes client.
- Usar `meta` nativo do React Router para SEO/OG.
- Usar Drizzle migrations para mudanças de schema (nunca `db:push` em produção).

## 11. Atualizações Jun 26, 2026

**Phone Validation Fix:**
- `src/lib/validation/mobile-phone.ts` mudou de `libphonenumber-js` (default) → `libphonenumber-js/mobile`.
- Default bundle não tinha metadata de tipo — `getType()` sempre retornava `undefined`.
- Mobile bundle traz metadata completo — agora `getType()` retorna `MOBILE` para celulares.
- Validação E.164 obrigatória, rejeita landlines. Ambos os forms (contact + auth signup) agora funcionam.

**Database Migrations:**
- `npm run db:migrate:baseline -- <tag>` registra migrations já aplicadas no journal sem executar SQL.
- `npm run db:migrate:prod` aplica apenas migrations pendentes (idempotente — confere `__drizzle_migrations`).
- Local dev com tabelas pré-existentes mas journal vazio: baseline `0000_cloudy_miracleman` + `0001_flippant_marvel_apes`, then `npm run db:migrate:prod` applies `0002_dusty_squadron_supreme` (phone column).

**Login Page & UI:**
- Logo (`<SiteLogo/>`) centralizada em cima do card com `flex w-fit flex-col items-center mx-auto`.
- `public/favicon.ico` deletado; favicon agora `/bruno_goulart_logo_horizontal_v1.png` (PNG).
