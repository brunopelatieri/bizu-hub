# Tasks: Busca Assíncrona no Blog

**Spec**: `specs/003-async-ajax-blog/spec.md`  
**Plan**: `specs/003-async-ajax-blog/plan.md`  
**Feature ID**: `003`  
**Created**: 2026-06-27  
**Stack**: TypeScript · React Router v7 · Hono · Drizzle · Zod · shadcn/ui

---

## Convenções

- **[P]** = paralelo (arquivos diferentes, deps satisfeitas)
- Sem **[P]** = sequencial
- Validação: `npm run typecheck` + `specs/003-async-ajax-blog/quickstart.md`
- Gate testes: manual (constitution §III — sem vitest no repo)

---

## Fase 1 — Fundação (constants, schema, helpers)

- [x] **T001** [P] Criar `src/lib/content/search-constants.ts`:
  - `SEARCH_MIN_CHARS = 3`
  - `SEARCH_DEBOUNCE_MS = 300`
  - `SEARCH_API_LIMIT = 50`
  - `SEARCH_PREVIEW_LIMIT = 10`
  - `EMPTY_SEARCH_MESSAGE = "Nenhum post encontrado."`
  - `SEARCH_ERROR_MESSAGE = "Não foi possível buscar. Tente novamente."`
  - `SEARCH_INPUT_LABEL = "Buscar posts"`

- [x] **T002** [P] Criar `src/lib/content/escape-ilike.ts`:
  - Exportar `escapeIlike(value: string): string` — escapar `\`, `%`, `_` para ILIKE.

- [x] **T003** [P] Criar `src/lib/schemas/blog-search.ts`:
  - `blogSearchQuerySchema` com `q` (string trim, min 3, max 200) e `category` (string, default `ALL_FILTER_SLUG` de `category-constants.ts`).
  - Exportar tipo inferido `BlogSearchQuery`.

- [x] **T004** [P] Criar `src/lib/content/types.ts` export adicional (ou `search-types.ts`):
  - `BlogPostSummary` — slug, title, excerpt, date, publishedAt, cover, readTime, categories[].
  - Alinhar com `contracts/blog-search.openapi.json`.

---

## Fase 2 — Server search (Drizzle)

- [x] **T005** Criar `src/lib/content/search.server.ts`:
  - `searchPublishedPosts(q: string, categorySlug: string): Promise<BlogPostSummary[]>`
  - `status = 'published'`
  - ILIKE OR em title, excerpt, content (pattern `%${escapeIlike(q)}%`)
  - Filtro categoria SQL:
    - `todos` → sem extra
    - `sem-categoria` → NOT EXISTS em `post_categories`
    - slug → EXISTS join `categories.slug`
  - `ORDER BY published_at DESC`, `LIMIT 50`
  - Anexar `categories[]` via `attachCategoriesToPosts`
  - Calcular `readTime` (sem retornar `content` no objeto)
  - **Não** incluir campo `content` na resposta

---

## Fase 3 — API Hono

- [x] **T006** Adicionar rota em `src/api/app.ts` (ou `src/api/routes/blog-search.ts` importado):
  - `GET /api/blog/search`
  - `@hono/zod-validator("query", blogSearchQuerySchema)`
  - Chamar `searchPublishedPosts(validated.q, validated.category)`
  - Resposta `{ posts }` JSON 200
  - Erro 500 com mensagem genérica pt-BR em falha DB

---

## Fase 4 — Hook client

- [x] **T007** Criar `src/lib/blog/use-blog-search.ts`:
  - Params: `activeCategorySlug: string`
  - Retorno: `{ status, results, query, setQuery, previewResults, isSearchActive }`
  - Status: `idle` | `typing` | `loading` | `results` | `empty` | `error`
  - Debounce 300 ms; só fetch se `trim(query).length >= 3`
  - `AbortController` — abort request anterior
  - Ignorar resposta se abortada ou query obsoleta
  - Re-fetch quando `activeCategorySlug` muda e busca ativa
  - `previewResults = results.slice(0, SEARCH_PREVIEW_LIMIT)`
  - `isSearchActive = trim(query).length >= 3`

---

## Fase 5 — Componentes UI

- [x] **T008** [P] Criar `src/components/blog/blog-search-combobox.tsx`:
  - Props: hook state/handlers ou props explícitas de `useBlogSearch`
  - shadcn `Input` + `Loader2` spinner quando loading
  - Dropdown preview (`role="listbox"`) — title + excerpt truncado + mini badges
  - Input `role="combobox"`, `aria-expanded`, `aria-busy`, `aria-controls`
  - `aria-live="polite"` para contagem de resultados
  - Escape fecha preview
  - Click item → `Link` ou navigate `/blog/:slug`

- [x] **T009** [P] Criar `src/components/blog/blog-post-grid.tsx`:
  - Extrair grid de cards de `blog.tsx` (props: `posts: PostWithRelations[] | BlogPostSummary[]`)
  - Reutilizar `PostCategoryBadges`, layout existente
  - Empty state via prop `emptyMessage?: string`

---

## Fase 6 — Integração `/blog`

- [x] **T010** Atualizar `src/routes/blog.tsx`:
  - Importar `BlogSearchCombobox`, `useBlogSearch`, `BlogPostGrid`
  - `BlogSearchCombobox` acima de `BlogCategoryFilter`
  - `displayPosts` = `isSearchActive ? searchResults : filterPostsByCategory(posts, activeSlug)`
  - Empty: `EMPTY_SEARCH_MESSAGE` vs `EMPTY_CATEGORY_MESSAGE` conforme contexto
  - Manter loader SSR inalterado (posts + menuCategories)
  - Re-fetch busca ao mudar `activeSlug` (via hook dep)

---

## Fase 7 — Documentação

- [x] **T011** [P] Atualizar `.context/onboarding/AI_CONTEXT.md`:
  - Endpoint `GET /api/blog/search`
  - UX busca `/blog` (debounce, preview, + categoria)

- [x] **T012** [P] Atualizar `.context/spec/TECHNICAL_SPEC_COMPACT.md`:
  - Seção API blog search + query params

---

## Fase 8 — Validação

- [x] **T013** Rodar `npm run typecheck` — corrigir erros.

- [x] **T014** Executar checklist `specs/003-async-ajax-blog/quickstart.md` (C1–C15 + curl API).

- [x] **T015** Atualizar `plan.md` Progress: Phase 3 ✅, Phase 4/5 após implementação.

---

## Dependências

```
T001,T002,T003,T004 [P] → T005
T005 → T006
T001 → T007
T005,T001 → T007
T007 → T008
T009 independente (pode paralelo T008)
T007,T008,T009 → T010
T010 → T013 → T014
T011,T012 [P] após T013
```

---

## Execução paralela

**Bloco A** (início):
```
T001 search-constants.ts
T002 escape-ilike.ts
T003 blog-search.ts schema
T004 BlogPostSummary type
```

**Bloco B** (após T005):
```
T007 use-blog-search.ts
T008 blog-search-combobox.tsx
T009 blog-post-grid.tsx
```

---

## Validation Checklist

- [x] Contract OpenAPI → T006
- [x] search.server → T005
- [x] UI states FR-008 → T007, T008, T010
- [x] Categoria combinada → T005, T007, T010
- [x] Cada task com path de arquivo

---

## Próximo passo

Implementação concluída — validar UI manualmente no browser (`/blog`).
