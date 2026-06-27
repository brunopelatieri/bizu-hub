# Implementation Plan: Busca Assíncrona no Blog

**Branch**: `main` | **Date**: 2026-06-27 | **Spec**: [spec.md](./spec.md)  
**Feature ID**: `003`  
**Input**: Feature specification from `specs/003-async-ajax-blog/spec.md`

## Execution Flow (/plan command scope)
```
1. Load feature spec ✅
2. Fill Technical Context ✅
3. Constitution Check ✅
4. Phase 0 → research.md ✅
5. Phase 1 → contracts, data-model.md, quickstart.md ✅
6. Post-Design Constitution Check ✅
7. Phase 2 → Task generation approach documented ✅
8. STOP — Ready for /tasks command
```

## Summary

Adicionar `GET /api/blog/search` (Hono + Drizzle ILIKE) e UI search-as-you-type
em `/blog` com debounce 300 ms, AbortController, preview dropdown, loader e
integração com filtro de categoria da spec 002 — sem recarregar a página.

## Technical Context

**Project**: bizu-hub  
**Language/Version**: TypeScript 5.9, React 19, React Router v7 SSR  
**Primary Dependencies**: Hono, Drizzle ORM, Zod, shadcn/ui, lucide-react  
**Storage**: Postgres (posts, categories, post_categories — sem migration nova)  
**Testing**: Manual (`quickstart.md`) + `npm run typecheck`  
**Target Platform**: Monolith Node (VPS Docker)  
**Project Type**: Web monolith — `/api/*` Hono + `/blog` SSR  
**Performance**: Debounce 300ms; cap 50 API / 10 preview; ILIKE OK for <50 posts  
**Constraints**: Read-only; published only; pt-BR UI; a11y combobox  
**Scale/Scope**: 1 endpoint, 1 hook, 1–2 componentes, refactor leve `blog.tsx`

## Constitution Check

**Simplicity**: 1 endpoint, 1 search function, 1 hook — sem camada Repository extra.  
**Testing**: Manual documentado (desvio specs 001/002).  
**Gate**: PASS com validação manual.

## Project Structure

### Documentation
```
specs/003-async-ajax-blog/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
└── tasks.md          # /tasks command
```

### Source touch map
```
src/lib/schemas/blog-search.ts           # Zod query
src/lib/content/search-constants.ts      # debounce, messages
src/lib/content/search.server.ts         # searchPublishedPosts()
src/lib/content/escape-ilike.ts          # escape % _ \
src/lib/blog/use-blog-search.ts          # hook
src/components/blog/blog-search-combobox.tsx
src/components/blog/blog-post-grid.tsx     # optional extract
src/api/app.ts                           # mount GET /api/blog/search
src/routes/blog.tsx                      # integrate search + grid logic
.context/onboarding/AI_CONTEXT.md
.context/spec/TECHNICAL_SPEC_COMPACT.md
```

## Phase 0: Research

[research.md](./research.md) — R1–R10 (endpoint, ILIKE, Zod, hook, UI, integração).

## Phase 1: Design & Contracts

- [data-model.md](./data-model.md) — query/response, state machine
- [contracts/blog-search.openapi.json](./contracts/blog-search.openapi.json)
- [quickstart.md](./quickstart.md) — 15 checks

## Phase 2: Task Planning Approach

1. Constants + Zod schema + escapeIlike helper  
2. `searchPublishedPosts()` Drizzle  
3. Hono route + wire in `app.ts`  
4. `useBlogSearch` hook  
5. `BlogSearchCombobox` component  
6. Integrate `blog.tsx` (+ optional `BlogPostGrid`)  
7. Docs + typecheck + quickstart  

**Estimated tasks**: ~14–18  
**Parallel [P]**: schema/constants, hook, combobox após search.server

## Complexity Tracking

| Violation | Why | Alternative rejected |
|-----------|-----|---------------------|
| No automated tests | Repo pattern | vitest out of scope |
| ILIKE vs tsvector | <50 posts | FTS overkill per spec |

## Progress Tracking

**Phase Status**:
- [x] Phase 0: Research complete
- [x] Phase 1: Design complete
- [x] Phase 2: Task approach documented
- [x] Phase 3: Tasks generated (/tasks)
- [x] Phase 4: Implementation
- [x] Phase 5: Validation (typecheck + API curl; UI manual pendente no browser)

**Gate Status**:
- [x] Initial Constitution Check: PASS
- [x] Post-Design Constitution Check: PASS
- [x] NEEDS CLARIFICATION: none

---
*Based on Constitution v1.0.0*
