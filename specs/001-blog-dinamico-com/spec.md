# Feature Specification: Blog Dinâmico com Mídia Relacional

**Feature Branch**: `main`
**Feature ID**: `001`
**Created**: 2026-06-23
**Status**: Ready for Plan
**Author**: Bruno Pelatieri Goulart

---

## Contexto

O blog público em `/blog` e `/blog/:slug` hoje serve conteúdo de um array
estático em `src/lib/content/posts.ts`. O objetivo desta feature é migrar para
banco de dados real (Drizzle + Postgres) e expandir cada post para suportar
Markdown no conteúdo, galeria de imagens, embeds de mídia (MP3/MP4) e anexos
para download — mantendo SEO, Open Graph e comportamento SSR exatamente iguais
ao atual.

---

## Decisões de Clarificação (Q1–Q5 resolvidas)

| # | Questão | Decisão |
|---|---------|---------|
| Q1 | Markdown no `content`? | **Sim** — conteúdo armazenado como Markdown e renderizado no frontend |
| Q2 | Cover image: migrar para Storage ou aceitar ambos? | **Aceita ambos** — caminho relativo (`/images/blog/...`) ou URL completa (Supabase Storage). Novos arquivos em `public/images/blog/` |
| Q3 | `readTime`: texto livre ou calculado? | **Calculado automaticamente** a partir do contagem de palavras do conteúdo (não armazenado como campo livre) |
| Q4 | Status `published` / `draft`? | **Sim** — posts têm status; loaders retornam apenas `published` para o público |
| Q5 | Galeria no card da listagem? | **Não** — galeria aparece apenas na página de detalhe `/blog/:slug` |

---

## User Scenarios & Testing *(mandatory)*

### Primary User Story

**Como visitante do site**, quero ler artigos do blog que possam conter
conteúdo Markdown formatado, galeria de imagens, players de áudio/vídeo e
arquivos para download, para consumir conteúdo rico e profissional.

**Como autor (Bruno)**, quero gerenciar posts e seus recursos de mídia
via Drizzle Studio ou script de seed, podendo manter rascunhos (`draft`)
invisíveis ao público antes de publicar (`published`).

### Acceptance Scenarios

#### Listagem `/blog`
1. **Dado** que existem posts com status `published`, **Quando** visitante
   acessa `/blog`, **Então** vê apenas posts publicados, ordenados por data
   de publicação (mais novo primeiro), com título, excerpt, tag, tempo de
   leitura calculado e imagem de capa.
2. **Dado** que existe post com status `draft`, **Quando** visitante acessa
   `/blog`, **Então** o rascunho **não aparece** na listagem.
3. **Dado** que nenhum post publicado existe, **Quando** visitante acessa
   `/blog`, **Então** vê estado vazio sem erro de servidor.

#### Detalhe `/blog/:slug`
4. **Dado** que post publicado existe, **Quando** visitante acessa
   `/blog/meu-slug`, **Então** vê título, conteúdo renderizado em Markdown,
   tag, data, tempo de leitura calculado e imagem de capa.
5. **Dado** que post existe com status `draft`, **Quando** visitante acessa
   `/blog/slug-do-draft`, **Então** recebe resposta 404 (rascunhos são
   invisíveis publicamente).
6. **Dado** que post possui galeria, **Quando** visitante visualiza o post,
   **Então** vê grade de imagens em ordem definida, com texto alternativo
   acessível.
7. **Dado** que post possui embed de MP3/MP4 externo, **Quando** visitante
   visualiza o post, **Então** vê player via `<iframe>` incorporado.
8. **Dado** que post possui arquivo MP3 hospedado, **Quando** visitante
   visualiza o post, **Então** vê player nativo `<audio controls>`.
9. **Dado** que post possui arquivo MP4 hospedado, **Quando** visitante
   visualiza o post, **Então** vê player nativo `<video controls>`.
10. **Dado** que post possui anexos para download, **Quando** visitante
    visualiza o post, **Então** vê grade de documentos com nome, descrição e
    botão de download que abre em nova aba.
11. **Dado** que slug não existe ou post é `draft`, **Quando** visitante
    acessa `/blog/slug-invalido`, **Então** recebe 404.

#### SEO & Open Graph
12. **Dado** que post possui imagem de capa, **Quando** link é compartilhado
    em rede social, **Então** preview exibe a capa via `og:image`.
13. **Dado** qualquer post publicado, **Quando** crawler indexa `/blog/:slug`,
    **Então** `<title>`, `<meta description>`, `og:title`, `og:description` e
    `og:image` estão presentes e corretos.

