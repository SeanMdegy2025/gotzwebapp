#!/usr/bin/env node
/**
 * Run schema.sql against Neon/Postgres. Requires POSTGRES_URL or DATABASE_URL.
 * Usage: POSTGRES_URL="postgres://..." node scripts/db-setup.mjs
 *    or: npm run db:setup   (with .env or .env.local containing POSTGRES_URL)
 */
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import pg from "pg";

const __dirname = dirname(fileURLToPath(import.meta.url));
const connectionString =
  process.env.POSTGRES_URL || process.env.DATABASE_URL;

if (!connectionString) {
  console.error(
    "Missing POSTGRES_URL or DATABASE_URL. Set it in .env.local or pass it:\n  POSTGRES_URL='postgres://...' npm run db:setup"
  );
  process.exit(1);
}

const schemaPath = join(__dirname, "../src/lib/db/schema.sql");
const schema = readFileSync(schemaPath, "utf8");

// Strip full-line comments, then split into statements
const withoutCommentLines = schema
  .split("\n")
  .map((line) => (line.trim().startsWith("--") ? "" : line))
  .join("\n");
const statements = withoutCommentLines
  .split(";")
  .map((s) => s.trim())
  .filter((s) => s.length > 0);

async function main() {
  const client = new pg.Client({ connectionString });
  try {
    await client.connect();
    console.log("Connected to database.");
    for (let i = 0; i < statements.length; i++) {
      const stmt = statements[i] + ";";
      try {
        await client.query(stmt);
        const preview = stmt.slice(0, 60).replace(/\n/g, " ");
        console.log(`  [${i + 1}/${statements.length}] ${preview}...`);
      } catch (err) {
        console.error(`  Failed: ${stmt.slice(0, 80)}...`);
        throw err;
      }
    }
    console.log("Schema applied successfully.");
  } finally {
    await client.end();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
