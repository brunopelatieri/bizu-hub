# Tasks: Sistema de Categorização de Posts

**Spec**: `specs/002-post-categorization-system/spec.md`  
**Plan**: `specs/002-post-categorization-system/plan.md`  
**Feature ID**: `002`  
**Created**: 2026-06-26  
**Stack**: TypeScript · React Router v7 SSR · Drizzle ORM · Postgres

---

## Convenções

- **[P]** = pode rodar em paralelo com outras tarefas [P] do mesmo bloco (arquivos diferentes)
- Sem **[P]** = sequencial (depende da anterior ou edita o mesmo arquivo)
- Cada tarefa tem escopo de **um arquivo ou ação atômica**
- Rodar `npm run typecheck` ao final das fases 4, 5 e 7
- Validação manual: `specs/002-post-categorization-system/quickstart.md`
- **Gate de testes (constitution §III):** sem runner automatizado neste repo —
  validação via T024 (typecheck) + T025 (quickstart manual). Ver seção
  *Validação e Testes* em `spec.md`.

---

## Fase 1 — Schema Drizzle

> Editar `src/db/schema.ts`. Tarefas sequenciais — mesmo arquivo.

- [x] **T001** Adicionar tabela `categories` em `src/db/schema.ts`:
  - Campos: `id` (uuid PK), `slug` (text unique notNull), `name` (text notNull),
    `position` (integer notNull default 0), `createdAt` (timestamptz notNull defaultNow).
  - Exportar tipos: `Category`, `NewCategory`.

- [x] **T002** Adicionar tabela `post_categories` em `src/db/schema.ts`:
  - Campos: `postId` (uuid FK → posts.id cascade), `categoryId` (uuid FK → categories.id cascade).
  - Composite PK `(postId, categoryId)` via `primaryKey()`.
  - Exportar tipos: `PostCategory`, `NewPostCategory`.
  - Importar `primaryKey` de `drizzle-orm/pg-core`.

- [x] **T003** Remover campo `tag` da tabela `posts` em `src/db/schema.ts`.

---

## Fase 2 — Migration

- [x] **T004** Gerar migration Drizzle:
  ```bash
  npm run db:generate
  ```
  Verificar arquivo em `drizzle/0003_*.sql`.

- [x] **T005** Editar o SQL gerado em `drizzle/0003_*.sql` para incluir **antes** do DROP de `tag`:
  1. `INSERT INTO categories` — seed: produtividade (1), negocios (2), ferramentas (3), teste (99).
  2. `INSERT INTO post_categories` — `SELECT p.id, c.id FROM posts p INNER JOIN categories c ON c.name = p.tag`.
  3. Índices opcionais em `post_categories(post_id)` e `post_categories(category_id)`.
  4. `ALTER TABLE posts DROP COLUMN tag` (se não gerado automaticamente).

- [x] **T006** Aplicar migration localmente:
  ```bash
  npm run db:migrate
  ```
  Confirmar via `npm run db:studio`: 4 categorias, vínculos em `post_categories`, coluna `tag` ausente.

---

## Fase 3 — Tipos e constantes

- [x] **T007** [P] Criar `src/lib/content/category-constants.ts`:
  - `ALL_FILTER_SLUG = "todos"`
  - `UNCATEGORIZED_FILTER_SLUG = "sem-categoria"`
  - `UNCATEGORIZED_LABEL = "Sem categoria"`
  - `EMPTY_CATEGORY_MESSAGE = "Nenhum post nesta categoria."`

- [x] **T008** Atualizar `src/lib/content/types.ts`:
  - Adicionar `PostCategorySummary { slug, name, position }`.
  - Adicionar `categories: PostCategorySummary[]` em `PostWithRelations`.

---

## Fase 4 — Camada server

- [x] **T009** [P] Criar `src/lib/content/categories.server.ts`:
  - `getCategoriesForBlogMenu()`: DISTINCT categories com ≥1 post `published`,
    join `post_categories` + `posts`, `ORDER BY position, name`.
  - Retorno: `PostCategorySummary[]`.

- [x] **T010** Criar helper `src/lib/content/post-categories.server.ts` (ou função em `categories.server.ts`):
  - `attachCategoriesToPosts(db, posts[])`: batch query `post_categories` + `categories`;
    retorna map `postId → PostCategorySummary[]` ordenado por position/name.

- [x] **T011** Atualizar `src/lib/content/posts.server.ts`:
  - `getAllPosts()`: usar `attachCategoriesToPosts`; incluir `categories` em cada post.
  - `getPostBySlug()`: incluir `categories` para o post.
  - Remover qualquer referência a `post.tag`.

---

## Fase 5 — Componentes UI

- [x] **T012** [P] Criar `src/components/blog/post-category-badges.tsx`:
  - Props: `categories: PostCategorySummary[]`.
  - Se `length === 0` → um `<Badge>` com `UNCATEGORIZED_LABEL`.
  - Se `length > 0` → um `<Badge>` por categoria (`name`).
  - Reutilizar `Badge` de shadcn.

- [x] **T013** [P] Criar `src/components/blog/blog-category-filter.tsx`:
  - Props: `menuCategories`, `activeSlug`, `onSelect(slug)`.
  - Itens fixos: "Todos", "Sem categoria" + categorias do loader.
  - Layout mobile-first: `flex overflow-x-auto gap-2`.
  - Estado ativo: `aria-current="true"` + variante visual (outline/secondary).
  - Labels pt-BR.

