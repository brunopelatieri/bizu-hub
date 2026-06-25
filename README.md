# Bizu Hub Bruno Goulart

**Bizu Hub Bruno Goulart** é o projeto pessoal de Bruno Pelatieri Goulart — uma

plataforma unificada com **site pessoal**, **blog** e **hub de clientes** para
acompanhamento de projetos e entregas.

**Produção:** [https://brunogoulart.com.br](https://brunogoulart.com.br)

**Repositório:** [gitlab.com/brunopelatieri/bizu-hub](https://gitlab.com/brunopelatieri/bizu-hub)

Deploy em **VPS Ubuntu + Docker + Portainer** com imagem no **GitLab Container Registry**.


## O Que Vem Pronto

- Landing page responsiva, blog com SSR, páginas públicas e meta tags.
- Login com Supabase Auth e hub de clientes client-side.
- API Hono no mesmo processo Node do SSR.
- Postgres próprio via Drizzle ORM.
- Base visual com shadcn/ui, Tailwind v4, tema claro/escuro.
- Dockerfile multi-stage + stack Portainer pronta.
- Scripts `npm run docker:build` e `npm run docker:push` para GitLab Registry.


## Resumo Técnico 80/20

```text

React Router v7 Framework Mode + SSR global

  |

  |-- /api/*              Hono API -> Drizzle -> Postgres

  |-- /, /sobre, /blog    rotas públicas com SSR e SEO

  |-- /login              Supabase Auth

  `-- /dashboard/**       hub de clientes (client-side)

```


## Como Clonar e Rodar (dev)

```bash

git clone https://gitlab.com/brunopelatieri/bizu-hub.git
cd bizu-hub
npm install
cp .env.example .env.local
docker compose up -d
npm run db:migrate
npm run db:seed
npm run dev

```

App em desenvolvimento: `http://localhost:5173`

## Deploy em Produção (VPS)

Guia completo em **[deploy/README.md](deploy/README.md)**.

Resumo:

```bash
cp deploy/.env.docker.example deploy/.env.docker
# Edite VITE_SUPABASE_*

docker login registry.gitlab.com   # só para push (write_registry)
npm run docker:push
```

No Portainer, use `deploy/portainer-stack.yml` (Traefik) ou
`deploy/portainer-stack.npm.yml` (Nginx Proxy Manager).
A imagem no GitLab Registry é **pública para pull** — a VPS não precisa de
registry cadastrado nem `docker login`.
**CI/CD:** push na branch `main` dispara build + push via `.gitlab-ci.yml`.
Configure `VITE_SUPABASE_URL` e `VITE_SUPABASE_PUBLISHABLE_KEY` em
GitLab → Settings → CI/CD → Variables.


## Variáveis Principais

| Variável | Onde | Uso |
|----------|------|-----|
| `DATABASE_URL` | runtime | Postgres (Drizzle) |
| `DIRECT_URL` | migrations | Drizzle Kit |
| `PORT` | runtime | Servidor Node (padrão 3000) |
| `VITE_SUPABASE_URL` | **docker build** | Auth Supabase no client |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | **docker build** | Auth Supabase no client |
| `DOCKER_IMAGE` | build/push | `registry.gitlab.com/brunopelatieri/bizu-hub` |


## Scripts Úteis

```bash

npm run dev          # dev server: React Router + Hono
npm run build        # build de produção
npm run start        # roda build/server/index.js
npm run typecheck    # typegen + TypeScript
npm run db:migrate   # aplica migrations
npm run docker:build # build imagem Docker
npm run docker:push  # build + push GitLab Registry

```

## Documentação

- `deploy/README.md` — build, push, Portainer, DNS, Supabase Auth, migrations SQL (Portainer Console).
- `AI_CONTEXT.md` — visão rápida para agentes de IA.
- `PROJECT_TECHNICAL_SPEC.md` — arquitetura, rotas, deploy e decisões.


## Autor

**Bruno Pelatieri Goulart**  
Enterprise Automation Architect • AI • DevOps • n8n Specialist

