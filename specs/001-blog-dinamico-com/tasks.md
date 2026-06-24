# Tasks: Blog Dinâmico com Mídia Relacional

**Spec**: `specs/001-blog-dinamico-com/spec.md`
**Feature ID**: `001`
**Created**: 2026-06-23
**Stack**: TypeScript · React Router v7 SSR · Drizzle ORM · Postgres · Supabase Storage

---

## Convenções

- **[P]** = pode rodar em paralelo com outras tarefas [P] do mesmo bloco (arquivos diferentes)
- Sem [P] = sequencial (depende da anterior ou edita o mesmo arquivo)
- Cada tarefa tem escopo de **um arquivo ou ação atômica**
- Rodar `npm run typecheck` ao final de cada fase

---

## Fase 1 — Dependência: Renderer de Markdown

- [x] **T001** Instalar `react-markdown` e `remark-gfm`:
  ```bash
  npm install react-markdown remark-gfm
  ```
  Verificar em `package.json` que as deps foram adicionadas.

---

## Fase 2 — Schema Drizzle (4 tabelas novas)

> Editar `src/db/schema.ts`. Tarefas sequenciais — mesmo arquivo.

- [x] **T002** Adicionar tabela `posts` em `src/db/schema.ts`:
  - Campos: `id` (uuid, PK), `slug` (text, unique, notNull), `title` (text, notNull),
    `excerpt` (text, notNull), `content` (text, notNull — Markdown),
    `tag` (text, notNull), `date` (text, notNull — display label),
    `publishedAt` (timestamp com timezone, notNull),
    `cover` (text, nullable — caminho relativo ou URL),
    `status` (text, notNull, default `'draft'` — valores: `'published'` | `'draft'`),
    `createdAt` (timestamp, notNull, defaultNow),
    `updatedAt` (timestamp, notNull, defaultNow).
  - Exportar tipos: `Post`, `NewPost`.

- [x] **T003** Adicionar tabela `post_images` em `src/db/schema.ts`:
  - Campos: `id` (uuid, PK), `postId` (uuid, FK → posts.id, cascade delete),
    `url` (text, notNull), `alt` (text, notNull), `position` (integer, notNull, default 0),
    `createdAt` (timestamp, notNull, defaultNow).
  - Exportar tipos: `PostImage`, `NewPostImage`.

- [x] **T004** Adicionar tabela `post_media` em `src/db/schema.ts`:
  - Campos: `id` (uuid, PK), `postId` (uuid, FK → posts.id, cascade delete),
    `mediaType` (text, notNull — `'mp3'` | `'mp4'`),
    `deliveryMode` (text, notNull — `'embed'` | `'file'`),
    `url` (text, notNull), `title` (text, notNull),
    `position` (integer, notNull, default 0),
    `createdAt` (timestamp, notNull, defaultNow).
  - Exportar tipos: `PostMedia`, `NewPostMedia`.

- [x] **T005** Adicionar tabela `post_attachments` em `src/db/schema.ts`:
  - Campos: `id` (uuid, PK), `postId` (uuid, FK → posts.id, cascade delete),
    `name` (text, notNull), `description` (text, nullable),
    `url` (text, notNull), `position` (integer, notNull, default 0),
    `createdAt` (timestamp, notNull, defaultNow).
  - Exportar tipos: `PostAttachment`, `NewPostAttachment`.

---

## Fase 3 — Migration

- [x] **T006** Gerar migration Drizzle:
  ```bash
  npm run db:generate
  ```
  Verificar que o arquivo gerado em `drizzle/` cria as 4 tabelas com FKs corretas.

- [x] **T007** Aplicar migration no banco local:
  ```bash
  npm run db:migrate
  ```
  Confirmar via Drizzle Studio (`npm run db:studio`) ou `psql` que as tabelas existem.

---

## Fase 4 — Seed Script

- [x] **T008** Criar `scripts/seed-posts.ts`:
  - Importar dados dos 3 posts de `src/lib/content/posts.ts`.
  - Inserir na tabela `posts` via Drizzle com `status: 'published'`.
  - Preservar slugs exatamente: `reduzir-mensagens-de-status`,
    `precificacao-para-freelancers-2026`, `stack-ideal-portais-de-clientes`.
  - Usar `onConflictDoNothing()` para ser idempotente (re-executável sem duplicar).
  - Adicionar script em `package.json`: `"db:seed": "tsx scripts/seed-posts.ts"`.

