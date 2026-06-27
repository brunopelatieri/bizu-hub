# Quickstart: Validar Categorização de Posts (Spec 002)

**Pré-requisitos**: Postgres local (`.env.local` com `DATABASE_URL`), feature 001 aplicada.

---

## 1. Migration

```bash
npm run db:generate   # após editar src/db/schema.ts
npm run db:migrate
```

Verificar no Drizzle Studio (`npm run db:studio`):

- Tabela `categories` com 4 rows (produtividade, negocios, ferramentas, teste)
- Tabela `post_categories` com vínculos para posts existentes
- Coluna `posts.tag` **removida**

---

## 2. Seeds (se banco vazio ou re-seed)

```bash
npm run db:seed:full
```

---

## 3. Dev server

```bash
npm run dev
```

Abrir `http://localhost:5173/blog` (ou porta do Vite).

---

## 4. Checklist manual (15 cenários)

### Banco
- [ ] **C1** Categorias seedadas com nomes corretos
- [ ] **C2** Posts migrados têm vínculo em `post_categories` equivalente ao `tag` antigo
- [ ] **C3** Post de teste associado à categoria "Teste"

### Menu `/blog`
- [ ] **C4** Menu exibe "Todos", "Sem categoria" e categorias com posts publicados
- [ ] **C5** Clicar categoria filtra posts (client-side, sem reload)
- [ ] **C6** "Sem categoria" mostra só posts sem categorias
- [ ] **C7** "Todos" restaura listagem completa
- [ ] **C8** Categoria sem posts → mensagem "Nenhum post nesta categoria."

### Cards e badges
- [ ] **C9** Um badge por categoria; post sem categoria → badge "Sem categoria"
- [ ] **C10** Post uncategorized filtrável via menu "Sem categoria"

### Detalhe
- [ ] **C11** `/blog/:slug` — múltiplos badges se múltiplas categorias
- [ ] **C12** Post sem categorias → badge "Sem categoria"

### Regressão
- [ ] **C13** Posts `draft` não aparecem em `/blog`
- [ ] **C14** Dados vêm do loader SSR (view source / desabilitar JS parcial)
- [ ] **C15** Landing `/` — seção blog mostra categorias do banco (não `posts.ts`)

### Sem CRUD
- [ ] Nenhuma rota `/api/categories` ou página dashboard de categorias

---

## 5. Typecheck

```bash
npm run typecheck
```

Deve passar sem erros em `post.tag` (campo removido).

---

## 6. Produção

Aplicar migration via Portainer Console ou `npm run db:migrate:prod` conforme runbook do projeto.

---

## Troubleshooting

| Sintoma | Ação |
|---------|------|
| Menu vazio exceto Todos/Sem categoria | Verificar posts `published` e vínculos `post_categories` |
| Migration falha no INSERT | `SELECT DISTINCT tag FROM posts` — tag sem match em `categories.name` |
| Badge ainda mostra tag antiga | Limpar cache; confirmar `posts.server.ts` retorna `categories[]` |
