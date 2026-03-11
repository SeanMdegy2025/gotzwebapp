#!/usr/bin/env node
/**
 * Run SQL migration files from scripts/migrations/ against your Postgres/Neon DB.
 * Uses POSTGRES_URL or DATABASE_URL (e.g. from .env.local).
 *
 * Run all pending migrations (in order by filename):
 *   npm run db:migrate
 *   or: POSTGRES_URL='postgres://...' node scripts/run-migration.mjs
 *
 * Run a specific migration by name:
 *   node scripts/run-migration.mjs 002_bookings_itinerary_id
 *   or: node scripts/run-migration.mjs 002
 */
import { readFileSync, readdirSync, existsSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import pg from "pg";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load .env.local so POSTGRES_URL is available when running npm run db:migrate
const envPath = join(__dirname, "../.env.local");
if (existsSync(envPath)) {
  const env = readFileSync(envPath, "utf8");
  for (const line of env.split("\n")) {
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "").trim();
  }
}

const connectionString =
  process.env.POSTGRES_URL || process.env.DATABASE_URL;

if (!connectionString) {
  console.error(
    "Missing POSTGRES_URL or DATABASE_URL. Set it in .env.local or pass it:\n  POSTGRES_URL='postgres://...' npm run db:migrate"
  );
  process.exit(1);
}

const migrationsDir = join(__dirname, "migrations");

function getMigrationsToRun(specificName) {
  const files = readdirSync(migrationsDir)
    .filter((f) => f.endsWith(".sql"))
    .sort();
  if (specificName) {
    const match = files.find(
      (f) => f === specificName || f === `${specificName}.sql` || f.startsWith(`${specificName}_`)
    );
    return match ? [match] : [];
  }
  return files;
}

function parseStatements(sql) {
  const withoutCommentLines = sql
    .split("\n")
    .map((line) => (line.trim().startsWith("--") ? "" : line))
    .join("\n");
  return withoutCommentLines
    .split(";")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

async function main() {
  const specific = process.argv[2];
  const toRun = getMigrationsToRun(specific);
  if (toRun.length === 0) {
    console.error(specific ? `No migration found matching: ${specific}` : "No migration files in scripts/migrations/");
    process.exit(1);
  }

  const client = new pg.Client({ connectionString });
  try {
    await client.connect();
    console.log("Connected to database.\n");
    for (const file of toRun) {
      const path = join(migrationsDir, file);
      const sql = readFileSync(path, "utf8");
      const statements = parseStatements(sql);
      console.log(`Running ${file} (${statements.length} statement(s))...`);
      for (let i = 0; i < statements.length; i++) {
        const stmt = statements[i] + ";";
        try {
          await client.query(stmt);
          const preview = stmt.slice(0, 70).replace(/\n/g, " ");
          console.log(`  ✓ ${preview}${preview.length >= 70 ? "..." : ""}`);
        } catch (err) {
          console.error(`  ✗ Failed: ${stmt.slice(0, 80)}...`);
          throw err;
        }
      }
      console.log(`  Done: ${file}\n`);
    }
    console.log("Migration(s) completed successfully.");
  } finally {
    await client.end();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
