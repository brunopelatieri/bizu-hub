# Contracts — Spec 002

Esta feature **não adiciona rotas Hono**. O contrato é entre a camada server
(`src/lib/content/*.server.ts`) e os loaders React Router.

| Arquivo | Descrição |
|---------|-----------|
| `loader-shapes.ts` | Tipos TypeScript de referência para loaders e componentes |

Validação:
- `npm run typecheck` — tipos alinhados entre server e routes
- Checklist manual em `../quickstart.md`
