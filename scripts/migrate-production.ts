import { config } from "dotenv";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

config({ path: ".env.local" });

const __dirname = dirname(fileURLToPath(import.meta.url));
const migrationsFolder = resolve(__dirname, "../drizzle");

const connectionString = process.env.DIRECT_URL ?? process.env.DATABASE_URL;

if (!connectionString) {
  console.error("❌ Error: DIRECT_URL or DATABASE_URL is not set.");
  console.error("   In dev: check .env.local | In prod: pass via environment variable.");
  process.exit(1);
}

/** Mask DB credentials for safe logging. */
function maskUrl(url: string): string {
  return url.replace(/:\/\/[^:]+:[^@]+@/, "://***:***@");
}

/** Returns hashes of all applied migrations from __drizzle_migrations. */
async function getAppliedMigrations(client: postgres.Sql): Promise<string[]> {
  try {
    const rows = await client<{ hash: string }[]>`
      SELECT hash FROM drizzle.__drizzle_migrations ORDER BY created_at
    `;
    return rows.map((r) => r.hash);
  } catch {
    // Table/schema doesn't exist yet — first run
    return [];
  }
}

async function runMigrations(): Promise<void> {
  const startedAt = new Date();
  const start = Date.now();

  console.log(`\n🚀 Production Migrations — ${startedAt.toISOString()}`);
  console.log(`📁 Folder: ${migrationsFolder}`);
  console.log(`🗄️  Database: ${maskUrl(connectionString!)}`);
  console.log(`🌍 NODE_ENV: ${process.env.NODE_ENV ?? "development"}\n`);

  // Suppress Postgres NOTICE messages (e.g. "schema already exists")
  const client = postgres(connectionString!, { max: 1, onnotice: () => {} });
  const db = drizzle(client);

  const before = await getAppliedMigrations(client);
  console.log(`ℹ️  Migrations already applied: ${before.length}`);

  try {
    await migrate(db, { migrationsFolder });
  } catch (err) {
    console.error("\n❌ Migration failed:");
    console.error(err instanceof Error ? err.message : String(err));
    await client.end();
    process.exit(1);
  }

  const after = await getAppliedMigrations(client);
  const newCount = after.length - before.length;

  if (newCount === 0) {
    console.log("✅ No new migrations — database is already up to date.");
  } else {
    const newHashes = after.slice(before.length);
    console.log(`\n✅ ${newCount} migration(s) applied:`);
    for (const hash of newHashes) {
      console.log(`   • ${hash}`);
    }
  }

  const duration = ((Date.now() - start) / 1000).toFixed(2);
  console.log(`\n⏱️  Done in ${duration}s\n`);

  await client.end();
}

runMigrations().catch((err) => {
  console.error("❌ Unexpected error:", err);
  process.exit(1);
});
