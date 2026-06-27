# Implementation Plan: Sistema de Categorização de Posts

**Branch**: `main` | **Date**: 2026-06-26 | **Spec**: [spec.md](./spec.md)  
**Feature ID**: `002`  
**Input**: Feature specification from `specs/002-post-categorization-system/spec.md`

## Execution Flow (/plan command scope)
```
1. Load feature spec from Input path ✅
2. Fill Technical Context ✅
3. Constitution Check ✅
4. Phase 0 → research.md ✅
5. Phase 1 → contracts, data-model.md, quickstart.md ✅
6. Post-Design Constitution Check ✅
7. Phase 2 → Task generation approach documented ✅
8. STOP — Ready for /tasks command
```

## Summary

Introduzir categorias normalizadas no Postgres (`categories` + `post_categories`
Many-to-Many), migrar dados de `posts.tag`, e conectar ao frontend do blog com
menu de filtro client-side ("Todos", "Sem categoria", categorias com posts
publicados), badges múltiplos por post, e landing SSR — **sem CRUD** de
categorias.

Abordagem técnica: Drizzle schema + migration SQL com seed; funções server em
`posts.server.ts` / `categories.server.ts`; componentes `BlogCategoryFilter` e
`PostCategoryBadges`; loader em `home.tsx` para `BlogSection`.

## Technical Context

**Project**: bizu-hub  
**Language/Version**: TypeScript 5.9, Node 22+  
**Primary Dependencies**: React Router v7 (SSR), Drizzle ORM 0.44, postgres.js, shadcn/ui, Tailwind v4  
**Storage**: Postgres externo (`DATABASE_URL` / `DIRECT_URL`)  
**Testing**: Manual (`quickstart.md`) + `npm run typecheck` — sem runner automatizado no repo  
**Target Platform**: VPS Ubuntu, Docker/Portainer, processo único Node  
**Project Type**: Web (monolith SSR + Hono API; blog via loaders, não API REST)  
**Performance Goals**: Filtro client-side instantâneo; <50 posts publicados  
**Constraints**: Sem CRUD; sem `posts.tag` após migration; UI pt-BR; mobile-first menu  
**Scale/Scope**: 4 categorias seed + M2M; 3 arquivos de rota blog + landing + 2 seeds

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**Simplicity**:
- Projects: **1** (monolith `src/`)
- Using framework directly? **Yes** — Drizzle + React Router loaders, sem Repository layer
- Single data model? **Yes** — tipos em `schema.ts` + `types.ts`, sem DTO duplicado
- Avoiding patterns? **Yes** — sem UoW/Event bus

**Architecture**:
- Feature em código app existente (`src/db`, `src/lib/content`, `src/components/blog`)
- Sem nova biblioteca npm além do já presente

**Testing (NON-NEGOTIABLE)**:
- Runner automatizado **ausente** no template atual → **desvio documentado** em
  `spec.md` § *Validação e Testes* e `tasks.md` convenções (T024 + T025).
- Ordem implementação: schema → migration → server → UI → typecheck → quickstart
- Constitution §III satisfeita nesta entrega via gates manuais, não via TDD automatizado.

**Observability**:
- Erros de DB propagam em loaders (404/500 existentes); sem logging novo necessário

**Gate**: **PASS** com desvio documentado (testes manuais)

## Project Structure

### Documentation (this feature)
```
specs/002-post-categorization-system/
├── plan.md              # This file
├── research.md          # Phase 0 ✅
├── data-model.md        # Phase 1 ✅
├── quickstart.md        # Phase 1 ✅
├── contracts/           # Phase 1 ✅
│   ├── README.md
│   └── loader-shapes.ts
└── tasks.md             # Phase 2 — /tasks command
```

