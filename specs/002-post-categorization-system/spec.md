# Feature Specification: Sistema de Categorização de Posts

**Feature Branch**: `main`  
**Feature ID**: `002`  
**Created**: 2026-06-26  
**Status**: Ready for Implement  
**Input**: Post categorization system linking database to blog navigation and filtering without category CRUD

---

## Contexto

O blog em `/blog` lista posts publicados via Drizzle (`getAllPosts()` em
`posts.server.ts`). Cada post possui hoje um campo texto livre `tag` (ex.:
"Produtividade", "Negócios", "Ferramentas") exibido como badge na listagem e
na página de detalhe.

Esta feature introduz uma tabela `categories` normalizada, relaciona posts a
categorias via tabela de junção Many-to-Many, popula categorias iniciais por
migration e expõe navegação
por categoria na página do blog com filtragem dinâmica — **sem** interface de
CRUD. Novas categorias serão inseridas diretamente no banco por sistema externo
no futuro.

**Estado atual relevante:**
- Schema: `posts.tag` (text, NOT NULL) em `src/db/schema.ts`
- Loader SSR: `src/routes/blog.tsx` → `getAllPosts()`
- Badge de categoria: `post.tag` em `blog.tsx`, `blog-post.tsx` e
  `blog-section.tsx` (landing ainda usa `posts.ts` deprecated)
- Seeds: 3 posts originais + 1 post de teste com tags distintas

---

## Clarifications

### Session 2026-06-26

- Q: Um post pode pertencer a quantas categorias? → A: **Zero ou mais** (Many-to-Many via tabela de junção).
- Q: Como exibir post sem categoria definida? → A: Listar com rótulo **"Sem categoria"** (Uncategorized).
- Q: Quais categorias aparecem no menu `/blog`? → A: **Apenas categorias com ≥1 post publicado** (opção B).
- Q: Como exibir múltiplas categorias no card? → A: **Um badge por categoria** — exibir todas (opção A).
- Q: "Sem categoria" no menu de filtro? → A: **Sim** — item fixo no menu; ao selecionar, mostra só posts sem categorias (opção A).

---

## Decisões de Clarificação (Q1–Q7 resolvidas)

| # | Questão | Decisão |
|---|---------|---------|
| Q1 | Relacionamento post ↔ categoria? | **Many-to-Many** — um post pode pertencer a **zero ou mais** categorias via tabela de junção `post_categories`. |
| Q2 | CRUD de categorias? | **Fora do escopo** — leitura apenas; seed inicial via migration; gestão futura via banco externo. |
| Q3 | O que acontece com `posts.tag`? | **Removido**. Migration cria vínculos em `post_categories` a partir do valor histórico de `tag` (1 categoria por post migrado) e depois dropa a coluna `tag`. |
| Q4 | Filtragem na UI: client-side ou URL? | **Client-side** sobre posts já carregados no loader SSR — posts publicados são poucos; evita round-trip extra. Opção "Todos" exibe lista completa. Estado ativo refletido visualmente no menu de categorias. |
| Q5 | Quais categorias no menu? | **Somente categorias com ≥1 post publicado** — categorias vazias ficam ocultas. |
| Q6 | Múltiplas categorias no card? | **Um badge por categoria** — exibir todas as categorias do post. |
| Q7 | Filtro "Sem categoria"? | **Sim** — item fixo no menu; filtra posts com `categories.length === 0`. |

---

## User Scenarios & Testing *(mandatory)*

### Primary User Story

**Como visitante do blog**, quero ver as categorias disponíveis e filtrar os
posts por categoria, para encontrar conteúdo relevante ao meu interesse sem
navegar post a post.

**Como autor (Bruno)**, quero que categorias existam no banco de forma
estruturada e que posts existentes mantenham sua classificação após a
migration, sem precisar de painel administrativo neste projeto.

### Acceptance Scenarios

#### Banco & migration
1. **Dado** que a migration foi aplicada, **Quando** consulto a tabela
   `categories`, **Então** existem categorias iniciais seedadas com nomes
   alinhados aos valores históricos de `tag` (Produtividade, Negócios,
   Ferramentas) e slug estável para cada uma.
