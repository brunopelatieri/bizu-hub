# bizu-hub — Technical Spec (Full Archive)

Seções de histórico, roadmap, decisões de design system, bugs resolvidos e detalhes extensos.
**Para consulta rápida:** `TECHNICAL_SPEC_COMPACT.md` na raiz.

---

## Design System Público (Jun 2026)

Aplicado em `home-page`, `about-page`, `projects-page`, `contact-page` e `src/components/landing/*`.

- Paleta de marca em `src/styles/theme.css` (`@theme inline`): `--color-brand-blue #1096E6`, `--color-brand-indigo #3C51C4`, `--color-brand-teal #00CDBA` — usáveis como `bg-brand-blue`, `text-brand-teal`, `from-brand-*`.
- Tipografia: Inter (texto) + JetBrains Mono (`--font-mono`) para badges, números, stacks, snippets.
- Utilitários em `src/index.css`: `text-gradient-brand` (gradiente animado via keyframe `gradient-x`), `glass-card`.
- Estilo: dark dominante (slate-950 → slate-900), glassmorphism (`backdrop-blur-md`, `border-slate-800/50`).
- Conteúdo derivado do perfil profissional: posicionamento "AI Automation Specialist & Full Stack Developer", cases Phyonext/Gestão Inteligente, projetos open source (MCP Server, Setup Orion, DApps etc.).
- Header (`site-header.tsx`): barra flutuante glass, marca "Bruno Goulart" + subtítulo gradiente, nav central, CTA "Fale com o Especialista", Sheet mobile.
- Footer (`site-footer.tsx`): grid 3 colunas (manifesto, navegação, canais com handles), copyright 2006–2026, scroll-to-top.
- `about-page` e `projects-page`: hero próprio (grid cibernético + glow radial) sem `PageHero`.
- `ContactForm`: sonner para feedback; canais incluem Discord (`siteConfig.links.discord`).
- Ícones adicionais: `src/components/ui/brand-icons.tsx` (inclui `DiscordIcon`).

---

## Tailwind / CSS Detalhado

`src/index.css`:
- `@import 'tailwindcss'`
- `@import 'tw-animate-css'`
- `@custom-variant dark (&:is(.dark *))`
- Base styles: `body`, scrollbar, focus ring
- Utilities: `container`, `no-scrollbar`, `faded-bottom`
- Keyframes Radix Collapsible: `slideDown`, `slideUp`

`src/styles/theme.css`: radius tokens, cores shadcn, chart tokens (`chart-1…5`), sidebar tokens (`sidebar-*`), font tokens (Inter, Manrope).

---

## Tema dark-only (Jun 2026)

Light mode deprecado. Mudanças realizadas:
- `<html class="dark">` fixo em `src/root.tsx` — sem script de init nem alternância.
- `ThemeProvider` é pass-through; `useResolvedTheme()` retorna sempre `"dark"`.
- Removidos: `ThemeToggle`, `theme-store.ts`, `themeInitScript`, persistência localStorage de tema.
- `Toaster` (sonner) usa `theme="dark"` fixo.

---

## Infraestrutura Client-side (Jun 2026)

- **TanStack Query** (`QueryClientProvider`) em `src/root.tsx` — instância via `useState` (evita cache leak no SSR).
- **TooltipProvider** (shadcn/ui) em `src/root.tsx`.
- **react-hook-form + @hookform/resolvers/zod** no `AuthForm` (`src/components/auth/auth-form.tsx`).
- **sonner** para feedback de auth.
- Componentes shadcn disponíveis: `avatar`, `badge`, `button`, `card`, `dropdown-menu`, `input`, `label`, `separator`, `sheet`, `skeleton`, `tabs`, `textarea`, `tooltip`, `sonner`.

---

## Header Público Responsivo (Jun 2026)

- `src/components/layout/site-nav-links.tsx` — `NavLink` com estado ativo + prop `onNavigate` para fechar Sheet.
- `src/components/layout/site-header.tsx`: desktop `≥ md` inline; mobile `< md` hambúrguer + `Sheet` lateral (direita) com nav + botões de auth.
- Anti-overflow: `shrink-0` no logo, `min-w-0` no container de nav, `px-4 sm:px-6`.
- **`headerNavItems` vs `navItems`:** header = 4 itens (Home/Sobre/Projetos/Contato). Blog é vitrine secundária — acessível via `BlogSection`, footer e link direto. Distinção mantém navegação focada em conversão.

