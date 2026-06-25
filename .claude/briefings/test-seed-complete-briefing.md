# Briefing: Test Seed com Todos os Dados Relacionados

**Project:** bizu-hub — Bruno Goulart AI Automation Specialist & Full Stack Developer  
**Context:** Spec 001 (Blog Dinâmico) com Drizzle migrations; criar seed de teste com galeria + mídia + anexos  
**Commit:** e6a2195 (docs: add git/gitlab manual actions guidelines)  
**Branch:** main  
**Model:** Sonnet  
**Session Type:** New (fresh context)

---

## Objetivo

Criar **3 scripts de seed** para teste completo do blog dinâmico:

1. **`scripts/seed-test-post.ts`** — Post único com todos os dados relacionados (galeria + mídia + anexos)
2. **`scripts/seed-full.ts`** — Combo: post teste + 3 posts originais (teste primeiro por date)
3. **Atualizar `scripts/seed-posts.ts`** — Manter apenas os 3 originais (sem test post)

**Plus:** Adicionar scripts ao `package.json`:
- `npm run db:seed` → apenas 3 originais (como hoje)
- `npm run db:seed:test` → apenas post de teste
- `npm run db:seed:full` → teste + 3 originais

---

## Contexto do Projeto

### Stack
- **Runtime:** Node.js 22, TypeScript 5.9, ESM
- **ORM:** Drizzle ORM + Postgres 16
- **Database URLs:** `DATABASE_URL` (runtime) / `DIRECT_URL` (migrations)
- **Local Postgres:** `postgresql://portal:portal@localhost:15432/portal` (docker-compose)

### Tabelas Relacionadas

```text
posts (1:N relations)
├── post_images (galeria)
├── post_media (áudio, vídeo, iframe)
└── post_attachments (downloads)
```

**Schema:**

```typescript
// posts
id: uuid (PK)
slug: text (unique)
title: text
excerpt: text
content: text (Markdown)
tag: text
date: text (display, ex: "25 Jun 2026")
publishedAt: timestamp (ISO, ex: "2026-06-25T00:00:00+00:00")
cover: text (URL ou path)
status: text ("published" | "draft")

// post_images
id: uuid (PK)
postId: uuid (FK → posts.id, cascade)
url: text
alt: text (required)
position: integer (order)

// post_media
id: uuid (PK)
postId: uuid (FK → posts.id, cascade)
mediaType: text ("mp3" | "mp4")
deliveryMode: text ("embed" | "file")
url: text (src ou URL)
title: text
position: integer (order)

// post_attachments
id: uuid (PK)
postId: uuid (FK → posts.id, cascade)
name: text
description: text (nullable)
url: text
position: integer (order)
```

### Arquivos Relevantes

| Arquivo | Propósito |
|---------|-----------|
| `scripts/seed-posts.ts` | **Referência:** padrão existente (copiar estrutura) |
| `src/db/index.ts` | Cliente Drizzle (usar `getDb()`) |
| `src/db/schema.ts` | Imports das tabelas |
| `.env.local` (dev) | DATABASE_URL = `postgresql://portal:portal@localhost:15432/portal` |
| `package.json` | Adicionar 3 scripts de seed |

---

## Task 1: `scripts/seed-test-post.ts`

### Especificação

**Arquivo:** `scripts/seed-test-post.ts`

**Propósito:** Inserir 1 post completo com todos os dados relacionados

**Post de Teste — Dados Completos:**

