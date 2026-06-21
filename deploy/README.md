# Deploy — Bizu Hub Bruno Goulart

Produção em **https://brunogoulart.com.br** na VPS (Ubuntu + Docker + Portainer).

Repositório: **[gitlab.com/brunopelatieri/bizu-hub](https://gitlab.com/brunopelatieri/bizu-hub)**  
Imagem: **GitLab Container Registry** (`registry.gitlab.com/brunopelatieri/bizu-hub`)

---

## Visão geral

```text
[Dev local]  npm run docker:build  →  docker push  →  [GitLab Container Registry]
                                                              ↓
[VPS]  Portainer Stack  →  pull imagem  →  app:3000  ←  Traefik/NPM + TLS
                              ↓
                         postgres:5432
```

---

## 1. GitLab Container Registry

Projeto: **https://gitlab.com/brunopelatieri/bizu-hub**

O registry fica em:

```text
registry.gitlab.com/brunopelatieri/bizu-hub:latest
```

### Token para push (dev) e pull (VPS)

**Opção A — Personal Access Token**

1. GitLab → **Preferences → Access Tokens**
2. Scopes: `read_registry`, `write_registry`
3. Login local:

   ```bash
   docker login registry.gitlab.com -u SEU_USUARIO -p glpat-SEU_TOKEN
   ```

**Opção B — Deploy Token (recomendado para Portainer/VPS)**

1. GitLab → projeto **bizu-hub** → **Settings → Repository → Deploy tokens**
2. Scopes: `read_registry` (pull na VPS); adicione `write_registry` se for push via CI
3. Login:

   ```bash
   docker login registry.gitlab.com -u gitlab+deploy-token-XXXX -p TOKEN
   ```

### Portainer

**Registries → Add registry**

| Campo | Valor |
|-------|-------|
| Provider | Custom |
| Name | GitLab Registry |
| Registry URL | `registry.gitlab.com` |
| Username | usuário GitLab ou deploy token |
| Password | PAT ou deploy token |

---

## 2. Build e push (máquina de desenvolvimento)

```bash
cp deploy/.env.docker.example deploy/.env.docker
# Edite VITE_SUPABASE_* (obrigatório — embutidos no bundle no build)

docker login registry.gitlab.com
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

O container de produção **não** inclui `drizzle-kit`. Rode migrations a partir do clone local apontando para o Postgres da VPS:

```bash
git clone https://gitlab.com/brunopelatieri/bizu-hub.git
cd bizu-hub

DATABASE_URL="postgresql://USER:PASS@IP_VPS:5432/bizu_hub" \
DIRECT_URL="postgresql://USER:PASS@IP_VPS:5432/bizu_hub" \
npm run db:migrate
```

Ou execute um job one-off na VPS com Node + clone do repo (apenas para migrations).

---

## 4. Stack no Portainer

Guia passo a passo: **`deploy/PORTAINER.md`**

Configure o registry GitLab **antes** do deploy (seção 1).

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

### Opção A — CI/CD GitLab (recomendado)

A cada push na branch principal (ou tag), o pipeline `.gitlab-ci.yml` faz build e push
automático para o Container Registry do projeto.

1. GitLab → **Settings → CI/CD → Variables** — adicione:

   | Variável | Tipo | Protegida |
   |----------|------|-----------|
   | `VITE_SUPABASE_URL` | Variable | sim (branch main) |
   | `VITE_SUPABASE_PUBLISHABLE_KEY` | Variable | sim |

2. Push na `main` → **Build → Pipelines** → job `build-image` concluído
3. Portainer → stack `bizu-hub` → **Pull and redeploy**

Imagem publicada:

```text
registry.gitlab.com/brunopelatieri/bizu-hub:latest
registry.gitlab.com/brunopelatieri/bizu-hub:<commit-sha>
registry.gitlab.com/brunopelatieri/bizu-hub:<tag>   # se push de tag Git
```

### Opção B — Build manual (dev local)

```bash
docker login registry.gitlab.com
npm run docker:push

# Portainer → stack bizu-hub → Pull and redeploy
```

Para tags versionadas manuais, altere `DOCKER_TAG` no build e nas variáveis da stack.