#### Tempo de leitura calculado
14. **Dado** post com conteúdo de ~1.000 palavras, **Quando** listado ou
    visualizado, **Então** tempo de leitura exibido reflete ~5 min (baseado
    em 200 palavras/min).

#### Migração / seed
15. **Dado** seed rodado após migration, **Quando** visitante acessa `/blog`,
    **Então** os 3 posts existentes aparecem com slugs **idênticos** aos
    atuais (nenhum link indexado quebra).

### Edge Cases

- Post sem galeria: seção de galeria não renderizada na página.
- Post sem embeds de mídia: seção de mídia não renderizada.
- Post sem anexos: seção de downloads não renderizada.
- Post sem imagem de capa: `og:image` omitido (não renderizar tag vazia).
- Imagem de galeria sem `alt` preenchido: campo obrigatório — não deve ser
  possível inserir imagem sem texto alternativo.
- Conteúdo Markdown com HTML inline: renderizar de forma segura (sem XSS).

---

## Requirements *(mandatory)*

### Functional Requirements

**Posts:**
- **FR-001**: O sistema DEVE armazenar posts no banco com: slug (único), título,
  excerpt, conteúdo em Markdown, tag, data formatada para exibição, data de
  publicação ISO, URL/caminho da imagem de capa (opcional) e status
  (`published` | `draft`).
- **FR-002**: O sistema DEVE preservar os slugs dos 3 posts existentes em
  `posts.ts` exatamente como estão, para não quebrar URLs indexadas.
- **FR-003**: O sistema DEVE calcular o tempo de leitura dinamicamente a partir
  do número de palavras do conteúdo (≈ 200 palavras por minuto), exibindo no
  formato "N min". Este valor **não é armazenado** — é calculado no momento
  da leitura.
- **FR-004**: O loader de `/blog` DEVE retornar apenas posts com status
  `published`, ordenados por data de publicação decrescente.
- **FR-005**: O loader de `/blog/:slug` DEVE retornar 404 para slugs
  inexistentes **ou** posts com status `draft`.

**Galeria de imagens:**
- **FR-006**: O sistema DEVE suportar N imagens por post (`post_images`), cada
  uma com: referência ao post, URL/caminho da imagem, texto alternativo
  (obrigatório) e posição de ordenação.
- **FR-007**: A galeria DEVE ser renderizada apenas na página de detalhe
  `/blog/:slug`, em ordem crescente de posição.

**Mídia (áudio e vídeo):**
- **FR-008**: O sistema DEVE suportar N itens de mídia por post (`post_media`),
  cada um com: referência ao post, tipo (`mp3` | `mp4`), modo (`embed` |
  `file`), URL, título exibido e posição de ordenação.
- **FR-009**: Modo `embed` DEVE renderizar `<iframe src="url">` (players
  externos: YouTube, Vimeo, SoundCloud, Spotify etc.).
- **FR-010**: Modo `file` com tipo `mp3` DEVE renderizar `<audio controls src="url">`.
- **FR-011**: Modo `file` com tipo `mp4` DEVE renderizar `<video controls src="url">`.

**Anexos para download:**
- **FR-012**: O sistema DEVE suportar N anexos por post (`post_attachments`),
  cada um com: referência ao post, nome exibido, descrição (opcional), URL do
  arquivo e posição de ordenação.
- **FR-013**: Cada anexo DEVE ter link de download abrindo em nova aba
  (`target="_blank"`).

**Storage e caminhos de arquivo:**
- **FR-014**: Arquivos binários (imagens de galeria, MP3, MP4, documentos)
  hospedados localmente DEVEM ficar em `public/images/blog/` (imagens) ou
  em Supabase Storage. O banco armazena apenas a URL/caminho — nunca binário.
- **FR-015**: A coluna `cover` do post DEVE aceitar tanto caminhos relativos
  (`/images/blog/arquivo.webp`) quanto URLs completas (Supabase Storage),
  para compatibilidade com posts existentes e futuros.

**Markdown:**
- **FR-016**: O conteúdo dos posts DEVE ser armazenado como Markdown e
  renderizado de forma segura no frontend (sem execução de scripts inline).

**SSR & SEO:**
- **FR-017**: As rotas `/blog` e `/blog/:slug` DEVEM continuar com loader
  server-side (SSR). Nenhum dado do blog deve ser buscado no cliente.
- **FR-018**: Meta tags Open Graph DEVEM continuar sendo geradas pelo `meta`
  function do React Router em `/blog/:slug`.