- [x] **T009** Executar e validar seed:
  ```bash
  npm run db:seed
  ```
  Confirmar via Drizzle Studio que os 3 posts estão na tabela com status `published`.

---

## Fase 5 — Camada de Dados (query functions)

- [x] **T010** Criar helper de cálculo de tempo de leitura em
  `src/lib/content/read-time.ts`:
  - Função `calculateReadTime(content: string): string`.
  - Lógica: `Math.ceil(wordCount / 200)` → retorna `"N min"`.
  - Mínimo: `"1 min"`.

- [x] **T011** [P] Criar tipo `PostWithRelations` em `src/db/schema.ts` ou
  `src/lib/content/types.ts`:
  - Estende `Post` com: `images: PostImage[]`, `media: PostMedia[]`,
    `attachments: PostAttachment[]`, `readTime: string`.

- [x] **T012** Criar `src/lib/content/posts.server.ts` com novas implementações:
  - `getAllPosts()`: query Drizzle em `posts` WHERE `status = 'published'`
    ORDER BY `publishedAt DESC`. Mapeia resultado adicionando `readTime`
    calculado. Retorna `PostWithRelations[]` sem relações (listagem não precisa).
  - `getPostBySlug(slug: string)`: query Drizzle com LEFT JOIN em
    `post_images`, `post_media`, `post_attachments` WHERE `slug = ?`
    AND `status = 'published'`. Retorna `PostWithRelations | undefined`.
  - **Não remover** `src/lib/content/posts.ts` ainda — só adicionar `@deprecated`
    no JSDoc após validação.

---

## Fase 6 — Atualizar Loaders (SSR)

- [x] **T013** Atualizar loader de `/blog` (`src/routes/blog.tsx`):
  - Trocar import de `getAllPosts` de `posts.ts` para `posts.server.ts`.
  - Loader já existente continua igual — só muda a origem dos dados.
  - Verificar que `readTime` aparece no retorno (calculado).

- [x] **T014** Atualizar loader de `/blog/:slug` (`src/routes/blog-post.tsx`):
  - Trocar import de `getPostBySlug` de `posts.ts` para `posts.server.ts`.
  - O loader agora recebe `PostWithRelations` (com `images`, `media`, `attachments`).
  - Manter retorno de 404 para `undefined`.
  - Manter `meta` function inalterada (Open Graph já usa `cover`).

---

## Fase 7 — Componentes de Mídia (Frontend)

- [x] **T015** [P] Criar `src/components/blog/post-gallery.tsx`:
  - Props: `images: PostImage[]`.
  - Renderiza grade responsiva de imagens em ordem crescente de `position`.
  - Cada `<img>` com `alt` obrigatório e `loading="lazy"`.
  - Retorna `null` se `images.length === 0`.

- [x] **T016** [P] Criar `src/components/blog/post-media.tsx`:
  - Props: `items: PostMedia[]`.
  - Para `deliveryMode === 'embed'`: renderiza `<iframe src={url} title={title}>`.
  - Para `deliveryMode === 'file'` + `mediaType === 'mp3'`: renderiza
    `<audio controls src={url}>`.
  - Para `deliveryMode === 'file'` + `mediaType === 'mp4'`: renderiza
    `<video controls src={url}>`.
  - Itens em ordem crescente de `position`.
  - Retorna `null` se `items.length === 0`.

- [x] **T017** [P] Criar `src/components/blog/post-attachments.tsx`:
  - Props: `attachments: PostAttachment[]`.
  - Renderiza grid de cards com `name`, `description` (opcional) e botão download.
  - Link com `target="_blank"` e `rel="noopener noreferrer"`.
  - Retorna `null` se `attachments.length === 0`.

---

## Fase 8 — Integrar na Página de Detalhe do Post

