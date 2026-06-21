import type { Config } from "@react-router/dev/config";

export default {
  // Pasta raiz da app (mantém tudo em src/ como já era no projeto)
  appDirectory: "src",
  // SSR em runtime habilitado globalmente.
  // O RR7 não possui flag de SSR por rota: o controle "SPA na área logada"
  // é feito mantendo as rotas /dashboard SEM loader de servidor — elas
  // apenas entregam o shell e buscam dados no cliente (ver MIGRATION_NOTES.md).
  ssr: true,
  // Opt-in v8 — silencia avisos de depreciação e prepara migração para RR v8
  // v8_viteEnvironmentApi desligado: quebra o build prod do react-router-hono-server
  // (node build/server/index.js sai sem chamar serve() — container encerra com exit 0)
  future: {
    v8_middleware: true,
    v8_splitRouteModules: true,
    v8_passThroughRequests: true,
    v8_trailingSlashAwareDataRequests: true,
  },
} satisfies Config;
