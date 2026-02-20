#!/usr/bin/env node
/**
 * One-step Neon setup: save connection string to .env.local and apply schema.
 * Run after creating a project at https://console.neon.tech
 *
 * Usage:
 *   node scripts/neon-setup.mjs "postgres://user:pass@ep-xxx.neon.tech/neondb?sslmode=require"
 *   POSTGRES_URL="postgres://..." node scripts/neon-setup.mjs
 */
import { readFileSync, writeFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const envPath = join(root, ".env.local");

const connectionString =
  process.argv[2]?.trim() ||
  process.env.POSTGRES_URL ||
  process.env.DATABASE_URL;

if (!connectionString || (!connectionString.startsWith("postgres://") && !connectionString.startsWith("postgresql://"))) {
  console.log(`
Neon one-step setup
-------------------
1. In the browser that opened, sign in (or sign up) at Neon.
2. Click "New Project" → name it "gotzportal" → Create project.
3. On the project dashboard, open "Connection details" or ".env".
4. Copy the connection string (starts with postgres://).
5. Run this script with that string:

   cd gotzportal
   node scripts/neon-setup.mjs "postgres://USER:PASSWORD@HOST/DB?sslmode=require"

   Or: POSTGRES_URL='postgres://...' node scripts/neon-setup.mjs

This will:
  - Write POSTGRES_URL to .env.local
  - Apply the database schema (tables for gotzportal)
`);
  process.exit(1);
}

// Update or create .env.local
const line = `POSTGRES_URL=${connectionString.replace(/"/g, '\\"')}\n`;
let content = "";
if (existsSync(envPath)) {
  content = readFileSync(envPath, "utf8");
  if (content.includes("POSTGRES_URL=")) {
    content = content.replace(/POSTGRES_URL=.*(\n|$)/, line);
  } else {
    content = content.trimEnd() + "\n" + line;
  }
} else {
  content = line;
}
writeFileSync(envPath, content, "utf8");
console.log("Wrote POSTGRES_URL to .env.local");

// Run schema
process.env.POSTGRES_URL = connectionString;
execSync("node scripts/db-setup.mjs", {
  cwd: root,
  stdio: "inherit",
  env: { ...process.env, POSTGRES_URL: connectionString },
});
console.log("\nDone. Start the app with: npm run dev");
console.log("Add the same POSTGRES_URL to Vercel → Settings → Environment Variables and redeploy.");
