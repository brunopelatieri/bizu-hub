# Briefing: Production Migration Scripts & Documentation

**Project:** bizu-hub — Bruno Goulart AI Automation Specialist & Full Stack Developer  
**Context:** Spec 001 (Blog Dinâmico) implemented; now need production migration tooling  
**Commit:** e6a2195 (docs: add git/gitlab manual actions guidelines for agents)  
**Branch:** main  
**Model:** Sonnet  

---

## Objetivo

Criar **3 items** para simplificar e automatizar execução de migrations em produção:

1. **`scripts/migrate-production.ts`** — Script que roda migrations via Drizzle (auto-rastreamento)
2. **`deploy/README.md`** — Documentar como usar o script em 3 contextos (SSH, Docker, Portainer)
3. **`scripts/migrate-rollback.ts`** — Undo/rollback de migrations com safety checks

**Resultado esperado:** Zero queries SQL manual em produção. Tudo automático e idempotente.

---

## Contexto do Projeto

### Stack
- **Runtime:** Node.js 22, TypeScript 5.9, ESM
- **ORM:** Drizzle ORM + Postgres 16
- **Migrations:** Drizzle Kit (gera SQL em `drizzle/`)
- **Deploy:** VPS Ubuntu + Docker + Portainer
- **Registry:** GitLab Container Registry (public pull)

### Arquivos Relevantes

| Arquivo | Propósito |
|---------|-----------|
| `drizzle/` | Pasta com migrations SQL (ex: `0001_flippant_marvel_apes.sql`) |
| `drizzle.config.ts` | Config Drizzle Kit (lê `DIRECT_URL` / `DATABASE_URL`) |
| `scripts/seed-posts.ts` | **Referência:** script Node.js existente (use este padrão) |
| `src/db/index.ts` | Cria cliente Drizzle (use para referência) |
| `.env.local` (dev) | `DATABASE_URL=postgresql://portal:portal@localhost:15432/portal` |
| `deploy/README.md` | **Atualizar:** adicionar seção "Migrations em Produção" |
| `package.json` | **Atualizar:** adicionar scripts `db:migrate:prod` e `db:migrate:rollback` |

### Drizzle Migrations Workflow

```text
Developer:
  1. Edita src/db/schema.ts
  2. Roda: npm run db:generate → cria drizzle/000X_*.sql
  3. Roda: npm run db:migrate (dev)
  4. Commita drizzle/000X_*.sql

Production:
  1. DB container tem drizzle/ folder (via Docker)
  2. Executa: npm run db:migrate:prod
  3. Drizzle lê migrations folder + DB state
  4. Insere em __drizzle_migrations table qual rodou
  5. Roda apenas as que não estão no DB

Rollback (se erro):
  1. Executa: npm run db:migrate:rollback --steps=1
  2. Reverte última migration (se suportado por DB)
```

---

## Task 1: `scripts/migrate-production.ts`

### Especificação

**Arquivo:** `scripts/migrate-production.ts`

**Funcionalidade:**
- Conecta ao banco via `DIRECT_URL` (prod) ou `DATABASE_URL`
- Roda Drizzle migrations (via `migrator` do `drizzle-orm`)
- Log detalhado: which migrations ran, duration, status
- Error handling: se falhar, para antes de próxima migration
- Idempotente: pode rodar múltiplas vezes, roda apenas o novo

**Padrão:** Siga estrutura de `scripts/seed-posts.ts`:
```typescript
import { config } from "dotenv";
// ... imports
config({ path: ".env.local" }); // em dev
const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;
// ... criar cliente + executar
```

**Requisitos:**
- TypeScript + tsx runner
- Usar `drizzle-orm/postgres-js/migrator`
- Log com emojis (🚀, ✅, ❌)
- Timestamp de início/fim
- Exit code 0 (success) / 1 (error)
- Handle `process.env.NODE_ENV` (dev vs prod)

**Exemplo de uso:**
```bash
# Dev (local Postgres)
npm run db:migrate:prod

# Prod (via env vars)
DIRECT_URL="postgresql://..." npm run db:migrate:prod

# Prod (via Docker)
docker exec bizu-hub npm run db:migrate:prod
```

**Teste:**
- Rodar localmente 2x (verificar idempotência)
- Verificar `__drizzle_migrations` table após cada run

---

## Task 2: `deploy/README.md` — Seção de Migrations

### Especificação

**Localização:** Adicionar seção "Migrations em Produção" em `deploy/README.md` após seção de deployment

**Conteúdo esperado:**

#### A. Overview
- Breve explicação: como Drizzle rastreia migrations
- Por que automático é melhor que manual
- Links pra Drizzle docs

#### B. Contexto 1: SSH direto na VPS
```bash
# Sintaxe exata + exemplo com DIRECT_URL
```

#### C. Contexto 2: Docker exec (container app)
```bash
# Sintaxe via docker exec
docker exec bizu-hub npm run db:migrate:prod
```

#### D. Contexto 3: Portainer Console (postgres container)
```bash
# Se quiser rodar direto no psql
# (mostrar alternativa, mas recomendar script acima)
```

#### E. Troubleshooting
| Erro | Causa | Solução |
|------|-------|--------|
| `DIRECT_URL not set` | Env var faltando | Passar via cmd ou .env |
| `Failed to connect` | Postgres down ou IP errado | Verificar connectstring |
| Migration timeout | Dados demais | Aumentar timeout psql |
| Already ran | Idempotência OK | Roda novamente = skipped |

#### F. Rollback (Seção separada)
- Como usar `npm run db:migrate:rollback`
- Quando usar (if migration broke)
- Limitations (nem tudo é reversible)

**Tone:** Técnico, didático, com exemplos copy-paste prontos

---

## Task 3: `scripts/migrate-rollback.ts`

