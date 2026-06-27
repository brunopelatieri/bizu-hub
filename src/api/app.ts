import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { getDb } from "@/db";
import { contactMessages } from "@/db/schema";
import { searchPublishedPosts } from "@/lib/content/search.server";
import { blogSearchQuerySchema } from "@/lib/schemas/blog-search";
import { contactMessageSchema } from "@/lib/schemas/contact";

/**
 * App Hono com toda a lógica de negócio da API (/api/*).
 * É montado dentro do servidor SSR do React Router em src/server.ts,
 * rodando no mesmo processo Node — por isso não há mais necessidade de CORS
 * (front e API compartilham a mesma origem).
 */
export const api = new Hono();

api.get("/api/health", (c) => c.json({ ok: true }));

api.get(
  "/api/blog/search",
  zValidator("query", blogSearchQuerySchema, (result, c) => {
    if (!result.success) {
      return c.json(
        {
          error:
            result.error.issues[0]?.message ?? "Parâmetros de busca inválidos.",
        },
        400,
      );
    }
  }),
  async (c) => {
    const { q, category } = c.req.valid("query");

    try {
      const posts = await searchPublishedPosts(q, category);
      return c.json({ posts });
    } catch {
      return c.json({ error: "Falha na busca." }, 500);
    }
  },
);

api.post(
  "/api/contact",
  zValidator("json", contactMessageSchema, (result, c) => {
    if (!result.success) {
      return c.json(
        {
          error:
            result.error.issues[0]?.message ?? "Preencha todos os campos.",
        },
        400,
      );
    }
  }),
  async (c) => {
    const body = c.req.valid("json");

    try {
      await getDb().insert(contactMessages).values(body);
    } catch {
      return c.json(
        {
          error:
            "Falha ao salvar. Verifique DATABASE_URL e as migrations do Drizzle.",
        },
        500,
      );
    }

    return c.json({ ok: true });
  },
);