### Source Code (touch map)
```
src/db/schema.ts                          # categories, post_categories; drop tag
drizzle/0003_*.sql                        # migration gerada + SQL seed/data
src/lib/content/category-constants.ts     # NEW — sentinela sem-categoria
src/lib/content/categories.server.ts      # NEW — getCategoriesForBlogMenu()
src/lib/content/posts.server.ts             # JOIN categories; remove tag usage
src/lib/content/types.ts                  # categories[] on PostWithRelations
src/components/blog/post-category-badges.tsx   # NEW
src/components/blog/blog-category-filter.tsx   # NEW
src/routes/blog.tsx                         # loader + filter + badges
src/routes/blog-post.tsx                    # badges
src/routes/home.tsx                         # loader recentPosts
src/components/landing/blog-section.tsx     # props from loader
scripts/seed-posts.ts                       # post_categories
scripts/seed-test-post.ts                   # post_categories
.context/onboarding/AI_CONTEXT.md           # FR-018
.context/spec/TECHNICAL_SPEC_COMPACT.md     # FR-018
```

**Structure Decision**: Option 2 web monolith — frontend e server compartilham `src/`.

## Phase 0: Outline & Research

**Output**: [research.md](./research.md) — 9 decisões (slugs, M2M, migration, queries, filtro, UI, landing, testes, copy).

**NEEDS CLARIFICATION**: Nenhum restante.

## Phase 1: Design & Contracts

**Output**:
- [data-model.md](./data-model.md) — ER, tabelas, tipos, regras RB-001..006
- [contracts/loader-shapes.ts](./contracts/loader-shapes.ts) — tipos loader SSR
- [quickstart.md](./quickstart.md) — checklist 15 cenários + comandos

**Agent context**: `specifyx run update-agent-context claude` executado ✅

## Phase 2: Task Planning Approach

*Executado pelo comando `/tasks` — não gera tasks.md aqui.*

**Task Generation Strategy**:
1. Schema Drizzle (`categories`, `post_categories`, remover `tag`)
2. Gerar/aplicar migration + validar seed SQL inline
3. Server layer (`categories.server.ts`, atualizar `posts.server.ts`, `types.ts`)
4. Constantes + componentes UI (`PostCategoryBadges`, `BlogCategoryFilter`)
5. Rotas (`blog.tsx`, `blog-post.tsx`, `home.tsx`, `blog-section.tsx`)
6. Seeds (`seed-posts.ts`, `seed-test-post.ts`)
7. Docs contexto (AI_CONTEXT, TECHNICAL_SPEC_COMPACT)
8. Validação (`typecheck` + quickstart)

**Ordering**: Sequencial schema → migration → server → UI → seeds → docs  
**Parallel [P]**: componentes UI + constants após types; docs após implementação  
**Estimated tasks**: ~18–22 (menor que spec 001)

## Phase 3+: Future Implementation

**Phase 3**: `/tasks --spec-id 002`  
**Phase 4**: Implementar tasks.md  
**Phase 5**: quickstart.md + deploy migration prod

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| TDD automatizado ausente (constitution §III) | Repo não tem vitest/jest; spec 001 usou o mesmo padrão | Adicionar runner infla escopo; spec § *Validação e Testes* + T024/T025 formalizam gates manuais |
| Migration SQL manual com seed | Spec exige seed na migration, não só script TS | Seed TS-only não roda em prod Portainer sem script extra |

## Progress Tracking

**Phase Status**:
- [x] Phase 0: Research complete (/plan command)
- [x] Phase 1: Design complete (/plan command)
- [x] Phase 2: Task planning approach documented (/plan command)
- [x] Phase 3: Tasks generated (/tasks command)
- [x] Phase 4: Implementation complete
- [x] Phase 5: Validation passed (typecheck ✅; quickstart manual pendente no browser)

**Gate Status**:
- [x] Initial Constitution Check: PASS (com desvio testes manuais)
- [x] Post-Design Constitution Check: PASS
- [x] All NEEDS CLARIFICATION resolved
- [x] Complexity deviations documented

---
*Based on Constitution v1.0.0 — See `.specify/memory/constitution.md`*