2. **Dado** posts existentes com `tag` preenchido antes da migration,
   **Quando** a migration de dados roda, **Então** cada post recebe registro(s)
   em `post_categories` mapeando o valor anterior de `tag` para a categoria
   correspondente (`name` ou `slug`).
3. **Dado** post de teste com tag "Teste", **Quando** migration roda,
   **Então** categoria "Teste" é seedada e associada ao post via
   `post_categories`.

#### Listagem `/blog`
4. **Dado** categorias no banco, **Quando** visitante acessa `/blog`, **Então**
   vê menu listando **"Todos"**, **"Sem categoria"** e **apenas** categorias
   que possuem ≥1 post publicado, ordenadas por `position` ou nome.
5. **Dado** listagem carregada, **Quando** visitante clica em uma categoria,
   **Então** permanecem visíveis posts que possuem **aquela** categoria (match
   por slug); posts sem a categoria selecionada são ocultados sem recarregar a
   página.
6. **Dado** listagem carregada, **Quando** visitante clica em **"Sem
   categoria"**, **Então** permanecem visíveis **somente** posts com
   `categories.length === 0`.
7. **Dado** filtro ativo, **Quando** visitante clica em **"Todos"**, **Então**
   todos os posts publicados voltam a ser exibidos.
8. **Dado** categoria selecionada sem posts publicados, **Quando** visitante
   filtra por ela, **Então** vê estado vazio amigável (mensagem pt-BR), sem
   erro de aplicação.
9. **Dado** posts publicados, **Quando** visitante acessa `/blog`, **Então**
   cada card exibe **um badge por categoria** (nome pt-BR); posts sem
   categorias exibem badge único **"Sem categoria"**.
10. **Dado** post publicado **sem** vínculos em `post_categories`, **Quando**
    visitante acessa `/blog`, **Então** o post aparece na listagem com badge
    **"Sem categoria"** e é filtrável via item **"Sem categoria"** do menu.

#### Detalhe `/blog/:slug`
11. **Dado** post publicado com uma ou mais categorias, **Quando** visitante
    abre o post, **Então** exibe **um badge por categoria** associada.
12. **Dado** post publicado sem categorias, **Quando** visitante abre o post,
    **Então** badge exibe **"Sem categoria"**.

#### Sem CRUD
13. **Dado** esta entrega, **Quando** busco rotas de API ou páginas de
    dashboard para criar/editar/excluir categorias, **Então** **não existem**
    — apenas leitura.

#### Regressão spec 001
14. **Dado** posts `draft`, **Quando** visitante acessa `/blog`, **Então**
    rascunhos continuam ocultos (comportamento inalterado).
15. **Dado** loader SSR de `/blog`, **Quando** página renderiza, **Então**
    categorias e posts vêm do servidor (Drizzle) — filtro é interação
    client-side sobre dados já hidratados.

### Edge Cases

- Banco sem categorias (seed falhou): menu exibe **"Todos"** e **"Sem categoria"**
  apenas; listagem de posts continua com badges **"Sem categoria"** quando
  aplicável.
- Categoria adicionada externamente após deploy: entra no menu após próximo
  SSR/refresh **somente** quando tiver ≥1 post publicado associado.
- Categoria que perde todos os posts publicados: deixa de aparecer no menu no
  próximo SSR/refresh.
- Post com múltiplas categorias: aparece ao filtrar por **qualquer** uma delas;
  exibe **um badge por categoria** em listagem e detalhe.
- Post sem categorias: badge **"Sem categoria"**; filtrável via item homônimo
  no menu; **não** aparece ao filtrar por categoria do banco.
- Posts migrados com `tag` preenchido recebem vínculo em `post_categories`; posts
  futuros sem vínculos permanecem válidos e aparecem como "Sem categoria".
- Categoria com slug duplicado: constraint UNIQUE em `slug` impede inconsistência.

---

## Requirements *(mandatory)*

### Functional Requirements

