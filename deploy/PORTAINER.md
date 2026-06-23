# Portainer — Setup Inicial

**VPS:** 212.85.19.156 | Traefik + Rede `bru`  
**Domínio:** brunogoulart.com.br  
**Imagem:** `registry.gitlab.com/brunopelatieri/bizu-hub:latest` (pública — sem registry no Portainer)

---

## 1️⃣ Stack (primeira vez)

### Portainer

1. **Stacks → Add stack**
2. Name: `bizu-hub`
3. Cole o YAML de `deploy/portainer-stack.yml`
4. **Environment variables:**

```env
DOCKER_IMAGE=registry.gitlab.com/brunopelatieri/bizu-hub
DOCKER_TAG=latest
POSTGRES_USER=bizu_hub
POSTGRES_PASSWORD=senha_forte_aqui
POSTGRES_DB=bizu_hub
```

5. **Deploy** (Swarm)

Imagem é pública — pull automático sem registry.

---

## 2️⃣ DNS

| Tipo | Nome | Valor |
|------|------|--------|
| A | `@` | 212.85.19.156 |
| A | `www` | 212.85.19.156 |

Aguarde propagação (Let's Encrypt precisa do DNS resolvido).

---

## 3️⃣ Migrations (Postgres novo)

### Portainer Console

1. **Containers** → `bizu-hub_postgres` → **Console**
2. `psql -U bizu_hub -d bizu_hub`
3. Cole o SQL de `drizzle/0000_cloudy_miracleman.sql`
4. `\q`

### Ou via SSH

```bash
curl -fsSL https://raw.githubusercontent.com/brunopelatieri/bizu-hub/main/drizzle/0000_cloudy_miracleman.sql | \
  docker exec -i $(docker ps -q -f name=bizu-hub_postgres) \
  psql -U bizu_hub -d bizu_hub
```

---

## 4️⃣ Supabase Auth

Dashboard Supabase → **Authentication → URL Configuration**:

```
Site URL: https://brunogoulart.com.br
Redirect: https://brunogoulart.com.br/auth/callback
```

---

## 5️⃣ Atualizar versão

Ver **`deploy/PORTAINER-ATUALIZAR.md`**

---

## Checklist

- [ ] Stack deployed (1/1)
- [ ] DNS `@` e `www` → 212.85.19.156
- [ ] Migrations aplicadas
- [ ] Certificado Let's Encrypt ativo
- [ ] `https://brunogoulart.com.br/api/health` → `{"ok":true}`
