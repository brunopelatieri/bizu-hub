# Atualizar Bizu Hub — Portainer

**Imagem pública** — pull automático na VPS, **sem** registry ou SSH.

---

## Opção A — GitLab CI (automático)

1. Push na `main`
2. **GitLab → Pipelines** → job `build-image` ✅
3. Portainer → **Stacks** → `bizu-hub` → **Update** → **Re-pull image** → **Update**
4. Aguarde 1-2 min

---

## Opção B — Build no PC (manual)

1. **Build + Push** (PC):
   ```bash
   npm run docker:push
   ```

2. **Atualizar** (Portainer):
   - **Stacks** → `bizu-hub` → **Update** → **Re-pull image** → **Update**

3. **Conferir**:
   ```bash
   curl https://brunogoulart.com.br/api/health
   # Esperado: {"ok":true}
   ```

---

## Migrations (Banco)

Não precisa rebuild. Uma vez por migration nova:

### Portainer Console

1. **Containers** → `bizu-hub_postgres` → **Console**
2. `psql -U bizu_hub -d bizu_hub`
3. Cole SQL de `drizzle/*.sql`
4. `\q`

### Ou SSH

```bash
curl -fsSL https://raw.githubusercontent.com/brunopelatieri/bizu-hub/main/drizzle/0000_cloudy_miracleman.sql | \
  docker exec -i $(docker ps -q -f name=bizu-hub_postgres) \
  psql -U bizu_hub -d bizu_hub
```

---

## Quando NÃO precisa rebuild

| Mudança | Rebuild? |
|---------|----------|
| Senha, env vars | ❌ |
| Labels, domínio | ❌ |
| Código, CSS, JS | ✅ |
| `VITE_*` (Supabase) | ✅ |
| SQL no Postgres | ❌ |

---

## Checklist

- [ ] Código pushed (PC ou GitLab)
- [ ] Portainer → Re-pull image
- [ ] Service status = 1/1
- [ ] `/api/health` → `{"ok":true}`
