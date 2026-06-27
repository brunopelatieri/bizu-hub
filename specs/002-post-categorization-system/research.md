# Research: Sistema de Categorização de Posts

**Feature ID**: `002`  
**Date**: 2026-06-26  
**Status**: Complete

---

## R1 — Slug de categorias

**Decision**: Kebab-case ASCII derivado do `name` pt-BR, sem acentos.

| name (pt-BR)   | slug           | position |
|----------------|----------------|----------|
| Produtividade  | `produtividade`| 1        |
| Negócios       | `negocios`     | 2        |
| Ferramentas    | `ferramentas`  | 3        |
| Teste          | `teste`        | 99       |

**Rationale**: URL-safe, estável para filtro client-side e seeds; alinhado a convenções web comuns.

**Alternatives considered**:
- Slug = name exato ("Negócios") — rejeitado (espaços/acentos em filtros).
- UUID como slug — rejeitado (UX ruim no menu/debug).

---

## R2 — Modelo Drizzle Many-to-Many

**Decision**: Tabelas `categories` + `post_categories` com composite PK `(post_id, category_id)` e `ON DELETE CASCADE` em ambas FKs.

**Rationale**: Spec exige M2M read-only; junction table é padrão Drizzle/Postgres; CASCADE simplifica cleanup se post/categoria for removido externamente.

**Alternatives considered**:
- `category_id` FK em `posts` (M2O) — rejeitado na clarificação (M2M).
- Array `category_ids uuid[]` em `posts` — rejeitado (sem FK por item, pior para queries de menu).

---

## R3 — Estratégia de migration (`tag` → M2M)

**Decision**: Migration SQL em 5 passos dentro de um arquivo Drizzle Kit:

1. `CREATE TABLE categories` + `INSERT` seed (4 categorias).
2. `CREATE TABLE post_categories`.
3. `INSERT INTO post_categories` via `JOIN posts ON categories.name = posts.tag`.
4. `ALTER TABLE posts DROP COLUMN tag`.
5. (Opcional) índices: `post_categories(category_id)`, `post_categories(post_id)`.

**Rationale**: Migração atômica; posts existentes têm `tag` NOT NULL — 1 vínculo por post; posts futuros sem vínculo → `categories: []` → UI "Sem categoria".

**Alternatives considered**:
- Manter `tag` deprecated — rejeitado (spec FR-003/Q3).
- Seed categories em script TS separado — rejeitado (spec pede seed na migration).

---

## R4 — Queries server (`posts.server.ts`)

**Decision**:

- **`getAllPosts()`**: 2 queries — (1) posts `published` ordenados; (2) `post_categories` + `categories` para os IDs retornados; montar `categories[]` por post em memória (N posts ≪ 100).
- **`getPostBySlug()`**: mesma junção para um post + relações existentes (images/media/attachments).
- **`getCategoriesForBlogMenu()`**: `SELECT DISTINCT categories.*` com join em `post_categories` + `posts` onde `status = 'published'`, `ORDER BY position, name`.

**Rationale**: Volume baixo (spec); evita N+1 com 2 queries batch; menu só categorias com posts publicados (FR-009).

**Alternatives considered**:
- Drizzle `relational queries` com `with: { categories }` — avaliar no implement; equivalente funcional.
- API Hono `/api/categories` — rejeitado (blog já SSR via loaders; sem CRUD).

---

## R5 — Filtro client-side e sentinela "Sem categoria"

**Decision**:

- Constantes em `src/lib/content/category-constants.ts`:
  - `UNCategorized_FILTER_SLUG = "sem-categoria"` (sentinela interna, **não** row em DB)
  - `UNCategorized_LABEL = "Sem categoria"`
  - `ALL_FILTER_SLUG = "todos"`
- Componente `BlogCategoryFilter` com `useState<string>` para slug ativo.
- Filtragem em `blog.tsx`: se `sem-categoria` → `post.categories.length === 0`; se slug DB → `post.categories.some(c => c.slug === active)`; se `todos` → todos.

**Rationale**: FR-004/010/011/020; sem round-trip; estado visual via `aria-current="true"` no item ativo.

**Alternatives considered**:
- URL search param `?c=` — rejeitado na clarificação Q4.
- Categoria "Sem categoria" no banco — rejeitado (FR-020: item fixo, não row).

---

## R6 — Componentes UI reutilizáveis

**Decision**:

- `PostCategoryBadges` — recebe `categories: { slug, name }[]`; 0 → badge "Sem categoria"; N → N badges.
- `BlogCategoryFilter` — menu horizontal scroll (`overflow-x-auto`, `flex gap-2`); pills com shadcn `Button variant="outline"` / `secondary` para ativo.

**Rationale**: DRY entre `/blog`, `/blog/:slug`, landing; mobile-first (FR-013).

---

## R7 — Landing `BlogSection` + SSR

**Decision**: Adicionar `loader` em `src/routes/home.tsx` que chama `getRecentPosts(3)` (wrapper de `getAllPosts().slice(0,3)` ou query limit 3). Passar `posts` como prop via `useLoaderData` em wrapper ou refatorar `BlogSection` para receber `posts` do route.

**Rationale**: FR-015; remove dependência de `posts.ts` deprecated na landing.

**Alternatives considered**:
- Fetch client-side na landing — rejeitado (inconsistente com SSR blog).
- Manter `posts.ts` só na landing — rejeitado (FR-015).

---

## R8 — Testes e validação

**Decision**: Projeto **não possui** runner de testes automatizado (sem vitest/jest em `package.json`). Validação via:

1. `npm run typecheck`
2. Checklist manual em `quickstart.md` (15 cenários da spec)
3. Drizzle Studio / SQL para verificar migration

**Rationale**: Alinhado à entrega spec 001; constitution TDD aplicada como **validação manual documentada** até runner ser adicionado ao template.

**Alternatives considered**:
- Adicionar vitest nesta feature — fora do escopo mínimo; pode ser task futura opcional.

---

## R9 — Copy estado vazio (filtro sem resultados)

**Decision**: Mensagem pt-BR: **"Nenhum post nesta categoria."** (com `role="status"` para acessibilidade).

**Rationale**: FR cenário 8; copy curta e clara.

---