**Categorias (banco):**
- **FR-001**: O sistema DEVE possuir tabela `categories` com pelo menos:
  `id` (uuid PK), `slug` (único, URL-safe), `name` (exibição pt-BR),
  `position` (ordenação no menu, inteiro) e `created_at`.
- **FR-002**: Migration DEVE seedar categorias iniciais derivadas dos valores
  de `tag` usados nos posts existentes: **Produtividade**, **Negócios**,
  **Ferramentas** e **Teste** (post de teste).
- **FR-003**: O sistema NÃO DEVE expor endpoints ou UI para Create, Update ou
  Delete de categorias nesta entrega.

**Relacionamento posts ↔ categorias:**
- **FR-004**: Tabela de junção `post_categories` DEVE ligar `posts` e
  `categories` com FKs (`post_id`, `category_id`), constraint UNIQUE
  `(post_id, category_id)` e `ON DELETE CASCADE` em ambas as FKs.
- **FR-005**: Migration DEVE migrar cada post existente de `tag` (texto) para
  um ou mais registros em `post_categories` antes de remover a coluna `tag`
  (posts atuais: exatamente 1 vínculo por post, derivado do `tag` legado).
- **FR-006**: Um post pode pertencer a **zero ou mais** categorias
  (Many-to-Many). Array `categories` vazio indica post sem categoria.

**Camada de dados (server):**
- **FR-007**: `getAllPosts()` DEVE retornar posts publicados com array
  `categories` (mínimo por item: `slug`, `name`), ordenado por
  `categories.position` ou `name`.
- **FR-008**: `getPostBySlug()` DEVE incluir array `categories` no objeto
  retornado.
- **FR-009**: `getCategoriesForBlogMenu()` em `categories.server.ts` DEVE retornar
  **somente** categorias com **≥1 post publicado**, ordenadas por `position` ou
  `name`. Categorias sem posts publicados **não** aparecem no menu.
- **FR-020**: Filtro **"Sem categoria"** é item **fixo** do menu (não é linha
  em `categories`); usa identificador interno reservado (ex.: slug sentinela
  `sem-categoria`) para filtrar posts com `categories.length === 0`.

**Frontend `/blog`:**
- **FR-010**: Página `/blog` DEVE renderizar menu acima do grid com itens
  **"Todos"** (padrão), **"Sem categoria"** (fixo) e categorias retornadas por
  `getCategoriesForBlogMenu()`.
- **FR-011**: Seleção de categoria do banco DEVE filtrar client-side quando
  **qualquer** item de `post.categories` corresponde ao slug ativo. Seleção de
  **"Sem categoria"** DEVE filtrar posts com `categories.length === 0`.
- **FR-012**: Item de menu ativo DEVE ter destaque visual acessível (estado
  selecionado discernível).
- **FR-013**: Layout DEVE ser mobile-first (menu scroll horizontal ou wrap em
  telas pequenas).

**Frontend detalhe & landing:**
- **FR-014**: `/blog/:slug` DEVE exibir **um badge por categoria** (`name`);
  se `categories` estiver vazio, exibir badge único **"Sem categoria"**
  (substituir `post.tag`).
- **FR-015**: `BlogSection` na landing DEVE usar dados do banco (via loader da
  home ou helper server compartilhado) e exibir **um badge por categoria** ou
  **"Sem categoria"** — remover dependência de `posts.ts` deprecated para tags.
- **FR-019**: Posts com `categories.length === 0` DEVEM exibir rótulo
  **"Sem categoria"** (Uncategorized) em listagem, detalhe e landing — não
  ocultar o post nem omitir o badge.

**Seeds & scripts:**
- **FR-016**: Scripts `seed-posts.ts` e `seed-test-post.ts` DEVEM associar
  posts a categorias via `post_categories` (lookup por slug) em vez de `tag`.
- **FR-017**: Seeds DEVEM permanecer idempotentes (`onConflictDoNothing` ou
  equivalente).

**Documentação:**
- **FR-018**: Atualizar `AI_CONTEXT.md` e `TECHNICAL_SPEC_COMPACT.md` se schema
  ou fluxo do blog mudar materialmente.

