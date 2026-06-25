import { config } from "dotenv";
import crypto from "node:crypto";
import fs from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import postgres from "postgres";

config({ path: ".env.local" });

const __dirname = dirname(fileURLToPath(import.meta.url));
const migrationsFolder = resolve(__dirname, "../drizzle");
const journalPath = resolve(migrationsFolder, "meta/_journal.json");

const connectionString = process.env.DIRECT_URL ?? process.env.DATABASE_URL;

if (!connectionString) {
  console.error("❌ DIRECT_URL or DATABASE_URL is not set.");
  process.exit(1);
}

type JournalEntry = {
  idx: number;
  tag: string;
  when: number;
};

function readJournal(): JournalEntry[] {
  const journal = JSON.parse(fs.readFileSync(journalPath, "utf8")) as {
    entries: JournalEntry[];
  };
  return journal.entries;
}

function migrationHash(tag: string): string {
  const sql = fs.readFileSync(resolve(migrationsFolder, `${tag}.sql`), "utf8");
  return crypto.createHash("sha256").update(sql).digest("hex");
}

function maskUrl(url: string): string {
  return url.replace(/:\/\/[^:]+:[^@]+@/, "://***:***@");
}

async function ensureMigrationTable(client: postgres.Sql): Promise<void> {
  await client`CREATE SCHEMA IF NOT EXISTS drizzle`;
  await client`
    CREATE TABLE IF NOT EXISTS drizzle.__drizzle_migrations (
      id SERIAL PRIMARY KEY,
      hash text NOT NULL,
      created_at bigint
    )
  `;
}

async function main(): Promise<void> {
  const throughTag = process.argv[2];

  if (!throughTag) {
    console.error("Usage: npm run db:migrate:baseline -- <migration_tag>");
    console.error("Example: npm run db:migrate:baseline -- 0000_cloudy_miracleman");
    process.exit(1);
  }

  const entries = readJournal();
  const target = entries.find((entry) => entry.tag === throughTag);

  if (!target) {
    console.error(`❌ Unknown migration tag: ${throughTag}`);
    process.exit(1);
  }

  const toBaseline = entries.filter((entry) => entry.idx <= target.idx);

  console.log(`\n📌 Baseline migrations through: ${throughTag}`);
  console.log(`🗄️  Database: ${maskUrl(connectionString!)}\n`);

  const client = postgres(connectionString!, { max: 1, onnotice: () => {} });

  try {
    await ensureMigrationTable(client);

    const existing = await client<{ hash: string }[]>`
      SELECT hash FROM drizzle.__drizzle_migrations
    `;
    const existingHashes = new Set(existing.map((row) => row.hash));

    let inserted = 0;

    for (const entry of toBaseline) {
      const hash = migrationHash(entry.tag);

      if (existingHashes.has(hash)) {
        console.log(`⏭️  Already recorded: ${entry.tag}`);
        continue;
      }

      await client`
        INSERT INTO drizzle.__drizzle_migrations (hash, created_at)
        VALUES (${hash}, ${entry.when})
      `;

      console.log(`✅ Recorded: ${entry.tag} (${hash.slice(0, 12)}…)`);
      inserted += 1;
    }

    if (inserted === 0) {
      console.log("\nℹ️  Nothing to baseline — records already present.");
    } else {
      console.log(`\n✅ ${inserted} migration record(s) baselined.`);
      console.log("   Next: npm run db:migrate:prod\n");
    }
  } finally {
    await client.end();
  }
}

main().catch((err) => {
  console.error("❌ Baseline failed:", err instanceof Error ? err.message : err);
  process.exit(1);
});
