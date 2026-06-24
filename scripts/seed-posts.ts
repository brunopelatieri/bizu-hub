import { config } from "dotenv";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "../src/db/schema";

config({ path: ".env.local" });

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL is not set");

const client = postgres(connectionString, { max: 1 });
const db = drizzle(client, { schema });

const seedPosts: schema.NewPost[] = [
  {
    slug: "reduzir-mensagens-de-status",
    title: "Como reduzir 80% das mensagens de status dos seus clientes",
    excerpt:
      "Comunicação proativa não é um diferencial — é uma necessidade. Veja como um portal centralizado muda a dinâmica dos seus projetos.",
    tag: "Produtividade",
    date: "12 Jun 2026",
    publishedAt: "2026-06-12T00:00:00+00:00",
    cover: "/bizu_bru_ia_blog1.webp",
    content:
      'A pergunta mais repetida de qualquer freelancer é: "qual o status do meu projeto?". ' +
      "Quando você centraliza o progresso em um portal, o cliente encontra a resposta sozinho — " +
      "e você recupera horas da sua semana. Neste artigo mostramos como estruturar atualizações " +
      "curtas e frequentes que constroem confiança ao longo do projeto.",
    status: "published",
  },
  {
    slug: "precificacao-para-freelancers-2026",
    title: "Precificação para freelancers: o guia definitivo de 2026",
    excerpt:
      "Saber cobrar pelo valor real do seu trabalho começa por entender sua proposta de valor. Veja como estruturar seus planos.",
    tag: "Negócios",
    date: "3 Jun 2026",
    publishedAt: "2026-06-03T00:00:00+00:00",
    cover: "/bizu_bru_ia_blog2.webp",
    content:
      "Precificar por hora penaliza quem é eficiente. Precificar por valor exige clareza sobre o " +
      "resultado que você entrega. Aqui detalhamos um modelo de pacotes em três níveis que " +
      "aumenta seu ticket médio sem afastar clientes sensíveis a preço.",
    status: "published",
  },
  {
    slug: "stack-ideal-portais-de-clientes",
    title: "Stack ideal para portais de clientes em 2026",
    excerpt:
      "React, shadcn/ui, Supabase e Drizzle — como essa combinação entrega uma experiência premium sem complexidade desnecessária.",
    tag: "Ferramentas",
    date: "28 Mai 2026",
    publishedAt: "2026-05-28T00:00:00+00:00",
    cover: "/bizu_bru_ia_blog3.webp",
    content:
      "Uma boa stack é aquela que some do seu caminho. React Router em Framework Mode entrega SSR " +
      "para SEO, Hono cuida da API, Drizzle tipa o banco de ponta a ponta e o Supabase resolve " +
      "auth e storage. Mostramos como cada peça se encaixa em um portal de clientes real.",
    status: "published",
  },
];

async function seed() {
  console.log("Seeding posts...");
  await db
    .insert(schema.posts)
    .values(seedPosts)
    .onConflictDoNothing({ target: schema.posts.slug });
  console.log("Done. 3 posts seeded (idempotent).");
  await client.end();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
