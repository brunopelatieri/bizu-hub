# Quickstart: Validar Busca no Blog (Spec 003)

**Pré-requisitos**: Spec 002 aplicada; dev server (`npm run dev`); posts publicados no banco.

---

## 1. Typecheck

```bash
npm run typecheck
```

---

## 2. Teste manual da API

Com dev server rodando:

```bash
curl "http://localhost:5173/api/blog/search?q=portal&category=todos"
curl "http://localhost:5173/api/blog/search?q=po&category=todos"
# esperado: 400 (q < 3)
curl "http://localhost:5173/api/blog/search?q=portal&category=produtividade"
```

Verificar JSON `{ "posts": [...] }` sem campo `content`.

---

## 3. UI `/blog`

Abrir `http://localhost:5173/blog`

### Threshold e debounce
- [ ] **C1** Digitar 1–2 chars → sem loader; sem preview; grid só categoria
- [ ] **C2** Digitar ≥3 chars → após ~300ms loader aparece

### Estados
- [ ] **C3** Loading spinner visível durante fetch
- [ ] **C4** Com matches → preview dropdown + grid atualizados
- [ ] **C5** Sem matches → "Nenhum post encontrado."
- [ ] **C6** Apagar até <3 → idle; grid volta ao filtro categoria

### Categoria + busca
- [ ] **C7** Categoria + query → resultados intersectam
- [ ] **C8** Trocar categoria com busca ativa → re-fetch

### Preview
- [ ] **C9** Clicar item preview → `/blog/:slug`
- [ ] **C10** Escape fecha preview

### Regressão
- [ ] **C11** Busca vazia → menu categorias igual spec 002
- [ ] **C12** Drafts nunca aparecem

### A11y (inspeção rápida)
- [ ] **C13** Input combobox; `aria-busy` durante loading
- [ ] **C14** `aria-live` anuncia contagem

### Erro
- [ ] **C15** Simular offline → mensagem de erro pt-BR (DevTools offline)

---

## 4. FR-003 negativo

Confirmar que **não** existe CRUD de busca/config — apenas GET read-only.

---
