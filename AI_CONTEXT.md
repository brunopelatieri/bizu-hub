# AI Context — Bizu Hub Bruno Goulart

Este arquivo é o ponto de entrada rápido para qualquer LLM/AI Agent entender o
projeto antes de propor ou executar mudanças.

## Objetivo

Projeto pessoal de **Bruno Pelatieri Goulart** que reúne em uma única plataforma:

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

## Pendências Técnicas Conhecidas

- Evoluir blog estático para tabela Drizzle quando virar feature real.
- Criar schemas compartilhados adicionais conforme novos forms/APIs surgirem.
- Adicionar providers prontos para TanStack Query quando houver server state real.
- Job de migrations documentado em `deploy/README.md` (fora do container runtime).