```typescript
// POST
{
  slug: "bruno-pelatieri-goulart-documento-teste-markdown",
  title: "Bruno Pelatieri Goulart — Documento de Teste Markdown",
  excerpt: "Full Stack Developer & AI Automation Specialist — 18+ anos de experiência, desde 2006.",
  tag: "Teste",
  date: "25 Jun 2026",  // Display
  publishedAt: "2026-06-25T00:00:00+00:00",  // ISO — MAIS RECENTE que "2026-06-12"
  cover: "https://kpersdlqtrxlytwbuvvv.supabase.co/storage/v1/object/public/bruno-pelatieri-goulart-bh/blog/media/img/bruno_pelatieri_goulart_seed_capa.webp",
  status: "published",
  content: `[MARKDOWN COMPLETO — ver abaixo]`
}

// POST_IMAGES (3)
[
  {
    url: "https://kpersdlqtrxlytwbuvvv.supabase.co/storage/v1/object/public/bruno-pelatieri-goulart-bh/blog/media/img/bruno_pelatieri_goulart_seed1.webp",
    alt: "Bruno Pelatieri Goulart — Foto 1",
    position: 0
  },
  {
    url: "https://kpersdlqtrxlytwbuvvv.supabase.co/storage/v1/object/public/bruno-pelatieri-goulart-bh/blog/media/img/bruno_pelatieri_goulart_seed2.webp",
    alt: "Bruno Pelatieri Goulart — Foto 2",
    position: 1
  },
  {
    url: "https://kpersdlqtrxlytwbuvvv.supabase.co/storage/v1/object/public/bruno-pelatieri-goulart-bh/blog/media/img/bruno_pelatieri_goulart_seed3.webp",
    alt: "Bruno Pelatieri Goulart — Foto 3",
    position: 2
  }
]

// POST_MEDIA (3)
[
  {
    mediaType: "mp3",
    deliveryMode: "file",
    url: "https://kpersdlqtrxlytwbuvvv.supabase.co/storage/v1/object/public/bruno-pelatieri-goulart-bh/blog/media/brunogoulart_ramones_i_wanna_be_sedate.mp3",
    title: "Áudio: I Wanna Be Sedate (Ramones)",
    position: 0
  },
  {
    mediaType: "mp4",
    deliveryMode: "file",
    url: "https://kpersdlqtrxlytwbuvvv.supabase.co/storage/v1/object/public/bruno-pelatieri-goulart-bh/blog/media/brunogoulart_univeso_responde.mp4",
    title: "Vídeo: Universo Responde",
    position: 1
  },
  {
    mediaType: "mp4",  // label (não importa pra iframe)
    deliveryMode: "embed",
    url: "https://www.youtube.com/embed/9flaCBkVqps",
    title: "YouTube: Embedded Video",
    position: 2
  }
]

// POST_ATTACHMENTS (3)
[
  {
    name: "brunogoulart.zip",
    description: "Pacote completo de projetos",
    url: "https://kpersdlqtrxlytwbuvvv.supabase.co/storage/v1/object/public/bruno-pelatieri-goulart-bh/blog/doc/brunogoulart.zip",
    position: 0
  },
  {
    name: "brunogoulart_doc.docx",
    description: "Documento Word com detalhes",
    url: "https://kpersdlqtrxlytwbuvvv.supabase.co/storage/v1/object/public/bruno-pelatieri-goulart-bh/blog/doc/brunogoulart_doc.docx",
    position: 1
  },
  {
    name: "brunogoulart_doc.pdf",
    description: "PDF com informações",
    url: "https://kpersdlqtrxlytwbuvvv.supabase.co/storage/v1/object/public/bruno-pelatieri-goulart-bh/blog/doc/brunogoulart_doc.pdf",
    position: 2
  }
]
```

**Markdown Completo (content):**

