import { pathToFileURL } from "url";
import { config } from "dotenv";
import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { eq } from "drizzle-orm";
import postgres from "postgres";
import { linkPostToCategories } from "./lib/link-post-categories";
import * as schema from "../src/db/schema";

config({ path: ".env.local" });

const TEST_POST_SLUG = "bruno-pelatieri-goulart-documento-teste-markdown";

const testPost: schema.NewPost = {
  slug: TEST_POST_SLUG,
  title: "Bruno Pelatieri Goulart — Documento de Teste Markdown",
  excerpt:
    "Full Stack Developer & AI Automation Specialist — 18+ anos de experiência, desde 2006.",
  date: "25 Jun 2026",
  publishedAt: "2026-06-25T00:00:00+00:00",
  cover:
    "https://kpersdlqtrxlytwbuvvv.supabase.co/storage/v1/object/public/bruno-pelatieri-goulart-bh/blog/media/img/bruno_pelatieri_goulart_seed_capa.webp",
  status: "published",
  content: `# Bruno Pelatieri Goulart — Documento de Teste Markdown

*Full Stack Developer & AI Automation Specialist — 18+ anos de experiência, desde 2006.*

> "Unindo 18 anos de engenharia com a inteligência do futuro — construindo hoje o que o mercado precisará amanhã."

---

## 🔗 Links Pessoais

| Plataforma | Link |
|---|---|
| Site pessoal | [brunogoulart.com.br](https://brunogoulart.com.br/) |
| Bio / Linktree | [bru.ia.br](https://bru.ia.br/) |
| GitHub | [github.com/brunopelatieri](https://github.com/brunopelatieri) |
| GitLab | [gitlab.com/brunopelatieri](https://gitlab.com/brunopelatieri) |
| Docker Hub | [hub.docker.com/u/brunopelatieri](https://hub.docker.com/u/brunopelatieri) |
| LinkedIn | [linkedin.com/in/bruno-pelatieri-goulart](https://www.linkedin.com/in/bruno-pelatieri-goulart/) |
| YouTube | [@brunopelatieri](https://www.youtube.com/@brunopelatieri) |
| TikTok | [@brunopelatieri](https://www.tiktok.com/@brunopelatieri) |
| X (Twitter) | [@brunopelatieri](https://x.com/brunopelatieri) |
| Instagram | [@brunopelatieri](https://www.instagram.com/brunopelatieri/) |
| Facebook | [bruno.pelatierigoulart](https://www.facebook.com/bruno.pelatierigoulart) |
| WhatsApp | [+55 (19) 9 9249-6598](https://wa.me/5519992496598) |
| E-mail | [brunopelatieri@gmail.com](mailto:brunopelatieri@gmail.com) |

> Discord ainda não tem link público de perfil, apenas ID: \`1248366465929711648\`

---

## 🧠 Trajetória

Programador desde **2006**, Bruno começou sua carreira com ~~PHP clássico (CodeIgniter, Zend Framework)~~ e, ao longo de quase duas décadas, migrou para uma stack muito mais ampla. Hoje atua na linha de frente de **AI Agents**, *automação inteligente* e arquiteturas orientadas a LLMs — sem nunca abandonar a base sólida de engenharia de software que construiu desde o início.

Atualmente presta serviço autônomo na **Phyonext**, com foco em dois verticais:

1. Crédito & financeiro — qualificação e conversão de leads via WhatsApp
2. Saúde & clínicas — recepção virtual, agendamento e reativação de pacientes

Paralelamente, desenvolve o **Gestão Inteligente**, um SaaS próprio para o setor de restaurantes, atualmente em fase *beta*.

---

## ⚙️ Stack Técnica

### Backend & Frontend

- \`Node.js\` · \`Express.js\` · \`Python\` · \`PHP\` · \`Laravel\`
- \`React\` · \`Next.js\` · \`Tailwind CSS\` · \`HTML5\` / \`CSS3\`

### IA, Automação & Agentes

- \`Claude\` (Anthropic), \`GPT\` (OpenAI), \`Gemini\`, \`DeepSeek\`, \`Grok\`
- \`LangChain\` · \`LangGraph\` · \`LangSmith\`
- \`n8n\` · \`Kestra\` · \`MCP Protocol\`

### Banco de Dados & DevOps

- \`PostgreSQL\` · \`MySQL\` · \`MongoDB\` · \`Redis\` · \`Supabase\`
- \`Docker Swarm\` · \`Traefik\` · \`Portainer\`

Exemplo simplificado de um nó de configuração usado em fluxos **n8n** para seleção de modo de operação:

\`\`\`json
{
  "node": "CONFIG - Set Mode",
  "type": "n8n-nodes-base.set",
  "parameters": {
    "operationMode": "sync_contacts",
    "targetService": "chatwoot",
    "sheetSource": "google_sheets",
    "retryOnSchemaMismatch": true
  }
}
\`\`\`

---

## ⛓️ Projetos em Destaque

| Projeto | Categoria |
|---|---|
| MCP Server para n8n | Automação / Agentes |
| AI XML Tag Guide | Engenharia de Prompt |
| Setup Orion | DevOps / Infraestrutura |
| DApps & Smart Contracts | Web3 |
| Gestão Inteligente | SaaS — Food Service |

---

*Documento gerado apenas para fins de teste de renderização Markdown (\`react-markdown\` + \`remark-gfm\`). Não constitui currículo oficial.*`,
};

