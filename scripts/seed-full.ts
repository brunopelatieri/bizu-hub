import { config } from "dotenv";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "../src/db/schema";
import { seedTestPost } from "./seed-test-post";
import { seedOriginalPosts } from "./seed-posts";

config({ path: ".env.local" });

async function main() {
  const connectionString =
    process.env.DATABASE_URL || process.env.DIRECT_URL;
  if (!connectionString) throw new Error("DATABASE_URL or DIRECT_URL is not set");

  const client = postgres(connectionString, { max: 1 });
  const db = drizzle(client, { schema });

  console.log("🚀 Running full seed (test post + 3 original posts)...");
  console.time("seed-full");

  try {
    await seedTestPost(db);
    await seedOriginalPosts(db);
    console.timeEnd("seed-full");
    console.log("✅ Full seed complete. 4 posts total (idempotent).");
  } finally {
    await client.end();
  }
}

main().catch((err) => {
  console.error("❌", err);
  process.exit(1);
});