```markdown
# Bruno Pelatieri Goulart — Documento de Teste Markdown

*Full Stack Developer & AI Automation Specialist — 18+ anos de experiência, desde 2006.*

> "Unindo 18 anos de engenharia com a inteligência do futuro — construindo hoje o que o mercado precisará amanhã."

---

## 🔗 Links Pessoais

| Plataforma | Link |
|---|---|
| Site pessoal | [brunogoulart.com.br](https://brunogoulart.com.br/) |
| Bio / Linktree | [bru.ia.br](https://bru.ia.br/) |
| GitHub | [github.com/brunopelatieri](https://github.com/brunopelatieri) |
| GitLab | [gitlab.com/brunopelatieri](https://gitlab.com/brunopelatieri) |
| Docker Hub | [hub.docker.com/u/brunopelatieri](https://hub.docker.com/u/brunopelatieri) |
| LinkedIn | [linkedin.com/in/bruno-pelatieri-goulart](https://www.linkedin.com/in/bruno-pelatieri-goulart/) |
| YouTube | [@brunopelatieri](https://www.youtube.com/@brunopelatieri) |
| TikTok | [@brunopelatieri](https://www.tiktok.com/@brunopelatieri) |
| X (Twitter) | [@brunopelatieri](https://x.com/brunopelatieri) |
| Instagram | [@brunopelatieri](https://www.instagram.com/brunopelatieri/) |
| Facebook | [bruno.pelatierigoulart](https://www.facebook.com/bruno.pelatierigoulart) |
| WhatsApp | [+55 (19) 9 9249-6598](https://wa.me/5519992496598) |
| E-mail | [brunopelatieri@gmail.com](mailto:brunopelatieri@gmail.com) |

> Discord ainda não tem link público de perfil, apenas ID: `1248366465929711648`

---

## 🧠 Trajetória

Programador desde **2006**, Bruno começou sua carreira com ~~PHP clássico (CodeIgniter, Zend Framework)~~ e, ao longo de quase duas décadas, migrou para uma stack muito mais ampla. Hoje atua na linha de frente de **AI Agents**, *automação inteligente* e arquiteturas orientadas a LLMs — sem nunca abandonar a base sólida de engenharia de software que construiu desde o início.

Atualmente presta serviço autônomo na **Phyonext**, com foco em dois verticais:

1. Crédito & financeiro — qualificação e conversão de leads via WhatsApp
2. Saúde & clínicas — recepção virtual, agendamento e reativação de pacientes

Paralelamente, desenvolve o **Gestão Inteligente**, um SaaS próprio para o setor de restaurantes, atualmente em fase *beta*.

---

## ⚙️ Stack Técnica

### Backend & Frontend

- `Node.js` · `Express.js` · `Python` · `PHP` · `Laravel`
- `React` · `Next.js` · `Tailwind CSS` · `HTML5` / `CSS3`

### IA, Automação & Agentes

- `Claude` (Anthropic), `GPT` (OpenAI), `Gemini`, `DeepSeek`, `Grok`
- `LangChain` · `LangGraph` · `LangSmith`
- `n8n` · `Kestra` · `MCP Protocol`

### Banco de Dados & DevOps

- `PostgreSQL` · `MySQL` · `MongoDB` · `Redis` · `Supabase`
- `Docker Swarm` · `Traefik` · `Portainer`

Exemplo simplificado de um nó de configuração usado em fluxos **n8n** para seleção de modo de operação:

\`\`\`json
{
  "node": "CONFIG - Set Mode",
  "type": "n8n-nodes-base.set",
  "parameters": {
    "operationMode": "sync_contacts",
    "targetService": "chatwoot",
    "sheetSource": "google_sheets",
    "retryOnSchemaMismatch": true
  }
}
\`\`\`

---

## ⛓️ Projetos em Destaque

| Projeto | Categoria |
|---|---|
| MCP Server para n8n | Automação / Agentes |
| AI XML Tag Guide | Engenharia de Prompt |
| Setup Orion | DevOps / Infraestrutura |
| DApps & Smart Contracts | Web3 |
| Gestão Inteligente | SaaS — Food Service |

---

*Documento gerado apenas para fins de teste de renderização Markdown (`react-markdown` + `remark-gfm`). Não constitui currículo oficial.*
```

**Requisitos do Script:**

- Usar padrão de `scripts/seed-posts.ts` (dotenv, drizzle client, etc)
- Conectar via `DATABASE_URL` (dev) ou `DIRECT_URL`
- Inserir post + 3 images + 3 media + 3 attachments em transação (ou individual)
- Usar `onConflictDoNothing({ target: posts.slug })` para idempotência
- Log amigável: "✅ Test post seeded with 3 images, 3 media, 3 attachments"
- Exit code 0 (success) / 1 (error)
- **Testar:** rodar 2x localmente (verificar idempotência)

