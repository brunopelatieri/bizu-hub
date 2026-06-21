import { config } from "dotenv";
import { createHonoServer } from "react-router-hono-server/node";
import { api } from "@/api/app";

// Em desenvolvimento, carrega variáveis do .env.local (DATABASE_URL etc.).
// Em produção (Docker/VPS) as variáveis são injetadas pelo container.
if (process.env.NODE_ENV !== "production") {
  config({ path: ".env.local" });
  config();
}

export default await createHonoServer({
  configure(server) {
    // Rotas de negócio (/api/*) são resolvidas antes do handler SSR do RR7.
    server.route("/", api);
  },
});
