# Portainer — Bizu Hub (padrão VPS bru.ia.br)

Stack alinhada ao seu Portainer: **Swarm**, rede **`bru`**, Traefik **`letsencryptresolver`**.

**Domínio:** `brunogoulart.com.br` → **212.85.19.156**

---

## Checklist rápido

- [ ] Pipeline GitLab verde → imagem `registry.gitlab.com/brunopelatieri/bizu-hub:latest`
- [ ] Registry GitLab no Portainer (**Registries**)
- [ ] DNS `A` `@` e `www` → `212.85.19.156`
- [ ] Stack **`deploy/portainer-stack.yml`** deployada
- [ ] Migrations Drizzle aplicadas
- [ ] Supabase URLs com `https://brunogoulart.com.br`

---

## 1. GitLab CI

**Settings → CI/CD → Variables:**

| Key | Valor |
|-----|--------|
| `VITE_SUPABASE_URL` | `https://kpersdlqtrxlytwbuvvv.supabase.co` |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | publishable key |

Push na **main** → pipeline **build-image** OK.

---

## 2. Registry no Portainer

**Registries → Add registry**

| Campo | Valor |
|-------|--------|
| Name | `gitlab-bizu-hub` |
| URL | `registry.gitlab.com` |
| User / Password | deploy token (`read_registry`) |

---

## 3. Stack produção (Traefik + bru)

Arquivo: **`deploy/portainer-stack.yml`**

### Portainer

1. **Stacks → Add stack** (ou Update)
2. Name: `bizu-hub`
3. Cole o YAML de `portainer-stack.yml`
4. **Environment variables:**

```env
DOCKER_IMAGE=registry.gitlab.com/brunopelatieri/bizu-hub
DOCKER_TAG=latest
POSTGRES_USER=bizu_hub
POSTGRES_PASSWORD=SENHA_FORTE_AQUI
POSTGRES_DB=bizu_hub
```

5. **Deploy the stack** (Swarm)

### Labels Traefik (já no YAML)

| Item | Valor |
|------|--------|
| Host | `brunogoulart.com.br` |
| www | redirect → apex |
| Rede | `bru` |
| Porta app | `3000` |
| TLS | `letsencryptresolver` |

Igual aos seus serviços `bmcp.bru.ia.br` e `minio.bru.ia.br`.

---

## 4. DNS

No registrador de `brunogoulart.com.br`:

| Tipo | Nome | Valor |
|------|------|--------|
| A | `@` | `212.85.19.156` |
| A | `www` | `212.85.19.156` |

Aguarde propagação (minutos a algumas horas). O Let's Encrypt só emite certificado quando o DNS resolver.

Teste:

```bash
curl -I https://brunogoulart.com.br/api/health
```

---

## 5. Migrations (primeira vez)

Com a stack no ar, na VPS ou via SSH:

```bash
git clone https://gitlab.com/brunopelatieri/bizu-hub.git
cd bizu-hub
npm ci
```

Descubra o IP do Postgres na rede `bru` (Portainer → container **postgres** → Network):

```bash
DATABASE_URL="postgresql://bizu_hub:SENHA@IP_POSTGRES:5432/bizu_hub" \
DIRECT_URL="postgresql://bizu_hub:SENHA@IP_POSTGRES:5432/bizu_hub" \
npm run db:migrate
```

Volume Postgres: **`bizu_hub_postgres_data`** (persiste entre redeploys).

---

## 6. Supabase Auth

**Authentication → URL Configuration:**

| Campo | Valor |
|-------|--------|
| Site URL | `https://brunogoulart.com.br` |
| Redirect URLs | `https://brunogoulart.com.br/auth/callback`, `https://brunogoulart.com.br/**` |

---

## 7. Bootstrap (opcional, sem DNS)

Se quiser testar **antes** do DNS, use **`portainer-stack.bootstrap.yml`**:

- Publica porta **3000** no host
- Mesma rede `bru` e volume Postgres
- **Não** use as duas stacks ao mesmo tempo (mesmo volume/nome de serviço)

Teste: `http://212.85.19.156:3000/api/health`

Quando o DNS estiver OK, remova bootstrap e suba **`portainer-stack.yml`**.

---

## 8. Atualizar versão

1. Push na **main** → GitLab builda `latest`
2. Portainer → stack **bizu-hub** → **Update the stack** / **Pull and redeploy**

---

## Problemas comuns

| Sintoma | Ação |
|---------|------|
| Certificate error | DNS ainda não apontou para 212.85.19.156 |
| 404 Traefik | App não na rede `bru` ou labels erradas |
| Pull failed | Registry GitLab no Portainer |
| 502 | Container app unhealthy — ver logs postgres/app |
| Contato falha | Rodar migrations |
