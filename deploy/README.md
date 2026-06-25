# Deploy — Bizu Hub Bruno Goulart

Produção: **https://brunogoulart.com.br** | VPS Ubuntu + Docker + Portainer  
Repositório: [gitlab.com/brunopelatieri/bizu-hub](https://gitlab.com/brunopelatieri/bizu-hub)  
Imagem: `registry.gitlab.com/brunopelatieri/bizu-hub:latest` **(pública para pull)**

---

## Quick Start

### 1️⃣ Build + Push (no seu PC)

```bash
# Setup (primeira vez)
cp deploy/.env.docker.example deploy/.env.docker
# Edite VITE_SUPABASE_URL e VITE_SUPABASE_PUBLISHABLE_KEY em deploy/.env.docker

# Login (primeira vez só — token com write_registry)
docker login registry.gitlab.com

# Build + Push
npm run docker:push
```

### 2️⃣ Update na VPS (Portainer)

```
Stacks → bizu-hub → Update the stack → Re-pull image → Update
```

Aguarde 1-2 min. Site em produção automaticamente.

### 3️⃣ Conferir

```bash
curl https://brunogoulart.com.br/api/health
# Esperado: {"ok":true}
```

---

## Ambiente Variables (Build)

`deploy/.env.docker`:

| Variável | Valor |
|----------|-------|
| `DOCKER_IMAGE` | `registry.gitlab.com/brunopelatieri/bizu-hub` |
| `DOCKER_TAG` | `latest` |
| `VITE_SUPABASE_URL` | (obrigatório — embutido no build) |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | (obrigatório — embutido no build) |

---

## Migrations (Banco de Dados)

Arquivos gerados em `drizzle/*.sql` pelo Drizzle Kit. O Drizzle rastreia quais
migrations já rodaram na tabela `drizzle.__drizzle_migrations` — logo o script
é **idempotente**: pode ser executado várias vezes sem efeito colateral.

### Script automático (recomendado)

```bash
npm run db:migrate:prod
```

Conecta via `DIRECT_URL` (prod) ou `DATABASE_URL` (dev), aplica apenas as
migrations pendentes e loga cada etapa com emoji + timestamp.

> **Pré-requisito para produção:** `DIRECT_URL` apontando para o Postgres da VPS.
> Veja o Contexto 0 abaixo — é o jeito mais simples desde que o acesso externo foi habilitado.

---

### Contexto 0 — Dev PC direto ⭐ (preferido)

Com a porta `5432` exposta na VPS e o IP de dev liberado no `ufw`
(ver `INFRA_POSTGRES_EXTERNAL_ACCESS.md`), rodar migrations **sem SSH nem Portainer**:

```bash
# No seu PC de desenvolvimento (IP autorizado no firewall da VPS)
DIRECT_URL="postgresql://bizu_hub:SENHA@212.85.19.156:5432/bizu_hub" npm run db:migrate:prod
```

Saída esperada (primeira vez):

```
🚀 Production Migrations — 2026-06-24T12:00:00.000Z
📁 Folder: /path/to/bizu-hub/drizzle
🗄️  Database: postgresql://***:***@212.85.19.156:5432/bizu_hub
🌍 NODE_ENV: development

ℹ️  Migrations already applied: 0
✅ 2 migration(s) applied:
   • abc123...
   • def456...

⏱️  Done in 0.38s
```

Saída idempotente (segunda vez):

```
ℹ️  Migrations already applied: 2
✅ No new migrations — database is already up to date.
```

> **Dica:** adicione a `DIRECT_URL` de produção no seu `.env.local`
> (já no `.gitignore`) para não precisar digitá-la toda vez:
>
> ```bash
> # .env.local (nunca commitar com valor real)
> DIRECT_URL=postgresql://bizu_hub:SENHA@212.85.19.156:5432/bizu_hub
> ```
>
> O script carrega `.env.local` automaticamente em dev.

---

### Contexto 1 — SSH direto na VPS

```bash
# Acesse via SSH e rode dentro da VPS (precisa do código no server)
DIRECT_URL="postgresql://bizu_hub:SENHA@localhost:5432/bizu_hub" npm run db:migrate:prod
```

---

### Contexto 2 — Docker exec (container da app)

O jeito mais simples em produção: executa dentro do container que já tem as
credenciais via environment variables do Portainer.

```bash
# Ver nome do container
docker ps --filter name=bizu-hub

# Rodar migrations dentro do container
docker exec bizu-hub npm run db:migrate:prod

# Com nome de container alternativo (stack Portainer usa prefixo de stack)
docker exec bizu-hub_app npm run db:migrate:prod
```

Saída esperada:

```
🚀 Production Migrations — 2026-06-24T12:00:00.000Z
📁 Folder: /app/drizzle
🗄️  Database: postgresql://***:***@postgres:5432/bizu_hub
🌍 NODE_ENV: production

ℹ️  Migrations already applied: 1
✅ 1 migration(s) applied:
   • abc123...

⏱️  Done in 0.42s
```

Segunda execução (idempotência):

```
ℹ️  Migrations already applied: 2
✅ No new migrations — database is already up to date.
```

---

### Contexto 3 — Portainer Console (acesso psql direto)

Use apenas como fallback se o container da app não estiver disponível ou para
inspecionar o estado das migrations.

1. Portainer → **Containers** → `bizu-hub_postgres` → **Console**
2. Execute:

```bash
psql -U bizu_hub -d bizu_hub

# Ver migrations aplicadas
SELECT id, hash, created_at FROM drizzle.__drizzle_migrations ORDER BY created_at;

# Sair
\q
```

> **Não cole SQL manualmente.** Prefira sempre o script automático acima.

---

### Rollback de Migrations

Reverte as últimas N migrations removendo seus registros de `__drizzle_migrations`.

> ⚠️ O rollback **não** desfaz automaticamente `CREATE TABLE`, `ALTER TABLE`
> ou dados — você precisará aplicar o SQL reverso manualmente.

```bash
# Rollback da última migration (default: 1 step)
npm run db:migrate:rollback

# Rollback das últimas 3 migrations
npm run db:migrate:rollback -- --steps=3

# Dry-run: ver o que seria revertido sem executar
npm run db:migrate:rollback -- --dry-run

# Pular confirmação interativa (ex: CI/CD)
npm run db:migrate:rollback -- --force
```

Via Docker:

```bash
docker exec bizu-hub npm run db:migrate:rollback -- --steps=1
```

---

### Troubleshooting

| Erro | Causa | Solução |
|------|-------|---------|
| `DIRECT_URL or DATABASE_URL is not set` | Env var ausente | Definir no container ou passar na linha de comando |
| `Failed to connect` | Postgres down ou connection string errada | Verificar `DATABASE_URL` e se o container Postgres está rodando |
| `relation "drizzle.__drizzle_migrations" does not exist` | Primeiro run — normal | O script cria a tabela automaticamente; rode novamente |
| Timeout na migration | Tabela com muitos dados | Aumentar `statement_timeout` no Postgres ou rodar em horário de baixo tráfego |
| `No new migrations` | Migrations já aplicadas | Comportamento correto — idempotência garantida |
| Rollback sem efeito | Migration já foi revertida | Idempotente — sem efeito colateral em segundo rollback |

---

### Baseline de Migrations (quando schema já existe)

Se o schema do banco já foi criado manualmente (via SQL no Portainer, por exemplo), mas o Drizzle não tem registro em `__drizzle_migrations`, use:

```bash
# Registra todas as migrations até um tag no journal (SEM executar SQL)
npm run db:migrate:baseline -- 0002_your_migration_tag

# Exemplo: registrar até a migration de posts
npm run db:migrate:baseline -- 0002_add_blog_tables

# Depois rode:
npm run db:migrate:prod
```

**Quando usar:**
- Schema criado manualmente no Portainer → baseline até última migration
- Banco restaurado de backup → baseline para sincronizar journal com schema real
- Primeira vez rodando migrations em DB existente → baseline tudo, depois `db:migrate:prod`

---

## Seeds (Dados Iniciais do Blog)

Scripts idempotentes — podem ser executados múltiplas vezes sem duplicar dados.

```bash
# Dev local
npm run db:seed           # 3 posts originais
npm run db:seed:test      # 1 post de teste (galeria + mídia + anexos)
npm run db:seed:full      # 4 posts: test post + 3 originais

# Produção (IP de dev autorizado no ufw)
DIRECT_URL="postgresql://bizu_hub:SENHA@212.85.19.156:5432/bizu_hub" npm run db:seed
DIRECT_URL="postgresql://bizu_hub:SENHA@212.85.19.156:5432/bizu_hub" npm run db:seed:full
```

Via Docker exec (dentro da VPS):

```bash
docker exec bizu-hub npm run db:seed
docker exec bizu-hub npm run db:seed:full
```

> **Idempotência:**
> - Posts: `onConflictDoNothing` por slug — nunca duplica.
> - Tabelas relacionadas (`post_images`, `post_media`, `post_attachments`): delete+reinsert — resultado sempre exatamente 3 registros por post.

---

## Setup Inicial (primeira vez)

Veja **`deploy/PORTAINER.md`** — guia completo com DNS, TLS, Traefik e variáveis da stack.

---

## Atualizar Versão

**Fluxo:**
1. `npm run docker:push` (no PC ou GitLab CI automático)
2. Portainer → Stack → **Re-pull image** → **Update**
3. Pronto ✅

Ver **`deploy/PORTAINER-ATUALIZAR.md`** para detalhes.

---

## Supabase Auth

Dashboard Supabase → **Authentication → URL Configuration**:

```
Site URL: https://brunogoulart.com.br
Redirect: https://brunogoulart.com.br/auth/callback
```

---

## Checklist

- [ ] Imagem built locally ou CI passou
- [ ] `docker push` enviou para registry
- [ ] Portainer atualizou (Re-pull image)
- [ ] `https://brunogoulart.com.br/api/health` → `{"ok":true}`
- [ ] Formulário de contato persiste
- [ ] Login funciona
