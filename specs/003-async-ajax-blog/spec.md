# Feature Specification: Busca Assíncrona no Blog com Autocomplete e Filtro por Categoria

**Feature Branch**: `main`  
**Feature ID**: `003`  
**Created**: 2026-06-27  
**Status**: Ready for Implement  
**Input**: Async AJAX blog search with predictive UI category filter and loading states

---

## Contexto

O blog em `/blog` (spec **002** implementada) carrega posts publicados e
categorias via loader SSR (`getAllPosts()`, `getCategoriesForBlogMenu()`).
Filtragem por categoria é **client-side** sobre o array hidratado
(`BlogCategoryFilter` + `filterPostsByCategory()`).

**Não existe** endpoint de busca hoje — `src/api/app.ts` expõe apenas
`/api/health` e `/api/contact`.

Esta feature adiciona **busca assíncrona (fetch/AJAX)** na página `/blog`:
campo predictivo search-as-you-type, debounce, preview de resultados, indicador
de loading e combinação com o filtro de categoria já existente.

**Estado atual relevante:**
- Rota: `src/routes/blog.tsx` — loader SSR + filtro categoria client-side
- Constantes: `ALL_FILTER_SLUG`, `UNCATEGORIZED_FILTER_SLUG`, `sem-categoria`
- Componentes: `BlogCategoryFilter`, `PostCategoryBadges`
- Dados: posts `published` com `categories[]` (M2M); volume baixo (<50 posts)

---

## Decisões de Clarificação (Q1–Q5 resolvidas)

| # | Questão | Decisão |
|---|---------|---------|
| Q1 | Busca client-side ou servidor? | **Servidor (AJAX)** — novo endpoint read-only; query no Postgres via Drizzle. Evita baixar conteúdo completo no cliente só para buscar. |
| Q2 | Campos pesquisáveis? | **title**, **excerpt** e **content** (case-insensitive, match parcial `ILIKE`). Preview exibe title + excerpt; content usado para relevância. |
| Q3 | Comportamento com <3 caracteres? | **Idle** — sem chamada API; grid exibe posts filtrados **somente por categoria** (comportamento spec 002). Preview oculto. |
| Q4 | Preview vs grid principal? | **Ambos** — dropdown preview durante digitação; grid principal atualiza para os mesmos resultados quando busca ativa (≥3 chars). |
| Q5 | Debounce? | **300 ms** após última tecla antes de disparar fetch. Cancelar request anterior se nova digitação chegar (AbortController). |

---

## User Scenarios & Testing *(mandatory)*

### Primary User Story

**Como visitante do blog**, quero digitar termos e ver sugestões de posts em
tempo real, com indicação clara de carregamento, para encontrar artigos
rapidamente sem recarregar a página.

**Como visitante com categoria selecionada**, quero que a busca respeite o
filtro de categoria ativo, para restringir resultados ao tema que escolhi.

### Acceptance Scenarios

#### Campo de busca e threshold
1. **Dado** `/blog` carregado, **Quando** visitante digita 1–2 caracteres,
   **Então** nenhuma requisição assíncrona é feita; preview oculto; grid segue
   filtro de categoria apenas.
2. **Dado** visitante digita ≥3 caracteres, **Quando** debounce de 300 ms
   completa, **Então** sistema dispara busca assíncrona e exibe loader.

#### Estados de UI
3. **Dado** busca em andamento, **Quando** aguardando resposta,
   **Então** indicador de loading visível no campo/preview (spinner ou
   equivalente acessível).
4. **Dado** resposta recebida com matches, **Quando** preview renderiza,
   **Então** dropdown/painel lista posts (título + excerpt truncado + categorias);
   grid principal exibe os mesmos posts em cards.
