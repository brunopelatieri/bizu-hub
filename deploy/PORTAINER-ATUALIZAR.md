# Tutorial — Atualizar o Bizu Hub pelo Portainer

Guia prático para **publicar nova versão** sem SSH na VPS (só Portainer + build no PC ou GitLab CI).

**Stack:** `bizu-hub`  
**Imagem (pública):** `registry.gitlab.com/brunopelatieri/bizu-hub:latest`

> A imagem no GitLab Container Registry é **pública**. A VPS faz `pull` **sem** registry cadastrado no Portainer e **sem** `docker login`.

---

## O que o Portainer faz (e o que não faz)

| Etapa | Onde | Portainer? |
|-------|------|------------|
| **Build** da imagem (compilar app) | PC ou GitLab CI | ❌ Não |
| **Push** para o registry | PC ou GitLab CI | ❌ Não |
| **Pull** da imagem na VPS | Portainer (anônimo) | ✅ Sim |
| **Redeploy** do serviço `app` | Portainer | ✅ Sim |
| **Mudar env / YAML** da stack | Portainer | ✅ Sim |

O Portainer **substitui** os comandos `docker pull` e `docker service update` na VPS.  
O **build + push** continuam no seu PC (`npm run docker:push`) ou no **GitLab CI** — só quem **publica** precisa de `docker login`.

---

## Setup único (primeira vez na VPS)

### 1. Registry no Portainer — **não precisa**

Com a imagem pública, **pule** Registries → Add registry. O Swarm puxa direto:

```text
registry.gitlab.com/brunopelatieri/bizu-hub:latest
```

Teste opcional na VPS (SSH):

```bash
docker pull registry.gitlab.com/brunopelatieri/bizu-hub:latest
```

### 2. Variáveis da stack (não mudam a cada deploy)

```env
DOCKER_IMAGE=registry.gitlab.com/brunopelatieri/bizu-hub
DOCKER_TAG=latest
POSTGRES_USER=bizu_hub
POSTGRES_PASSWORD=sua-senha
POSTGRES_DB=bizu_hub
```

**Importante:** `DATABASE_URL` usa `@bizu-hub_postgres` (não `@postgres`) — ver `portainer-stack.yml`.

---

## Fluxo A — GitLab CI + Portainer

Ideal quando o código está no **GitLab** e o CI builda sozinho.

### Passo 1 — Gerar imagem (GitLab)

1. Commit + push na branch **`main`** do GitLab
2. **GitLab → CI/CD → Pipelines** → job **`build-image`** verde ✅
3. Confirme em **Deploy → Container Registry** a tag **`latest`** com data recente

Variáveis CI necessárias (Settings → CI/CD → Variables):

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`

### Passo 2 — Atualizar na VPS (Portainer)

1. Abra **Portainer**
2. Menu **Stacks**
3. Clique na stack **`bizu-hub`**
4. Botão **Editor** (ou **Update the stack**)
5. **Não precisa mudar o YAML** se só atualizou a imagem
6. Marque **Re-pull image** / **Pull latest image** (texto varia por versão)
7. Clique **Update the stack**
8. Aguarde 1–2 min

### Passo 3 — Conferir

1. **Services** (ou na própria stack) → serviço **`bizu-hub_app`**
2. Status **1/1**
3. Browser: `https://brunogoulart.com.br/api/health` → `{"ok":true}`

---

## Fluxo B — Build no PC + Portainer

Código no **GitHub** ou quando quer publicar manualmente.

### Passo 1 — Build e push (no seu PC)

Só o **push** exige login no registry (imagem privada para escrita; pull na VPS é público):

```bash
# uma vez
cp deploy/.env.docker.example deploy/.env.docker
# edite VITE_SUPABASE_* em deploy/.env.docker

docker login registry.gitlab.com   # só para publicar (write_registry)
npm run docker:push
```

Espere terminar com `latest: digest: sha256:...`.

### Passo 2 — Atualizar no Portainer

Mesmos passos do **Fluxo A, Passo 2**:

**Stacks → bizu-hub → Update the stack → Re-pull image → Update**

### Passo 3 — Conferir

Igual Fluxo A, Passo 3.

---

## Atualizar só pelo serviço (alternativa rápida)

Sem abrir o editor da stack inteira:

1. **Portainer → Services**
2. Clique em **`bizu-hub_app`**
3. **Update** (ou ícone de atualização)
4. Campo **Image:** confirme  
   `registry.gitlab.com/brunopelatieri/bizu-hub:latest`
5. Marque **Pull latest image**
6. **Update the service**

O Postgres **não** precisa ser atualizado nesse fluxo.

---

## Quando NÃO precisa rebuild da imagem

Só **Update the stack** no Portainer, editando YAML ou env:

| Mudança | Rebuild imagem? |
|---------|-----------------|
| Senha Postgres, env vars | ❌ |
| Labels Traefik, domínio | ❌ |
| Texto/CSS/JS do site | ✅ |
| Supabase `VITE_*` | ✅ |
| Fix de bug no código | ✅ |
| Migrations SQL no Postgres | ❌ (Portainer Console ou `docker exec` psql) |

---

## Checklist — cada release de código

```
[ ] 1. Código commitado
[ ] 2. npm run docker:push  (PC)  OU  pipeline GitLab verde
[ ] 3. Portainer → bizu-hub → Update → Re-pull image
[ ] 4. bizu-hub_app = 1/1
[ ] 5. Teste site + login + /contato
```

Tempo habitual: **2–5 min** depois do push.

---

## Migrations (contato / Drizzle)

Não exige rebuild da imagem. **Uma vez** por migration nova (ou VPS nova com Postgres zerado).

Arquivos em `drizzle/` no repositório (ex.: `0000_cloudy_miracleman.sql`).

### Método recomendado — Portainer Console (sem SSH)

1. **Containers** → `bizu-hub_postgres` → **Console**
2. Comando: `psql -U bizu_hub -d bizu_hub`
3. Cole o SQL do arquivo em `drizzle/`
4. Enter
5. Saia com `\q`

`CREATE TABLE` = OK. `relation "contact_messages" already exists` = já aplicada.

### Alternativa — SSH

```bash
curl -fsSL https://raw.githubusercontent.com/brunopelatieri/bizu-hub/main/drizzle/0000_cloudy_miracleman.sql | \
  docker exec -i $(docker ps -q -f name=bizu-hub_postgres) \
  psql -U bizu_hub -d bizu_hub
```

---

## Problemas comuns

| Sintoma | Solução |
|---------|---------|
| App **0/1** após update | **Services → bizu-hub_app → Tasks** → ler erro |
| `No such image` | Confirme URL da imagem; teste `docker pull` na VPS |
| Site antigo após update | Faltou marcar **Re-pull image** |
| Contato 500 | Tabela + `DATABASE_URL` com `@bizu-hub_postgres` |
| Login quebrado | Rebuild com `VITE_*` em `deploy/.env.docker` |
| Push falha no PC | `docker login registry.gitlab.com` com token `write_registry` |

---

## Resumo em uma frase

**Build/push no PC (ou GitLab CI) → Portainer → Stacks → bizu-hub → Update → Re-pull image → Update the stack.**

Não precisa SSH, registry no Portainer nem `docker login` na VPS para atualizar.

---

Ver também: **`deploy/PORTAINER.md`** (deploy inicial) · **`deploy/README.md`** (visão geral)