**Migração / seed:**
- **FR-019**: Um script de seed DEVE popular a tabela `posts` com os 3 artigos
  de `posts.ts`, preservando todos os campos originais (incluindo slugs e datas).
  Os posts do seed devem ter status `published`.
- **FR-020**: `posts.ts` DEVE ser mantido (não deletado) até seed validado e
  loaders migrados. Após validação, pode ser marcado como `@deprecated` ou
  removido.

**Sem UI de gestão nesta entrega:**
- **FR-021**: Criação, edição e exclusão via interface web estão **fora do
  escopo**. Gestão é via Drizzle Studio ou scripts de seed.

---

### Key Entities *(include if feature involves data)*

**Post**
Artigo do blog. Campos: `slug` (identificador único de URL), `title`, `excerpt`
(resumo curto), `content` (corpo em Markdown), `tag` (categoria única em texto),
`date` (data formatada para exibição, ex: "12 Jun 2026"), `publishedAt` (ISO
para ordenação e `<time>`), `cover` (URL ou caminho relativo da imagem de capa,
opcional), `status` (`published` | `draft`), `createdAt`, `updatedAt`.
Campo derivado (não armazenado): `readTime` (calculado de `content`).
Relações: possui N `PostImage`, N `PostMedia`, N `PostAttachment`.

**PostImage**
Imagem da galeria de um post. Campos: `id`, `postId` (FK → Post), `url`
(URL ou caminho da imagem), `alt` (texto alternativo, obrigatório), `position`
(ordenação inteira, menor = primeiro), `createdAt`.

**PostMedia**
Item de mídia de um post. Campos: `id`, `postId` (FK → Post), `mediaType`
(`mp3` | `mp4`), `deliveryMode` (`embed` | `file`), `url` (src do iframe ou
URL do arquivo), `title` (título exibido), `position` (ordenação), `createdAt`.

**PostAttachment**
Documento para download de um post. Campos: `id`, `postId` (FK → Post),
`name` (nome exibido), `description` (opcional), `url` (URL do arquivo),
`position` (ordenação), `createdAt`.

---

## Escopo & Limites

### Dentro do escopo
- Tabelas Drizzle: `posts`, `post_images`, `post_media`, `post_attachments`.
- Migration Drizzle Kit para as 4 tabelas.
- Script de seed populando os 3 posts existentes.
- Atualização de `getAllPosts()` e `getPostBySlug()` para consultar Drizzle
  (assinatura pública inalterada — loaders não mudam sua interface).
- Tipo `Post` exportado atualizado para incluir galeria, mídia e anexos.
- Renderização de Markdown no frontend (biblioteca a definir no plan).
- Componentes de galeria, players de mídia e grid de anexos em
  `/blog/:slug`.
- Atualização de `AI_CONTEXT.md`, `PROJECT_TECHNICAL_SPEC.md` e `README.md`.

### Fora do escopo
- UI de criação/edição/exclusão (dashboard CRUD).
- Upload de arquivos via interface web.
- Tags múltiplas por post.
- Comentários, curtidas, compartilhamento social.
- Paginação da listagem.
- Busca no blog.
- Autenticação para conteúdo premium.
- Internacionalização (i18n).

---

## Dependências & Suposições

- Postgres rodando localmente (docker-compose) e em produção (Portainer).
- Drizzle Kit instalado e migrations funcionando.
- Migration aplicada manualmente em produção via Portainer Console.
- Supabase Storage disponível para arquivos futuros (posts existentes usam
  `/public` com caminhos relativos).
- Os 3 posts do seed não têm galeria, mídia nem anexos — inseridos apenas
  com campos textuais e capa.

---

## Review & Acceptance Checklist

### Content Quality
- [x] Focado no QUÊ e no POR QUÊ
- [x] Todas as seções obrigatórias preenchidas
- [x] Escrito para ser compreendido pelo autor

### Requirement Completeness
- [x] Questões em aberto (Q1–Q5) resolvidas
- [x] Requisitos testáveis e não ambíguos (FR-001 a FR-021)
- [x] Critérios de sucesso mensuráveis (15 cenários de aceitação)
- [x] Escopo claramente delimitado
- [x] Dependências e suposições identificadas

---

## Execution Status

- [x] Descrição do usuário parseada
- [x] Conceitos-chave extraídos
- [x] Ambiguidades marcadas e resolvidas (Q1–Q5)
- [x] Cenários de usuário definidos (15 cenários)
- [x] Requisitos gerados (FR-001 a FR-021)
- [x] Entidades identificadas (Post, PostImage, PostMedia, PostAttachment)
- [x] **Pronto para `/plan`**

---