---

## Task 2: `scripts/seed-full.ts`

### Especificação

**Arquivo:** `scripts/seed-full.ts`

**Propósito:** Rodar seed de teste + 3 posts originais em uma só chamada

**Lógica:**

```typescript
// 1. Seed test post (date = "2026-06-25")
// 2. Seed 3 original posts (dates = "2026-06-12", "2026-06-03", "2026-05-28")
// Resultado: 4 posts no DB, test post é o primeiro (/blog lista em date DESC)

// Idempotente: pode rodar múltiplas vezes sem duplicar
```

**Simplest Approach:**
- Importar `seedTestPost()` de `seed-test-post.ts`
- Importar `seedOriginalPosts()` de `seed-posts.ts` (refatorado)
- Rodar ambas em sequência

**OU:**
- Combinar dados em um único arquivo `seed-full.ts`
- Mais simples, sem dependências circulares

**Recomendação:** Opção 1 (refatorar para reutilizar)

---

## Task 3: Refatorar `scripts/seed-posts.ts`

### Especificação

**Arquivo:** `scripts/seed-posts.ts` (atualizar)

**Mudanças:**

1. Extrair função `seedOriginalPosts()` (export)
2. Manter script executável como `npm run db:seed` (apenas originais)
3. Sem mudança de dados (3 posts igual como estão)

**Result:**

```typescript
export async function seedOriginalPosts(db: Database) {
  // insere 3 posts originais
  // idempotente
}

// Default export — rodar apenas originais
async function main() {
  await seedOriginalPosts(db);
}

main().catch(...);
```

---

## Package.json Updates

**Adicionar 3 scripts:**

```json
{
  "scripts": {
    "db:seed": "tsx scripts/seed-posts.ts",
    "db:seed:test": "tsx scripts/seed-test-post.ts",
    "db:seed:full": "tsx scripts/seed-full.ts"
  }
}
```

**Behavior:**

```bash
npm run db:seed           # 3 posts originais (como hoje)
npm run db:seed:test      # 1 post de teste (galeria + mídia + anexos)
npm run db:seed:full      # 4 posts (test + 3 originais)
```

---

## Testes Esperados

### Local (Dev)

```bash
# 1. Rodar seed full
npm run db:seed:full

# 2. Verificar posts
psql -U portal -d portal -c "SELECT slug, date, published_at FROM posts ORDER BY published_at DESC;"
# Esperado:
#   bruno-pelatieri-goulart-documento-teste-markdown | 25 Jun 2026 | 2026-06-25
#   reduzir-mensagens-de-status                      | 12 Jun 2026 | 2026-06-12
#   precificacao-para-freelancers-2026               | 3 Jun 2026  | 2026-06-03
#   stack-ideal-portais-de-clientes                  | 28 Mai 2026 | 2026-05-28

# 3. Verificar galeria do test post
psql -U portal -d portal -c "SELECT COUNT(*) FROM post_images WHERE post_id = (SELECT id FROM posts WHERE slug = 'bruno-pelatieri-goulart-documento-teste-markdown');"
# Esperado: 3

# 4. Verificar mídia
psql -U portal -d portal -c "SELECT COUNT(*) FROM post_media WHERE post_id = (SELECT id FROM posts WHERE slug = 'bruno-pelatieri-goulart-documento-teste-markdown');"
# Esperado: 3

# 5. Verificar anexos
psql -U portal -d portal -c "SELECT COUNT(*) FROM post_attachments WHERE post_id = (SELECT id FROM posts WHERE slug = 'bruno-pelatieri-goulart-documento-teste-markdown');"
# Esperado: 3

# 6. Rodar 2x (verificar idempotência)
npm run db:seed:full
npm run db:seed:full
# Esperado: "seeded (idempotent)" — sem erro
```

### Frontend (Dev)