- [x] **T014** [P] Criar `src/lib/content/filter-posts-by-category.ts`:
  - `filterPostsByCategory(posts, activeSlug)`: lógica todos / sem-categoria / slug DB.
  - Exportar função pura para teste manual e uso em `blog.tsx`.

---

## Fase 6 — Rotas e landing

- [x] **T015** Atualizar `src/routes/blog.tsx`:
  - Loader: `getAllPosts()` + `getCategoriesForBlogMenu()`.
  - `useState` para `activeSlug` (default `ALL_FILTER_SLUG`).
  - Renderizar `BlogCategoryFilter` + grid filtrado via `filterPostsByCategory`.
  - Substituir badge `post.tag` por `PostCategoryBadges`.
  - Estado vazio: `EMPTY_CATEGORY_MESSAGE` com `role="status"`.

- [x] **T016** Atualizar `src/routes/blog-post.tsx`:
  - Substituir `{post.tag}` por `<PostCategoryBadges categories={post.categories} />`.

- [x] **T017** Atualizar `src/routes/home.tsx`:
  - Adicionar `loader`: chamar `getAllPosts()`, retornar `{ recentPosts: posts.slice(0, 3) }`.
  - Passar `recentPosts` para `HomePage` (ajustar props).

- [x] **T018** Atualizar `src/pages/home-page.tsx` e `src/components/landing/blog-section.tsx`:
  - `BlogSection` recebe `posts` via props (de loader).
  - Remover import de `@/lib/content/posts` deprecated.
  - Usar `PostCategoryBadges` nos cards.

---

## Fase 7 — Seeds

> **Ordem obrigatória:** T021 antes de T019/T020 (helper compartilhado).

- [x] **T021** Criar `scripts/lib/link-post-categories.ts`:
  - Exportar `linkPostToCategories(db, postSlug, categorySlugs: string[])`.
  - Lookup categorias por `slug`; insert idempotente em `post_categories`
    (`onConflictDoNothing` na PK composta).

- [x] **T019** Atualizar `scripts/seed-posts.ts`:
  - Remover campo `tag` dos inserts.
  - Após insert/onConflict de cada post, chamar `linkPostToCategories`:
    - `reduzir-mensagens-de-status` → `["produtividade"]`
    - `precificacao-para-freelancers-2026` → `["negocios"]`
    - `stack-ideal-portais-de-clientes` → `["ferramentas"]`
  - Manter idempotência em posts e post_categories.

- [x] **T020** Atualizar `scripts/seed-test-post.ts`:
  - Remover `tag`; associar post de teste via `linkPostToCategories(db, slug, ["teste"])`.
  - Opcional (cenário multi-badge): associar também `produtividade` para validar
    ≥2 categorias no mesmo post.

---

## Fase 8 — Documentação de contexto

- [x] **T022** [P] Atualizar `.context/onboarding/AI_CONTEXT.md`:
  - Mencionar tabelas `categories`, `post_categories`; remoção de `posts.tag`.
  - Blog: filtro por categoria client-side; sem CRUD de categorias.

- [x] **T023** [P] Atualizar `.context/spec/TECHNICAL_SPEC_COMPACT.md`:
  - Schema blog + comportamento do menu `/blog`.

---

## Fase 9 — Validação

- [x] **T024** Rodar `npm run typecheck` — corrigir erros de `post.tag` removido em todo o repo.

- [x] **T025** Executar checklist completo em `specs/002-post-categorization-system/quickstart.md`
  (15 cenários C1–C15) **e** verificações negativas:
  - Confirmar **FR-003**: nenhuma rota Hono `/api/*categories*` nem página dashboard CRUD.
  - Testar manualmente `filterPostsByCategory()` (todos / sem-categoria / slug DB).

- [x] **T026** Após implementação, atualizar `plan.md` Progress Tracking:
  - Phase 4 Implementation complete / Phase 5 Validation passed conforme resultado.

---

## Dependências

```
T001 → T002 → T003 → T004 → T005 → T006
T006 → T009, T010, T011
T007, T008 → T012, T013, T014 (paralelo após T008)
T009, T010, T011 → T015, T016, T017
T012 → T015, T016, T018
T013, T014 → T015
T017 → T018
T006 → T021 → T019 → T020
T015–T020 → T024 → T025
T022, T023 [P] após T024
```

---

## Exemplos de execução paralela

**Bloco A** (após T006 + T008):
```
T007 category-constants.ts
T009 categories.server.ts
T012 post-category-badges.tsx
T013 blog-category-filter.tsx
T014 filter-posts-by-category.ts
```

**Bloco B** (após implementação core):
```
T022 AI_CONTEXT.md
T023 TECHNICAL_SPEC_COMPACT.md
```

---

## Validation Checklist

- [x] Entidades `categories`, `post_categories` têm tasks de schema (T001–T002)
- [x] Migration + seed SQL documentados (T004–T006)
- [x] Contract loaders cobertos por T008, T011, T015, T017
- [x] User stories spec → T015–T018 + T025
- [x] Cada task especifica caminho de arquivo
- [x] Tasks [P] não editam o mesmo arquivo

---

## Próximo passo

Implementar na ordem T001→T026 ou usar `/implement --spec-id 002`.