---

## Dashboard (Jun 2026)

- **Desktop**: Sidebar lateral fixa colapsável (`hidden md:flex`) com avatar do usuário na base.
- **Mobile**: Topbar com hambúrguer → `Sheet` lateral.
- Navegação centralizada em `src/components/layout/dashboard-nav.tsx` (`DashboardNavItems`).
- User menu: `DropdownMenu` (avatar → logout, site público).
- Subrotas (`/projetos`, `/clientes`, `/arquivos`, `/relatorios`, `/configuracoes`) ainda são "Em breve".
- Convenção mantida: sem loaders SSR com dados sensíveis.

---

## Login Page (Jun 2026)

- Visual dark premium "Engineering AI Design": background `oklch(0.08_0.03_264)`, grid cibernético, glow radial.
- Card glassmorphism com borda luminosa superior.
- Tabs `Entrar` / `Criar conta` — formulário com: Nome, E-mail, Telefone Celular, Senha.
- Validação inline via zod + react-hook-form; notificações via sonner.

---

## Blog Dinâmico com Mídia Relacional (spec 001 — Jun 2026)

**Loaders:** `getAllPosts()` e `getPostBySlug()` em `src/lib/content/posts.server.ts` (Drizzle). Filtram `status = 'published'` — drafts retornam 404.

**Componentes:** `PostGallery`, `PostMedia`, `PostAttachments` em `src/components/blog/`. Markdown renderizado com `react-markdown` + `remark-gfm`. Read time calculado em `src/lib/content/read-time.ts` (200 palavras/min).

**Seeds (3 scripts):**
- `npm run db:seed` → 3 posts originais (`onConflictDoNothing` por slug).
- `npm run db:seed:test` → 1 post com galeria (3 imgs), mídia (mp3/mp4/iframe YouTube), anexos (zip/docx/pdf).
- `npm run db:seed:full` → test post + 3 originais (4 posts; test post é o mais recente).

**Arquitetura seeds:** funções exportadas (`seedOriginalPosts`, `seedTestPost`) recebem `PostgresJsDatabase<typeof schema>`. Guard ESM (`import.meta.url === pathToFileURL(process.argv[1]).href`). Tabelas relacionadas: delete+reinsert (sem unique constraint em `postId+position`).

`src/lib/content/posts.ts` marcado `@deprecated` — remover após validação em produção.

---

## Scripts de Migrations (Jun 2026)

**`scripts/migrate-production.ts`** (`npm run db:migrate:prod`):
- Aplica migrations via Drizzle migrator. Conecta por `DIRECT_URL` (prod) ou `DATABASE_URL` (dev).
- Idempotente: verifica `drizzle.__drizzle_migrations` antes de executar.
- Log: timestamp, DB masked, NODE_ENV, hashes das migrations.
- Erro "relation already exists" → sugere baseline.

**`scripts/migrate-baseline.ts`** (`npm run db:migrate:baseline -- <tag>`):
- Registra migrations já aplicadas manualmente no journal. NÃO executa SQL.
- Uso: schema criado via Portainer/SQL direto, ou primeiro run em DB existente.
- Lê journal (`drizzle/meta/_journal.json`), calcula hash SHA256 de cada `.sql`.
- Exemplo: `npm run db:migrate:baseline -- 0002_add_blog_tables`

**`scripts/migrate-rollback.ts`** (`npm run db:migrate:rollback -- [--steps=N] [--dry-run] [--force]`):
- Reverte últimas N migrations removendo registros de `__drizzle_migrations`.
- Default: 1 step. `--dry-run` mostra sem executar. `--force` pula confirmação.
- ⚠️ Não desfaz CREATE TABLE/ALTER automaticamente — SQL reverso é manual.

---

## Acesso Externo ao PostgreSQL (Jun 2026)