```bash
npm run dev

# 1. Visitar /blog
# Esperado: test post é o PRIMEIRO (mais recente)
# Título: "Bruno Pelatieri Goulart — Documento de Teste Markdown"

# 2. Clicar no test post → /blog/bruno-pelatieri-goulart-documento-teste-markdown
# Esperado:
#   - Markdown renderizado (links, tabelas, negrito, código)
#   - Capa exibida
#   - Seção "Galeria" com 3 imagens
#   - Seção "Mídia" com áudio + vídeo + iframe YouTube
#   - Seção "Downloads" com 3 arquivos (ZIP, Doc, PDF)

# 3. Clicar em download de anexo
# Esperado: abre em nova aba (target="_blank")
```

---

## Constraints & Padrões

1. **Siga `scripts/seed-posts.ts` como padrão:**
   - `import { config } from "dotenv"`
   - `config({ path: ".env.local" })`
   - `const connectionString = process.env.DATABASE_URL || process.env.DIRECT_URL`
   - `const db = drizzle(client, { schema })`

2. **TypeScript strict:**
   - Tipos explícitos (Post, NewPost, PostImage, etc)
   - No `any`

3. **Idempotência:**
   - Use `.onConflictDoNothing()` com target (slug para posts, postId+position para images/media/attachments)
   - Pode rodar múltiplas vezes = resultado igual

4. **Logging:**
   - Emojis: 🚀 (start), ✅ (success), ❌ (error), 📊 (count)
   - Timestamp: `console.time()` / `console.timeEnd()`
   - Mensagens claras: "✅ Test post seeded (3 images, 3 media, 3 attachments)"

5. **Exit codes:**
   - 0 = success
   - 1 = error

6. **Dependências:**
   - Use apenas o que já está em `package.json`
   - Se precisar adicionar, mencionar no commit

---

## Acceptance Criteria

- [ ] `scripts/seed-test-post.ts` existe, roda sem erro
- [ ] Test post contém slug, title, content (markdown), cover, 3 images, 3 media, 3 attachments
- [ ] `scripts/seed-full.ts` existe, roda ambos (test + originais) em sequência
- [ ] `scripts/seed-posts.ts` refatorado (export `seedOriginalPosts`)
- [ ] `package.json` tem 3 scripts: `db:seed`, `db:seed:test`, `db:seed:full`
- [ ] Idempotência testada (rodar 2x = resultado igual, sem duplicatas)
- [ ] Logs detalhados (count de images/media/attachments)
- [ ] `/blog` mostra test post PRIMEIRO (mais recente por date)
- [ ] `/blog/bruno-pelatieri-goulart-documento-teste-markdown`:
  - [ ] Markdown renderizado corretamente
  - [ ] Galeria exibe 3 imagens
  - [ ] Áudio (MP3) com player `<audio controls>`
  - [ ] Vídeo (MP4) com player `<video controls>`
  - [ ] Iframe YouTube renderizado
  - [ ] 3 anexos com links download (target="_blank")
- [ ] `npm run typecheck` passa
- [ ] Commits prontos (não fazer push)

---

## Referências

**Dentro do projeto:**
- `scripts/seed-posts.ts` — Pattern atual
- `src/db/schema.ts` — Tabelas (Post, PostImage, PostMedia, PostAttachment)
- `src/components/blog/post-gallery.tsx` — Como renderiza galeria
- `src/components/blog/post-media.tsx` — Como renderiza mídia
- `src/components/blog/post-attachments.tsx` — Como renderiza anexos

**Drizzle Docs:**
- [Insert & onConflict](https://orm.drizzle.team/docs/insert)
- [Relations](https://orm.drizzle.team/docs/relations)

**Projeto Context:**
- `AI_CONTEXT.md` — Blog dinâmico spec 001
- `PROJECT_TECHNICAL_SPEC.md` — Schema das 4 tabelas
- `.cursor/rules/git-gitlab-manual-actions.mdc` — Git policy

---

**Pronto pra começar? Boa sorte!** 🚀