const testImages: Omit<schema.NewPostImage, "postId">[] = [
  {
    url: "https://kpersdlqtrxlytwbuvvv.supabase.co/storage/v1/object/public/bruno-pelatieri-goulart-bh/blog/media/img/bruno_pelatieri_goulart_seed1.webp",
    alt: "Bruno Pelatieri Goulart — Foto 1",
    position: 0,
  },
  {
    url: "https://kpersdlqtrxlytwbuvvv.supabase.co/storage/v1/object/public/bruno-pelatieri-goulart-bh/blog/media/img/bruno_pelatieri_goulart_seed2.webp",
    alt: "Bruno Pelatieri Goulart — Foto 2",
    position: 1,
  },
  {
    url: "https://kpersdlqtrxlytwbuvvv.supabase.co/storage/v1/object/public/bruno-pelatieri-goulart-bh/blog/media/img/bruno_pelatieri_goulart_seed3.webp",
    alt: "Bruno Pelatieri Goulart — Foto 3",
    position: 2,
  },
];

const testMedia: Omit<schema.NewPostMedia, "postId">[] = [
  {
    mediaType: "mp3",
    deliveryMode: "file",
    url: "https://kpersdlqtrxlytwbuvvv.supabase.co/storage/v1/object/public/bruno-pelatieri-goulart-bh/blog/media/brunogoulart_ramones_i_wanna_be_sedate.mp3",
    title: "Áudio: I Wanna Be Sedate (Ramones)",
    position: 0,
  },
  {
    mediaType: "mp4",
    deliveryMode: "file",
    url: "https://kpersdlqtrxlytwbuvvv.supabase.co/storage/v1/object/public/bruno-pelatieri-goulart-bh/blog/media/brunogoulart_univeso_responde.mp4",
    title: "Vídeo: Universo Responde",
    position: 1,
  },
  {
    mediaType: "mp4",
    deliveryMode: "embed",
    url: "https://www.youtube.com/embed/9flaCBkVqps",
    title: "YouTube: Embedded Video",
    position: 2,
  },
];

const testAttachments: Omit<schema.NewPostAttachment, "postId">[] = [
  {
    name: "brunogoulart.zip",
    description: "Pacote completo de projetos",
    url: "https://kpersdlqtrxlytwbuvvv.supabase.co/storage/v1/object/public/bruno-pelatieri-goulart-bh/blog/doc/brunogoulart.zip",
    position: 0,
  },
  {
    name: "brunogoulart_doc.docx",
    description: "Documento Word com detalhes",
    url: "https://kpersdlqtrxlytwbuvvv.supabase.co/storage/v1/object/public/bruno-pelatieri-goulart-bh/blog/doc/brunogoulart_doc.docx",
    position: 1,
  },
  {
    name: "brunogoulart_doc.pdf",
    description: "PDF com informações",
    url: "https://kpersdlqtrxlytwbuvvv.supabase.co/storage/v1/object/public/bruno-pelatieri-goulart-bh/blog/doc/brunogoulart_doc.pdf",
    position: 2,
  },
];

export async function seedTestPost(db: PostgresJsDatabase<typeof schema>) {
  console.log("🚀 Seeding test post...");
  console.time("seed-test-post");

  await db
    .insert(schema.posts)
    .values(testPost)
    .onConflictDoNothing({ target: schema.posts.slug });

  const [post] = await db
    .select()
    .from(schema.posts)
    .where(eq(schema.posts.slug, TEST_POST_SLUG));

  if (!post) throw new Error(`Post not found after insert: ${TEST_POST_SLUG}`);

  // Delete+reinsert for idempotency (always results in exactly 3 of each)
  await db.delete(schema.postImages).where(eq(schema.postImages.postId, post.id));
  await db
    .insert(schema.postImages)
    .values(testImages.map((img) => ({ ...img, postId: post.id })));
  console.log("📊 Seeded 3 images");

  await db.delete(schema.postMedia).where(eq(schema.postMedia.postId, post.id));
  await db
    .insert(schema.postMedia)
    .values(testMedia.map((m) => ({ ...m, postId: post.id })));
  console.log("📊 Seeded 3 media");

  await db
    .delete(schema.postAttachments)
    .where(eq(schema.postAttachments.postId, post.id));
  await db
    .insert(schema.postAttachments)
    .values(testAttachments.map((a) => ({ ...a, postId: post.id })));
  console.log("📊 Seeded 3 attachments");

  await linkPostToCategories(db, TEST_POST_SLUG, ["teste", "produtividade"]);

  console.timeEnd("seed-test-post");
  console.log("✅ Test post seeded (3 images, 3 media, 3 attachments)");
}

async function main() {
  const connectionString =
    process.env.DATABASE_URL || process.env.DIRECT_URL;
  if (!connectionString) throw new Error("DATABASE_URL or DIRECT_URL is not set");

  const client = postgres(connectionString, { max: 1 });
  const db = drizzle(client, { schema });

  try {
    await seedTestPost(db);
  } finally {
    await client.end();
  }
}

// Guard: only run when this file is the entry point, not when imported
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((err) => {
    console.error("❌", err);
    process.exit(1);
  });
}
