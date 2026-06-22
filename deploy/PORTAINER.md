# Portainer — Bizu Hub (padrão VPS bru.ia.br)

Stack alinhada ao seu Portainer: **Swarm**, rede **`bru`**, Traefik **`letsencryptresolver`**.

**Domínio:** `brunogoulart.com.br` → **212.85.19.156**  
**Imagem (pública):** `registry.gitlab.com/brunopelatieri/bizu-hub:latest`

**Atualizar versão (sem SSH):** **`deploy/PORTAINER-ATUALIZAR.md`**

> O Container Registry do GitLab está **público para pull**. Não cadastre registry no Portainer nem faça `docker login` na VPS.

---

## Checklist rápido

- [ ] Imagem `registry.gitlab.com/brunopelatieri/bizu-hub:latest` acessível (`docker pull` sem login)
- [ ] Rede Docker **`bru`** existente + Traefik com `letsencryptresolver`
- [ ] DNS `A` `@` e `www` → `212.85.19.156`
- [ ] Stack **`deploy/portainer-stack.yml`** deployada
- [ ] Migrations Drizzle aplicadas (Postgres novo = obrigatório)
- [ ] Supabase URLs com `https://brunogoulart.com.br`

---

## 1. GitLab CI (opcional — build automático)

**Settings → CI/CD → Variables:**

| Key | Valor |
|-----|--------|
| `VITE_SUPABASE_URL` | `https://kpersdlqtrxlytwbuvvv.supabase.co` |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | publishable key |

Push na **main** → pipeline **build-image** OK → tag **`latest`** no Container Registry.

Build manual no PC: ver **`deploy/README.md`** (seção build/push — `docker login` só no dev).

---

## 2. Stack produção (Traefik + bru)

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

5. **Deploy the stack** (Swarm) — pull da imagem é **automático e anônimo**

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

## 3. DNS

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

## 4. Migrations (primeira vez ou VPS nova)

O deploy usa só a **imagem Docker** — não precisa do repositório na VPS.

Arquivo atual: `drizzle/0000_cloudy_miracleman.sql` (tabela `contact_messages`).

### Método recomendado — Portainer Console (sem SSH)

1. **Containers** → `bizu-hub_postgres` → **Console**
2. Comando: `psql -U bizu_hub -d bizu_hub`
3. Cole o SQL do arquivo em `drizzle/` (copie do repo local ou do GitHub)
4. Enter — resposta esperada: `CREATE TABLE`
5. Saia com `\q`

Se aparecer `relation "contact_messages" already exists`, a migration já foi aplicada.

Validar:

```sql
\d contact_messages
```

### Alternativa — SSH

```bash
curl -fsSL https://raw.githubusercontent.com/brunopelatieri/bizu-hub/main/drizzle/0000_cloudy_miracleman.sql | \
  docker exec -i $(docker ps -q -f name=bizu-hub_postgres) \
  psql -U bizu_hub -d bizu_hub
```

### Alternativa — Drizzle Kit no PC (Postgres exposto ou túnel)

```bash
DATABASE_URL="postgresql://bizu_hub:SENHA@IP_POSTGRES:5432/bizu_hub" \
DIRECT_URL="postgresql://bizu_hub:SENHA@IP_POSTGRES:5432/bizu_hub" \
npm run db:migrate
```

Volume Postgres: **`bizu_hub_postgres_data`** (persiste entre redeploys).

---

## 5. Supabase Auth

**Authentication → URL Configuration:**

| Campo | Valor |
|-------|--------|
| Site URL | `https://brunogoulart.com.br` |
| Redirect URLs | `https://brunogoulart.com.br/auth/callback`, `https://brunogoulart.com.br/**` |

---

## 6. Bootstrap (opcional, sem DNS)

Se quiser testar **antes** do DNS, use **`portainer-stack.bootstrap.yml`**:

- Publica porta **3000** no host
- Mesma rede `bru` e volume Postgres
- **Não** use as duas stacks ao mesmo tempo (mesmo volume/nome de serviço)

Teste: `http://212.85.19.156:3000/api/health`

Quando o DNS estiver OK, remova bootstrap e suba **`portainer-stack.yml`**.

---

## 7. Atualizar versão

1. Push na **main** (GitLab CI) **ou** `npm run docker:push` no PC
2. Portainer → stack **bizu-hub** → **Update the stack** → **Re-pull image**

Detalhes: **`deploy/PORTAINER-ATUALIZAR.md`**

---

## Problemas comuns

| Sintoma | Ação |
|---------|------|
| Certificate error | DNS ainda não apontou para 212.85.19.156 |
| 404 Traefik | App não na rede `bru` ou labels erradas |
| Pull failed | Verifique URL da imagem; teste `docker pull` na VPS |
| 502 | Container app unhealthy — ver logs postgres/app |
| Contato falha | Rodar migrations |
| Push falha no PC | `docker login registry.gitlab.com` (token com `write_registry`) |
