# Research: Busca Assíncrona no Blog

**Feature ID**: `003`  
**Date**: 2026-06-27  
**Status**: Complete

---

## R1 — Endpoint Hono vs loader-only

**Decision**: `GET /api/blog/search` em `src/api/app.ts` (ou `src/api/routes/blog-search.ts` importado por `app.ts`).

**Rationale**: Spec exige AJAX; Hono já montado em `src/server.ts` mesma origem; read-only público.

**Alternatives considered**:
- Busca client-side no array SSR — rejeitado (spec Q1: servidor; content pesado).
- Resource route React Router — possível, mas projeto padroniza API em Hono.

---

## R2 — Query Drizzle (ILIKE + categoria)

**Decision**:

```typescript
// Texto: OR ilike title, excerpt, content — pattern escapado
// Base: status = 'published'
// Categoria:
//   todos → sem filtro extra
//   sem-categoria → NOT EXISTS post_categories
//   slug → EXISTS join categories.slug = category
// ORDER BY published_at DESC
// LIMIT 50
```

Helper `escapeIlike(term: string)` — escapa `\`, `%`, `_`.

**Rationale**: Volume <50 posts; ILIKE suficiente (spec fora de escopo tsvector).

---

## R3 — Schema Zod query params

**Decision**: `src/lib/schemas/blog-search.ts`

```typescript
blogSearchQuerySchema = z.object({
  q: z.string().trim().min(3).max(200),
  category: z.string().default(ALL_FILTER_SLUG),
});
```

**Rationale**: Alinhado a contact schema; 400 automático via `@hono/zod-validator`.

---

## R4 — Resposta API (sem `content` completo)

**Decision**: JSON `{ posts: BlogPostSummary[] }` — campos card/preview only; `readTime` calculado server-side; `categories[]` via `attachCategoriesToPosts`.

**Rationale**: FR-002; reduz payload; content só usado na query WHERE.

---

## R5 — Hook client `useBlogSearch`

**Decision**: `src/lib/blog/use-blog-search.ts`

- State: `status` (`idle` | `typing` | `loading` | `results` | `empty` | `error`), `results`, `query`
- Debounce 300 ms (`useEffect` + timer ou `useDebouncedValue`)
- `AbortController` ref; abort on new fetch / unmount
- `fetch(\`/api/blog/search?q=${encodeURIComponent(q)}&category=${slug}\`)`
- Re-run when `activeCategorySlug` changes if `q.length >= 3`
- Preview slice: `results.slice(0, 10)`; grid: full `results`

**Rationale**: FR-007–FR-014 centralizados; testável.

---

## R6 — Componente UI

**Decision**: `BlogSearchCombobox` em `src/components/blog/blog-search-combobox.tsx`

- shadcn `Input` + `Loader2` (lucide) spinner
- Dropdown absoluto abaixo do input (`role="listbox"`)
- `role="combobox"`, `aria-expanded`, `aria-busy`, `aria-live="polite"`
- Escape fecha preview
- Constantes em `src/lib/content/search-constants.ts` (min chars, debounce, messages)

**Rationale**: FR-006, FR-009, FR-013; separação de `blog.tsx`.

---

## R7 — Integração `blog.tsx`

**Decision**:

- Manter loader SSR (posts + menuCategories) para idle state
- `displayPosts` = busca ativa ? `searchResults` : `filterPostsByCategory(posts, activeSlug)`
- `BlogSearchCombobox` acima de `BlogCategoryFilter`
- Extrair grid para `BlogPostGrid` (opcional, DRY) — reutiliza cards existentes

**Rationale**: Regressão spec 002 quando busca idle; FR-010–FR-012.

---

## R8 — Filtro categoria no SQL (paridade spec 002)

**Decision**: Reutilizar slugs de `category-constants.ts` no server; lógica espelhada em SQL (não chamar `filterPostsByCategory` em memória após busca ampla).

**Rationale**: FR-004; eficiência; single source of truth para slugs sentinela.

---

## R9 — Testes e validação

**Decision**: Manual via `quickstart.md` + `npm run typecheck` (sem vitest no repo).

**Rationale**: Mesmo padrão specs 001/002.

---

## R10 — Copy pt-BR

| Constante | Texto |
|-----------|--------|
| `EMPTY_SEARCH_MESSAGE` | Nenhum post encontrado. |
| `SEARCH_ERROR_MESSAGE` | Não foi possível buscar. Tente novamente. |
| Input label | Buscar posts |
| aria-live | `{n} resultado(s) encontrado(s)` |

---