- Porta `5432` exposta no host da VPS (`212.85.19.156`) via Docker Swarm `mode: host`.
- Firewall `ufw` com allowlist de IP — apenas IPs autorizados acessam o banco.
- Containers na rede `bru` continuam usando hostname interno `bizu-hub_postgres:5432`.
- Em Docker Swarm, portas publicadas ficam em `0.0.0.0` — a camada confiável de restrição é o `ufw`.
- Documentação completa: `INFRA_POSTGRES_EXTERNAL_ACCESS.md`.
- **Nota para agentes:** nunca expor `DIRECT_URL` com credenciais reais em commits.

---

## SpecifyX, Skills e Rules

**SpecifyX:** `.specify/config.toml`, `.specify/memory/constitution.md`, `.specify/templates/`, `.specify/scripts/`.
- Fluxo: Specify → Clarify → Plan → Tasks → Analyze → Implement.
- Comandos: `/constitution`, `/specify`, `/clarify`, `/plan`, `/tasks`, `/analyze`, `/implement`, `/guide`.
- Agentes: `architecture-reviewer`, `code-reviewer`, `documentation-reviewer`, `implementer`, `spec-reviewer`, `test-reviewer`.

**Rules do Cursor (`.cursor/rules/*.mdc`):**
- `karpathy-guidelines.mdc` — mudanças cirúrgicas, simplicidade antes de abstração.
- `portal-scope.mdc` — template multiuso; não bloquear evoluções legítimas.
- `portal-stack.mdc` (`alwaysApply: true`) — React Router Framework Mode + Hono integrado (sem `server/`, sem proxy Vite).
- `portal-supabase.mdc` — Supabase apenas auxiliar.
- `git-gitlab-manual-actions.mdc` — operações git/GitLab devem ser solicitadas ao usuário.
- `ai-context-governance.mdc` — always-on: manter contexto técnico atualizado.

---

## Bugs Históricos Resolvidos

| ID | Descrição | Status |
|----|-----------|--------|
| BUG-001 | `.env.example` indicava `PORT=3001` (correto: 3000) | ✅ Corrigido |
| BUG-002 | `README.md` desatualizado pós-migração (Vite :5173, scripts antigos) | ✅ Reescrito |
| BUG-003 | `.cursor/rules/portal-stack.mdc` descrevia arquitetura antiga (`server/`, proxy) | ✅ Atualizada |
| BUG-004 | `.cursor/rules/portal-scope.mdc` bloqueava evoluções legítimas do template | ✅ Atualizada |
| BUG-005 | `next-themes` instalado mas não usado | ✅ Desinstalado |
| RISK-001 | `/api/contact` sem Zod — validação manual simples | ✅ Corrigido |
| RISK-002 | Migrations não disponíveis no runtime Docker | ✅ Resolvido com `migrate-production.ts` |
| RISK-003 | Blog estático em `posts.ts` | ✅ Migrado para Drizzle (spec 001) |

---

## Roadmap Técnico

### Próximas prioridades

- Dashboard: implementar subrotas (`/projetos`, `/clientes`, `/arquivos`, `/relatorios`, `/configuracoes`).
- Sitemap dinâmico: geração automática ao publicar posts.
- CTA tracking: `trackCTAClick()` nos botões hero e CTA section.
- Schemas compartilhados adicionais conforme novos forms/APIs surgirem.

### Médio prazo

- API client tipado para Hono ou helpers de fetch padronizados.
- Modelos `clients`, `projects`, `project_updates`, `files`.
- Supabase Storage integrado aos arquivos do dashboard.
- CI com typecheck/build/test.

### Longo prazo

- Multi-tenant/organizations.
- Billing Stripe.
- E-mails transacionais via Nodemailer.
- RBAC/permissões.
- Observabilidade: logs estruturados, health/readiness, tracing.
- Backups e restore documentados para VPS.

---

## Qualidade — Comandos

```bash
npm run typecheck
npm run build
```

Smoke test local de produção:
```powershell
$env:NODE_ENV="production"; $env:PORT="3000"; node build/server/index.js
```

Rotas para smoke test: `/api/health`, `/`, `/blog`, `/blog/reduzir-mensagens-de-status`, `/login`, `/dashboard` (sem auth → shell vazio, sem dados sensíveis).