### Especificação

**Arquivo:** `scripts/migrate-rollback.ts`

**Funcionalidade:**
- Reverte última N migrations (default 1)
- Usa Drizzle's rollback capability (se disponível) ou aviso "not supported for this migration"
- Safety checks:
  - Confirmar antes de reverter (ou flag `--force`)
  - Log de o que vai ser revertido
  - Backup suggestion (export data before?)
- Idempotente (pode correr 2x, rollback já aplicado = noop)

**CLI Interface:**
```bash
# Rollback 1 migration (latest)
npm run db:migrate:rollback

# Rollback N migrations
npm run db:migrate:rollback -- --steps=3

# Force (sem confirmação)
npm run db:migrate:rollback -- --force

# Dry-run (mostrar o que vai fazer sem fazer)
npm run db:migrate:rollback -- --dry-run
```

**Requisitos:**
- Usar `minimist` ou similar pra parse args (ou hard-code steps=1)
- Log detalhado: which migrations being reverted, status
- Error handling similar ao migrate
- Avisar se migration não tem rollback info
- Opcional: backup suggestion ("export table X before reverting")

**Nota:** Se Drizzle não suporta rollback via API, criar script SQL manual que:
- Deleta linhas de `__drizzle_migrations` (reverse order)
- Mostra SQL que precisa ser executado manually (e.g., DROP TABLE, ALTER COLUMN)

**Teste:**
- Rodar localmente: rollback 1, verificar `__drizzle_migrations`
- Rodar de novo: verificar idempotência (já revertido = noop)

---

## Package.json Updates

**Adicionar scripts:**

```json
{
  "scripts": {
    "db:migrate:prod": "tsx scripts/migrate-production.ts",
    "db:migrate:rollback": "tsx scripts/migrate-rollback.ts"
  }
}
```

---

## Testes Esperados

### Local (Dev)

```bash
# 1. Rodar migrate 2x (verificar idempotência)
npm run db:migrate:prod
npm run db:migrate:prod
# Esperado: segunda vez = "No migrations to run"

# 2. Verificar DB
psql -U portal -d portal -c "SELECT * FROM drizzle.__drizzle_migrations;"
# Esperado: 2 linhas (migration 0000 + 0001)

# 3. Rollback último
npm run db:migrate:rollback
# Esperado: mostra o que vai reverter + pede confirmação

# 4. Verificar DB após rollback
psql -U portal -d portal -c "SELECT * FROM drizzle.__drizzle_migrations;"
# Esperado: 1 linha (0001 removido)
```

### Produção (Simulado)

```bash
# Via Docker (usar container local como "prod")
docker exec bizu-hub npm run db:migrate:prod
# Esperado: sucesso, log mostra migrations

# Via Docker rollback
docker exec bizu-hub npm run db:migrate:rollback
# Esperado: sucesso, confirma rollback
```

---

## Constraints & Padrões

1. **Siga estrutura de `scripts/seed-posts.ts`:**
   - `import { config } from "dotenv"`
   - `config({ path: ".env.local" })`
   - Handle env vars com fallback
   - Log amigável (emojis, cores se possível)
   - Exit codes (0 success, 1 error)

2. **TypeScript:**
   - Strict mode (`strict: true`)
   - No `any`
   - Type imports where needed

3. **Dependências:**
   - Use apenas o que já está em `package.json`
   - Se precisar nova dep (ex: `minimist`), adicionar e mencionar no commit

4. **Documentação:**
   - JSDoc comments no topo de cada função
   - Inline comments para lógica complexa
   - Error messages em português ou inglês (consistente com codebase)

5. **Git/Deployment:**
   - Commit separado pra cada task (migrate + docs + rollback)
   - Ou 1 commit só: `feat: add production migration scripts`
   - Não fazer push (será solicitado manualmente depois)

---

## Aceitação Criteria

- [ ] `scripts/migrate-production.ts` existe, roda sem erro
- [ ] Idempotência testada (rodar 2x = resultado igual)
- [ ] `__drizzle_migrations` table atualiza corretamente
- [ ] Logs são detalhados e amigáveis
- [ ] `scripts/migrate-rollback.ts` existe, reverte migrations
- [ ] Rollback tem safety check (confirmação antes de executar)
- [ ] `package.json` tem `db:migrate:prod` e `db:migrate:rollback`
- [ ] `deploy/README.md` documenta ambos os scripts
- [ ] 3 contextos de uso documentados (SSH, Docker, Portainer)
- [ ] Troubleshooting section com erros comuns
- [ ] `npm run typecheck` passa
- [ ] Commits estão prontos (não fazer push)

---

## Referências

**Dentro do projeto:**
- `scripts/seed-posts.ts` — Pattern base
- `src/db/index.ts` — Como criar cliente Drizzle
- `.env.local` — DB credentials
- `.gitlab-ci.yml` — CI/CD pipeline (se aplicável)

**Drizzle Docs:**
- [Migrator API](https://orm.drizzle.team/docs/migrations)
- [Postgres JS Driver](https://orm.drizzle.team/docs/get-started-postgresql#postgresql-with-postgresjs)

**Projeto Context:**
- `AI_CONTEXT.md` — Visão geral
- `PROJECT_TECHNICAL_SPEC.md` — Schema atual
- `.cursor/rules/git-gitlab-manual-actions.mdc` — Git policy

---

## Adicional: .cursor/rules Update (Opcional)

Se relevante, atualizar `.cursor/rules/git-gitlab-manual-actions.mdc` para mencionar que:
- Migrations em prod = executadas via `npm run db:migrate:prod`
- Agent deve **fornecer comando exato**, não executar
- Rollback é manual + requer confirmação

---

**Pronto pra começar? Boa sorte!** 🚀
