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

- `deploy/README.md` — build, push, Portainer, DNS, Supabase Auth, migrations.
- `.context/onboarding/AI_CONTEXT.md` — visão rápida para agentes de IA.
- `.context/spec/TECHNICAL_SPEC_COMPACT.md` — arquitetura, rotas, deploy e regras em ~200 linhas.


---

## ⚠️ Governança de Contexto (AI Software Engineering)

Este projeto adota a metodologia de **AI Software Engineering**: toda documentação
relevante para desenvolvimento — especialmente a produzida com ou para LLMs e
agentes de IA — segue regras explícitas de localização. Isso garante que qualquer
agente (ou humano) que abra o repo encontre o contexto certo, no lugar certo,
sem ambiguidade.

### Estrutura de pastas de contexto

Duas pastas coexistem com propósitos distintos:

#### `.context/` — documentação manual de contexto vivo

Criada e mantida por humanos (ou agentes, sob instrução). Organizada por natureza
do documento:

```
.context/
  onboarding/   Ponto de entrada para LLMs — AI_CONTEXT.md, status e regras de atualização
  spec/         Especificações técnicas: compact (leitura rápida), legada, arquivo histórico
  adr/          Architecture Decision Records — decisões com contexto, alternativas e consequências
  pdr/          Product Decision Records — decisões de produto, escopo e priorização
  docs/         Infra, integrações e ferramentas — GTM, Postgres externo, guias de setup
  rules/        Regras e convenções além das .cursor/rules/ (específicas deste projeto)
  workflows/    Runbooks, processos recorrentes, guias operacionais passo-a-passo
```

**O que vai em `.context/`:**
- Qualquer `.md` de documentação técnica criado durante o desenvolvimento
- Guias de setup de ferramentas (ex: `GTM_SETUP.md`, `GTM_CHECKLIST.md`)
- Documentação de infraestrutura (ex: `INFRA_POSTGRES_EXTERNAL_ACCESS.md`)
- Notas de decisão arquitetural ou de produto
- Specs criadas manualmente

**O que NÃO vai em `.context/`:**
- Output automatizado de tools (ver `specs/` abaixo)
- Configs de ferramentas (`.cursor/`, `.specify/`, `.claude/`)
- Código-fonte (`src/`, `scripts/`, `drizzle/`)

#### `specs/` — output automatizado do SpecifyX

Gerada e mantida pelo ciclo de **SpecifyX** (`.specify/`). Cada subpasta é uma
feature spec numerada, produzida pelos comandos `/specify → /plan → /tasks → /implement`.

```
specs/
  001-blog-dinamico-com/   spec.md + tasks.md (feature já implementada)
  002-proxima-feature/     ...
```

> Esta pasta é output de tool — não edite manualmente a menos que esteja
> participando ativamente do ciclo SpecifyX para aquela feature.

### Raiz do projeto

Na raiz ficam **apenas** arquivos que ferramentas e convenções do ecossistema
exigem nesse local:

| Arquivo | Por quê fica na raiz |
|---------|----------------------|
| `CLAUDE.md` | Exigido pelo Claude Code para carregar contexto do projeto |
| `README.md` | Convenção universal de onboarding — GitHub/GitLab renderiza na homepage |
| `CHANGELOG.md` | Convenção de changelog — ferramentas e humanos esperam na raiz |
| `package.json`, `Dockerfile`, `.gitignore`, etc. | Configs de tooling — exigidos na raiz |

### Regra de decisão rápida

> "Onde devo criar este arquivo de documentação?"

1. É um **`.md` de documentação** produzido durante desenvolvimento? → `.context/<subpasta>`
2. É uma **spec de feature** gerada pelo ciclo SpecifyX? → `specs/` (automático)
3. É um **arquivo de config** de alguma ferramenta? → pasta da própria ferramenta (`.cursor/`, `.specify/`, `deploy/`, etc.)
4. É `CLAUDE.md`, `README.md` ou `CHANGELOG.md`? → raiz

### Quando atualizar contexto

Toda vez que o projeto mudar de forma relevante (arquitetura, stack, deploy,
banco, auth, dashboard, billing), atualize na mesma sessão:

- `.context/onboarding/AI_CONTEXT.md` — resumo operacional
- `.context/spec/TECHNICAL_SPEC_COMPACT.md` — detalhes técnicos
- `README.md` se afetar onboarding ou a governança aqui descrita
- `.cursor/rules/*.mdc` se a mudança precisar orientar agentes futuros

---

## Autor

**Bruno Pelatieri Goulart**  
Enterprise Automation Architect • AI • DevOps • n8n Specialist

