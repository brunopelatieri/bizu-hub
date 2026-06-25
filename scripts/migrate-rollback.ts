import { config } from "dotenv";
import postgres from "postgres";
import { readFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { createInterface } from "readline";

config({ path: ".env.local" });

const __dirname = dirname(fileURLToPath(import.meta.url));
const migrationsFolder = resolve(__dirname, "../drizzle");
const journalPath = resolve(migrationsFolder, "meta/_journal.json");

interface JournalEntry {
  idx: number;
  version: string;
  when: number;
  tag: string;
  breakpoints: boolean;
}

interface Journal {
  version: string;
  dialect: string;
  entries: JournalEntry[];
}

interface AppliedMigration {
  id: number;
  hash: string;
  created_at: string;
}

/** Parse CLI args without external dependencies. */
function parseArgs(): { steps: number; force: boolean; dryRun: boolean } {
  const args = process.argv.slice(2);
  const result = { steps: 1, force: false, dryRun: false };

  for (const arg of args) {
    if (arg.startsWith("--steps=")) {
      const n = parseInt(arg.replace("--steps=", ""), 10);
      if (!isNaN(n) && n > 0) result.steps = n;
    } else if (arg === "--force") {
      result.force = true;
    } else if (arg === "--dry-run") {
      result.dryRun = true;
    }
  }

  return result;
}

/** Prompt user for yes/no confirmation. Default is No. */
async function askConfirmation(question: string): Promise<boolean> {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  return new Promise<boolean>((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(["y", "yes"].includes(answer.trim().toLowerCase()));
    });
  });
}

/** Mask DB credentials for safe logging. */
function maskUrl(url: string): string {
  return url.replace(/:\/\/[^:]+:[^@]+@/, "://***:***@");
}

/** Read first N lines of a string for preview. */
function preview(content: string, lines = 6): string {
  return content
    .split("\n")
    .slice(0, lines)
    .map((l) => `        ${l}`)
    .join("\n");
}

async function rollback(): Promise<void> {
  const args = parseArgs();
  const startedAt = new Date();

  console.log(`\n⚠️  Migration Rollback — ${startedAt.toISOString()}`);
  console.log(`🔄 Steps to revert: ${args.steps}`);
  if (args.dryRun) console.log("🔍 DRY RUN — no changes will be made");
  if (args.force) console.log("⚡ Force mode — skipping confirmation prompt");
  console.log();

  const connectionString = process.env.DIRECT_URL ?? process.env.DATABASE_URL;
  if (!connectionString) {
    console.error("❌ DIRECT_URL or DATABASE_URL is not set.");
    console.error("   In dev: check .env.local | In prod: pass via environment variable.");
    process.exit(1);
  }

  console.log(`🗄️  Database: ${maskUrl(connectionString)}\n`);

  if (!existsSync(journalPath)) {
    console.error(`❌ Migration journal not found: ${journalPath}`);
    console.error("   Run npm run db:generate to create migrations first.");
    process.exit(1);
  }

  const journal: Journal = JSON.parse(readFileSync(journalPath, "utf-8"));
  // Suppress Postgres NOTICE messages
  const client = postgres(connectionString, { max: 1, onnotice: () => {} });

  // --- Query applied migrations ---
  let appliedRows: AppliedMigration[];
  try {
    appliedRows = await client<AppliedMigration[]>`
      SELECT id, hash, created_at
      FROM drizzle.__drizzle_migrations
      ORDER BY created_at ASC
    `;
  } catch {
    console.log("ℹ️  No __drizzle_migrations table found — nothing to roll back.");
    await client.end();
    return;
  }

  if (appliedRows.length === 0) {
    console.log("ℹ️  No migrations applied — nothing to roll back.");
    await client.end();
    return;
  }

  const stepsToApply = Math.min(args.steps, appliedRows.length);
  if (stepsToApply < args.steps) {
    console.log(
      `⚠️  Requested ${args.steps} step(s) but only ${appliedRows.length} applied — reverting all ${appliedRows.length}.\n`
    );
  }

  // Most-recent first
  const toRevert = [...appliedRows].slice(-stepsToApply).reverse();

  // --- Display what will be reverted ---
  console.log(`📋 Migrations to remove from __drizzle_migrations (${stepsToApply}):\n`);

  for (let i = 0; i < stepsToApply; i++) {
    const row = toRevert[i];
    // Match journal entry by created_at === journal.when (Drizzle stores journal.when as created_at)
    const entry = journal.entries.find(
      (e) => String(e.when) === String(row.created_at)
    );
    const tag = entry?.tag ?? "(unknown — no journal match)";
    const sqlFile = entry ? resolve(migrationsFolder, `${entry.tag}.sql`) : null;

    console.log(`   ${i + 1}. ${tag}`);
    console.log(`      Hash:       ${row.hash}`);
    console.log(`      Applied at: ${row.created_at}`);

    if (sqlFile && existsSync(sqlFile)) {
      const sqlContent = readFileSync(sqlFile, "utf-8");
      console.log(`      SQL file:   ${sqlFile}`);
      console.log(`      Forward SQL preview (what was applied):`);
      console.log(preview(sqlContent));
    }
    console.log();
  }

  // --- Warning about manual steps ---
  console.log("┌─────────────────────────────────────────────────────────────────┐");
  console.log("│ ⚠️  IMPORTANT — READ BEFORE PROCEEDING                         │");
  console.log("│                                                                 │");
  console.log("│ This script ONLY removes records from __drizzle_migrations.    │");
  console.log("│ It does NOT auto-reverse CREATE TABLE, ALTER TABLE or data.    │");
  console.log("│                                                                 │");
  console.log("│ After rollback you MUST manually:                              │");
  console.log("│   1. Run the reverse SQL (DROP TABLE, etc.) in psql            │");
  console.log("│   2. Or restore from a database backup                         │");
  console.log("│                                                                 │");
  console.log("│ Tip: Take a DB snapshot before proceeding.                     │");
  console.log("└─────────────────────────────────────────────────────────────────┘\n");

  if (args.dryRun) {
    console.log("🔍 DRY RUN complete — no changes were made.\n");
    await client.end();
    return;
  }

  // --- Confirmation ---
  if (!args.force) {
    const confirmed = await askConfirmation(
      `❓ Remove ${stepsToApply} migration record(s) from __drizzle_migrations? (y/N): `
    );
    if (!confirmed) {
      console.log("\n🚫 Rollback cancelled — no changes made.\n");
      await client.end();
      return;
    }
    console.log();
  }

  // --- Execute rollback ---
  const idsToDelete = toRevert.map((r) => r.id);

  try {
    await client`
      DELETE FROM drizzle.__drizzle_migrations
      WHERE id = ANY(${idsToDelete})
    `;
  } catch (err) {
    console.error("❌ Failed to remove migration records:");
    console.error(err instanceof Error ? err.message : String(err));
    await client.end();
    process.exit(1);
  }

  console.log(`✅ ${stepsToApply} migration record(s) removed from __drizzle_migrations.`);
  console.log("\n📝 Next steps:");
  console.log("   1. Manually apply reverse SQL (see SQL previews above)");
  console.log("   2. Verify database state is correct");
  console.log("   3. When ready: npm run db:migrate:prod to re-apply migrations\n");

  await client.end();
}

rollback().catch((err) => {
  console.error("❌ Unexpected error:", err);
  process.exit(1);
});