### Key Entities *(include if feature involves data)*

**Category**
Taxonomia read-only do blog. Campos: `id`, `slug` (identificador estável para
filtro e URLs futuras), `name` (rótulo pt-BR exibido na UI), `position`
(ordenação no menu), `createdAt`. Relação Many-to-Many com `Post` via
`PostCategory`. Gestão externa ao app após seed inicial.

**PostCategory**
Tabela de junção. Campos: `postId` (FK → Post), `categoryId` (FK → Category).
Constraint UNIQUE `(postId, categoryId)`.

**Post** *(atualização)*
Campo `tag` removido. Demais campos inalterados (spec 001). Campo derivado na
resposta server: `categories: Array<{ slug, name }>` (0..N itens). Array vazio
→ UI exibe **"Sem categoria"**.

---

## Escopo & Limites

### Dentro do escopo
- Tabelas Drizzle `categories` + `post_categories` (Many-to-Many).
- Migration Drizzle Kit: DDL + seed de categorias + migração de dados +
  drop de `posts.tag`.
- Funções server: `getCategoriesForBlogMenu()`, joins em `getAllPosts()` /
  `getPostBySlug()`.
- Componente de navegação/filtro de categorias em `/blog`.
- Atualização de badges em `/blog`, `/blog/:slug` e landing `BlogSection`.
- Atualização dos scripts de seed.

### Fora do escopo
- CRUD de categorias (dashboard, API POST/PUT/DELETE).
- Rotas dedicadas por categoria (`/blog/categoria/:slug`) — pode ser feature
  futura; filtro client-side basta nesta entrega.
- Paginação, busca full-text, contagem de posts por categoria na UI.
- Sincronização automática com sistema externo de categorias.
- i18n de nomes de categoria.

---

## Validação e Testes

**Abordagem acordada (desvio documentado da constitution §III):** o repositório
não possui runner automatizado (vitest/jest). Esta feature usa validação
**manual** via `quickstart.md` + `npm run typecheck`, alinhada à spec 001.

| Gate | Artefato | Quando |
|------|----------|--------|
| Tipos | `npm run typecheck` | Após camada server e rotas (T024) |
| Funcional | `quickstart.md` checklist C1–C15 | Após implementação (T025) |
| Negativo FR-003 | Confirmar ausência de rotas CRUD/API de categorias | T025 |

Função pura `filterPostsByCategory()` (T014) deve ser testável manualmente com
casos documentados no quickstart; runner automatizado fica fora do escopo desta
entrega.

---

## Dependências & Suposições

- Feature **001** (blog dinâmico) aplicada: tabela `posts` e loaders SSR ativos.
- Postgres acessível localmente e em produção; migrations via Drizzle Kit.
- Valores históricos de `tag` nos seeds são a fonte de verdade para categorias
  iniciais.
- Volume de posts permanece baixo — filtro client-side é aceitável.
- Sistema externo futuro inserirá linhas em `categories` e vínculos em
  `post_categories` diretamente no Postgres.

---

## Review & Acceptance Checklist

### Content Quality
- [x] Focado no QUÊ e no POR QUÊ
- [x] Todas as seções obrigatórias preenchidas
- [x] Escrito para ser compreendido pelo autor

### Requirement Completeness
- [x] Questões em aberto (Q1–Q7) resolvidas
- [x] Requisitos testáveis e não ambíguos (FR-001 a FR-020)
- [x] Critérios de sucesso mensuráveis (15 cenários de aceitação)
- [x] Escopo claramente delimitado
- [x] Dependências e suposições identificadas

---

## Execution Status

- [x] Descrição do usuário parseada
- [x] Conceitos-chave extraídos
- [x] Ambiguidades marcadas e resolvidas (Q1–Q7)
- [x] Cenários de usuário definidos (15 cenários)
- [x] Requisitos gerados (FR-001 a FR-020)
- [x] Entidades identificadas (Category, PostCategory, Post atualizado)
- [x] **Pronto para `/implement`**

---
