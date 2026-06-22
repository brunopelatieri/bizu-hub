# Deploy — Bizu Hub Bruno Goulart

Produção em **https://brunogoulart.com.br** na VPS (Ubuntu + Docker + Portainer).

Repositório: **[gitlab.com/brunopelatieri/bizu-hub](https://gitlab.com/brunopelatieri/bizu-hub)**  
Imagem: **GitLab Container Registry (pública para pull)** — `registry.gitlab.com/brunopelatieri/bizu-hub`

---

## Visão geral

```text
[Dev local]  npm run docker:build  →  docker push  →  [GitLab Container Registry]
         (docker login só aqui)                              ↓
[VPS]  Portainer Stack  →  pull anônimo  →  app:3000  ←  Traefik/NPM + TLS
                              ↓
                         postgres:5432
```

**Pull na VPS:** imagem pública — **sem** registry no Portainer e **sem** `docker login`.  
**Push (PC ou CI):** exige autenticação GitLab com `write_registry`.

---

## 1. GitLab Container Registry

Projeto: **https://gitlab.com/brunopelatieri/bizu-hub**

```text
registry.gitlab.com/brunopelatieri/bizu-hub:latest
```

### Pull (VPS / Portainer) — público

Qualquer host com Docker pode puxar sem credenciais:

```bash
docker pull registry.gitlab.com/brunopelatieri/bizu-hub:latest
```

No Portainer: use a URL da imagem nas variáveis da stack — **não** cadastre Registries.

### Push (dev local ou CI) — autenticado

**Opção A — Personal Access Token**

1. GitLab → **Preferences → Access Tokens**
2. Scopes: `write_registry` (e `read_registry` se quiser pull local autenticado)
3. Login local:

   ```bash
   docker login registry.gitlab.com -u SEU_USUARIO -p glpat-SEU_TOKEN
   ```

**Opção B — Deploy Token (CI)**

1. GitLab → projeto **bizu-hub** → **Settings → Repository → Deploy tokens**
2. Scopes: `write_registry` para CI; `read_registry` opcional
3. O pipeline `.gitlab-ci.yml` usa as credenciais do runner ou variáveis CI

---

## 2. Build e push (máquina de desenvolvimento)

```bash
cp deploy/.env.docker.example deploy/.env.docker
# Edite VITE_SUPABASE_* (obrigatório — embutidos no bundle no build)

docker login registry.gitlab.com   # obrigatório apenas para push
npm run docker:build    # build local
npm run docker:push     # build + push para GitLab Registry
```

Variáveis em `deploy/.env.docker`:

| Variável | Quando | Descrição |
|----------|--------|-----------|
| `DOCKER_IMAGE` | build/push | `registry.gitlab.com/brunopelatieri/bizu-hub` |
| `DOCKER_TAG` | build/push | Ex.: `latest` ou `1.0.0` |
| `VITE_SUPABASE_URL` | **build** | URL do projeto Supabase |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | **build** | Chave pública Supabase |

> **Importante:** `VITE_*` são compilados no client durante o `docker build`.  
> Alterou Supabase? Faça **rebuild + push** da imagem.

---

## 3. Migrations (antes ou após deploy)

O container de produção **não** inclui `drizzle-kit`. O deploy usa só a **imagem Docker** — não é necessário clonar o repositório na VPS.

Arquivos SQL em `drizzle/` (ex.: `drizzle/0000_cloudy_miracleman.sql`).

### Método recomendado — Portainer Console (sem SSH)

1. **Containers** → `bizu-hub_postgres` → **Console**
2. Comando: `psql -U bizu_hub -d bizu_hub`
3. Cole o conteúdo do arquivo `.sql` em `drizzle/` (ex. migration `0000_cloudy_miracleman.sql`)
4. Enter — resposta esperada: `CREATE TABLE`
5. Saia com `\q`

Se a tabela já existir: `ERROR: relation "contact_messages" already exists` — migration já aplicada.

Validar:

```sql
\d contact_messages
```

### Alternativa — SSH (sem clone do repo)

Baixar só o SQL e aplicar:

```bash
curl -fsSL https://raw.githubusercontent.com/brunopelatieri/bizu-hub/main/drizzle/0000_cloudy_miracleman.sql | \
  docker exec -i $(docker ps -q -f name=bizu-hub_postgres) \
  psql -U bizu_hub -d bizu_hub
```

### Alternativa — Drizzle Kit no PC (Postgres exposto ou túnel)

```bash
DATABASE_URL="postgresql://USER:PASS@IP_VPS:5432/bizu_hub" \
DIRECT_URL="postgresql://USER:PASS@IP_VPS:5432/bizu_hub" \
npm run db:migrate
```

---

## 4. Stack no Portainer

Guia passo a passo: **`deploy/PORTAINER.md`**  
**Atualizar imagem pelo Portainer (sem SSH):** **`deploy/PORTAINER-ATUALIZAR.md`**

Não é necessário configurar registry no Portainer — a imagem é pública.

### Sem domínio ainda (bootstrap)

Arquivo: **`deploy/portainer-stack.bootstrap.yml`**

- Publica **app** na porta `3000` do host → `http://212.85.19.156:3000`
- Rede externa **`bru`** (mesma dos outros serviços)
- Use até apontar DNS; depois troque por **`portainer-stack.yml`**

Passos:

1. Portainer → **Stacks** → **Add stack**
2. Nome: `bizu-hub`
3. Cole o conteúdo de `portainer-stack.bootstrap.yml`
4. **Environment variables** — use `deploy/.env.portainer.example` como base
5. Deploy the stack (Swarm)

A rede **`bru`** já existe na sua VPS (MinIO, MCP, etc.) — não precisa criar.

### Produção (Traefik)

Detalhes completos em **`deploy/PORTAINER.md`**. Resumo:

1. DNS `A` `@` e `www` → **212.85.19.156**
2. Stack **`portainer-stack.yml`** com variáveis do `.env.portainer.example`
3. Certificado Let's Encrypt via Traefik (`letsencryptresolver`)

### Nginx Proxy Manager

Arquivo: **`deploy/portainer-stack.npm.yml`**

1. Deploy a stack (sem labels Traefik)
2. No NPM: **Proxy Host**
   - Domain: `brunogoulart.com.br`
   - Forward: `http://app:3000` (container na rede da stack)
   - SSL: Let's Encrypt

---

## 5. DNS

Aponte para o IP da VPS:

| Registro | Valor |
|----------|-------|
| `A` `@` | `212.85.19.156` |
| `A` `www` | `212.85.19.156` (redirect configurado no Traefik) |

---

## 6. Supabase Auth

No dashboard Supabase → **Authentication → URL Configuration**:

| Campo | Valor |
|-------|-------|
| Site URL | `https://brunogoulart.com.br` |
| Redirect URLs | `https://brunogoulart.com.br/auth/callback` |

---

## 7. Checklist pós-deploy

- [ ] `https://brunogoulart.com.br` carrega a landing
- [ ] `https://brunogoulart.com.br/api/health` retorna `{"ok":true}`
- [ ] Formulário de contato persiste no Postgres
- [ ] Login Supabase funciona em `/login`
- [ ] `robots.txt` e `sitemap.xml` com domínio correto

---

## 8. Atualizar produção

### Opção A — CI/CD GitLab

A cada push na branch principal, o pipeline `.gitlab-ci.yml` faz build e push
automático para o Container Registry.

1. GitLab → **Settings → CI/CD → Variables**:

   | Variável | Tipo | Protegida |
   |----------|------|-----------|
   | `VITE_SUPABASE_URL` | Variable | sim (branch main) |
   | `VITE_SUPABASE_PUBLISHABLE_KEY` | Variable | sim |

2. Push na `main` → **Build → Pipelines** → job `build-image` concluído
3. Portainer → stack `bizu-hub` → **Re-pull image** → Update the stack

### Opção B — Build manual (dev local)

```bash
docker login registry.gitlab.com   # só para push
npm run docker:push

# Portainer → stack bizu-hub → Re-pull image → Update the stack
```

Imagem publicada:

```text
registry.gitlab.com/brunopelatieri/bizu-hub:latest
registry.gitlab.com/brunopelatieri/bizu-hub:<commit-sha>
registry.gitlab.com/brunopelatieri/bizu-hub:<tag>
```

Para tags versionadas manuais, altere `DOCKER_TAG` no build e nas variáveis da stack.