5. **Dado** resposta vazia, **Quando** query ≥3 chars,
   **Então** preview e grid exibem mensagem pt-BR amigável (ex.: "Nenhum post
   encontrado.") sem erro de aplicação.
6. **Dado** visitante apaga texto até <3 chars, **Quando** campo fica curto,
   **Então** UI volta ao estado idle; preview fecha; grid restaura filtro só
   por categoria.

#### Debounce e concorrência
7. **Dado** visitante digita rapidamente, **Quando** múltiplas teclas em <300 ms,
   **Então** apenas **uma** requisição é enviada após pausa (debounce).
8. **Dado** request A em flight e nova query após debounce, **Quando** request B
   inicia, **Então** resultado de A ignorado se obsoleto (abort ou sequence id).

#### Combinação com categoria
9. **Dado** categoria "Produtividade" ativa e query "portal", **Quando** busca
   executa, **Então** retorna apenas posts publicados que matcham texto **e**
   possuem categoria Produtividade (ou sem categoria se "Sem categoria" ativo).
10. **Dado** "Todos" ativo, **Quando** busca executa, **Então** considera todos
    posts publicados que matcham texto.
11. **Dado** busca ativa, **Quando** visitante troca categoria no menu,
    **Então** busca reexecuta com nova categoria (se query ≥3 chars) ou grid
    atualiza conforme categoria (se query idle).

#### Preview e navegação
12. **Dado** preview aberto, **Quando** visitante clica item,
    **Então** navega para `/blog/:slug` (mesmo destino dos cards).
13. **Dado** preview aberto, **Quando** visitante pressiona Escape,
    **Então** preview fecha; foco permanece no input.

#### Regressão spec 002
14. **Dado** campo de busca vazio, **Quando** visitante usa menu de categorias,
    **Então** comportamento idêntico à spec 002 (sem regressão).
15. **Dado** posts `draft`, **Quando** qualquer busca executa,
    **Então** rascunhos **nunca** aparecem.

### Edge Cases

- Query só espaços: tratar como vazio (trim); não buscar.
- Caracteres especiais SQL (`%`, `_`): escapados na query Drizzle/ILIKE.
- Erro de rede/500: mensagem pt-BR no preview; grid mantém último estado válido
  ou empty state de erro.
- Categoria ativa sem posts + busca: empty state combinado.
- Mobile: preview scrollável; não obscurecer campo de busca permanentemente.

---

## Requirements *(mandatory)*

### Functional Requirements

**API de busca (read-only):**
- **FR-001**: Endpoint GET `/api/blog/search` DEVE aceitar query params:
  `q` (string, obrigatório se busca ativa, min 3 chars após trim),
  `category` (slug: `todos` | `sem-categoria` | slug de categoria DB).
- **FR-002**: Resposta JSON: `{ posts: BlogPostCard[] }` com slug, title,
  excerpt, date, publishedAt, cover, readTime, categories[] — subset alinhado
  ao loader `/blog`.
- **FR-003**: Busca DEVE filtrar `status = 'published'` e aplicar match
  case-insensitive em title, excerpt e content.
- **FR-004**: Param `category` DEVE reutilizar mesma semântica de
  `filterPostsByCategory()` (spec 002): todos / sem-categoria / slug.
- **FR-005**: Retornar `400` se `q` presente com <3 chars (após trim); `200`
  com array vazio se nenhum match.

**UI `/blog`:**
- **FR-006**: Campo de busca acima ou integrado ao bloco de filtros, label
  acessível pt-BR (ex.: "Buscar posts").
- **FR-007**: Disparo automático após ≥3 caracteres + debounce 300 ms.
- **FR-008**: Estados de UI discerníveis: **idle**, **typing** (<3 ou debounce
  pendente), **loading**, **results**, **empty**, **error**.
- **FR-009**: Preview dropdown/painel listando matches; cada item clicável →
  `/blog/:slug`.
- **FR-010**: Grid principal DEVE refletir resultados da busca quando ativa;
  cards reutilizam layout e `PostCategoryBadges` existentes.
- **FR-011**: Loader/spinner visível durante fetch assíncrono.
- **FR-012**: Troca de categoria DEVE recomputar resultados (re-fetch se busca
  ativa).

**Acessibilidade:**
- **FR-013**: Input com `role="combobox"`, preview com `role="listbox"`;
  `aria-expanded`, `aria-busy` durante loading; anúncio de contagem de
  resultados via `aria-live="polite"`.

**Performance:**
- **FR-014**: Debounce 300 ms; abort de requests obsoletos.
- **FR-015**: Limite de preview: máx. **10** resultados no dropdown; grid pode
  exibir todos os matches retornados (cap API **50** se necessário).

**Documentação:**
- **FR-016**: Atualizar `AI_CONTEXT.md` e `TECHNICAL_SPEC_COMPACT.md` com
  endpoint e UX de busca.

### Key Entities *(include if feature involves data)*

**BlogSearchQuery**  
Parâmetros: `q` (texto), `category` (slug filtro). Derivado da UI `/blog`.

**BlogSearchResult**  
Post publicado resumido para preview/card — mesma forma de `PostWithRelations`
parcial (sem content completo na resposta se omitido por tamanho; excerpt
obrigatório).

---

## Escopo & Limites

### Dentro do escopo
- Endpoint Hono GET `/api/blog/search`
- Função Drizzle `searchPublishedPosts(q, categorySlug)` (ou equivalente)
- Componente `BlogSearchInput` + preview + integração em `blog.tsx`
- Debounce, AbortController, estados de loading/empty/error
- Combinação busca + filtro categoria spec 002

### Fora do escopo
- Busca na landing `/` ou outras páginas
- Indexação full-text Postgres (`tsvector`) — ILIKE suficiente no volume atual
- Histórico de buscas, analytics, sugestões populares
- Sincronização query string `?q=` na URL (feature futura)
- Busca em categorias/posts draft
- i18n além de pt-BR

---

## Dependências & Suposições

- Spec **002** implementada (`categories`, `post_categories`, filtro categoria).
- Mesma origem front/API (sem CORS); fetch relativo `/api/blog/search`.
- Volume de posts publicados permanece baixo (<50).
- shadcn/ui disponível para Input, spinner (Loader2 lucide).

---

## Review & Acceptance Checklist

### Content Quality
- [x] Focado no QUÊ e no POR QUÊ
- [x] Todas as seções obrigatórias preenchidas
- [x] Escrito para ser compreendido pelo autor

### Requirement Completeness
- [x] Questões em aberto (Q1–Q5) resolvidas
- [x] Requisitos testáveis (FR-001 a FR-016)
- [x] 15 cenários de aceitação
- [x] Escopo delimitado
- [x] Dependências identificadas

---

## Execution Status

- [x] Descrição do usuário parseada
- [x] Conceitos-chave extraídos
- [x] Ambiguidades resolvidas (Q1–Q5)
- [x] Cenários de usuário definidos
- [x] Requisitos gerados (FR-001 a FR-016)
- [x] Entidades identificadas
- [x] **Pronto para `/clarify` ou `/plan`**

---
