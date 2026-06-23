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

Arquivos: `drizzle/*.sql` (ex: `0000_cloudy_miracleman.sql`)

### Método recomendado — Portainer Console

1. Portainer → **Containers** → `bizu-hub_postgres` → **Console**
2. `psql -U bizu_hub -d bizu_hub`
3. Cole o conteúdo do `.sql`
4. `\q` para sair

### Alternativa — SSH

```bash
curl -fsSL https://raw.githubusercontent.com/brunopelatieri/bizu-hub/main/drizzle/0000_cloudy_miracleman.sql | \
  docker exec -i $(docker ps -q -f name=bizu-hub_postgres) \
  psql -U bizu_hub -d bizu_hub
```

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