- [x] **T018** Atualizar página de detalhe do post (componente em
  `src/pages/` ou direto em `src/routes/blog-post.tsx`):
  - Adicionar renderer de Markdown: usar `<ReactMarkdown remarkPlugins={[remarkGfm]}>`.
  - Substituir renderização atual de `content` pelo renderer Markdown.
  - Adicionar `<PostGallery images={post.images} />` após o conteúdo.
  - Adicionar `<PostMedia items={post.media} />` após galeria.
  - Adicionar `<PostAttachments attachments={post.attachments} />` após mídia.

---

## Fase 9 — Validação Manual

- [x] **T019** Rodar `npm run typecheck` — deve passar sem erros.

- [x] **T020** Rodar `npm run dev` e validar `/blog`:
  - 3 posts aparecem com slugs corretos.
  - `readTime` calculado exibido corretamente.
  - Posts `draft` não aparecem na listagem.

- [x] **T021** Validar `/blog/reduzir-mensagens-de-status`:
  - Conteúdo renderizado (mesmo que seja texto simples nos posts atuais).
  - Meta tags / Open Graph presentes no `<head>`.
  - Galeria, mídia e anexos: seções ausentes (posts do seed não têm).
  - 404 correto para slug inexistente.

- [x] **T022** Rodar `npm run build` — build de produção sem erros.

---

## Fase 10 — Limpeza & Documentação

- [x] **T023** Marcar `src/lib/content/posts.ts` como `@deprecated` no JSDoc.
  Manter arquivo — será removido em PR futuro após produção validada.

- [x] **T024** [P] Atualizar `AI_CONTEXT.md`:
  - Remover item "Evoluir blog estático para tabela Drizzle" das pendências.
  - Adicionar seção descrevendo novo schema do blog e relações.

- [x] **T025** [P] Atualizar `PROJECT_TECHNICAL_SPEC.md`:
  - Seção 7 (Banco): adicionar as 4 tabelas e relações.
  - Seção 5 (Blog): atualizar para fonte Drizzle + Markdown + relações de mídia.

- [x] **T026** Atualizar `README.md`:
  - Adicionar passo `npm run db:seed` no bloco "Como Clonar e Rodar (dev)"
    após `npm run db:migrate`.

---

## Dependências entre Tarefas

```
T001 (react-markdown)
  └── T018 (usar no template)

T002 → T003 → T004 → T005 (schema, sequencial — mesmo arquivo)
  └── T006 (generate) → T007 (migrate)
        └── T008 (seed) → T009 (validar seed)
              └── T012 (query functions)
                    ├── T013 (loader /blog)
                    └── T014 (loader /blog/:slug)
                          └── T018 (página detalhe)

T010 [helper readTime] ──→ T012
T011 [tipo] ─────────────→ T012

T015, T016, T017 [P] ────→ T018

T018 → T019 → T020 → T021 → T022

T022 → T023 → T024 [P] / T025 [P] → T026
```

---

## Execução Paralela

**Bloco paralelo A** (após T005 e T007):
```
T010 — helper readTime
T011 — tipo PostWithRelations
```

**Bloco paralelo B** (após T001):
```
T015 — PostGallery component
T016 — PostMedia component
T017 — PostAttachments component
```

**Bloco paralelo C** (após T022):
```
T024 — atualizar AI_CONTEXT.md
T025 — atualizar PROJECT_TECHNICAL_SPEC.md
```

---

## Checklist de Completude

- [x] Todas as 4 tabelas criadas e migradas (T002–T007)
- [x] Seed idempotente rodando (T008–T009)
- [x] `getAllPosts()` e `getPostBySlug()` consultando Drizzle (T012–T014)
- [x] `readTime` calculado automaticamente (T010, T012)
- [x] Filtro `published` ativo nos loaders (T013–T014)
- [x] 404 para `draft` e slug inexistente (T014)
- [x] Galeria, mídia e anexos renderizando (T015–T018)
- [x] Markdown renderizado com segurança (T018)
- [x] Open Graph inalterado (T014, T021)
- [x] `typecheck` e `build` passando (T019, T022)
- [x] Documentação atualizada (T023–T026)

---

**Total: 26 tarefas | Paralelas: 8 | Sequenciais: 18**
