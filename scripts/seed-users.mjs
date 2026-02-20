#!/usr/bin/env node
/**
 * Seed an initial admin user in the users table.
 * Uses SEED_ADMIN_PASSWORD or ADMIN_PASSWORD; email defaults to admin@gotzportal.local.
 * Skips if a user with that email already exists.
 * Usage: npm run db:seed-users   (loads .env.local from project root)
 */
import { readFileSync, existsSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { hash } from "bcryptjs";
import pg from "pg";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const envPath = join(root, ".env.local");
if (existsSync(envPath)) {
  const content = readFileSync(envPath, "utf8");
  for (const line of content.split("\n")) {
    const m = line.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "").trim();
  }
}

const connectionString = process.env.POSTGRES_URL || process.env.DATABASE_URL;
const password = process.env.SEED_ADMIN_PASSWORD || process.env.ADMIN_PASSWORD;
const email = (process.env.SEED_ADMIN_EMAIL || "admin@gotzportal.local").trim().toLowerCase();
const name = process.env.SEED_ADMIN_NAME || "Admin";

if (!connectionString) {
  console.error("Missing POSTGRES_URL or DATABASE_URL.");
  process.exit(1);
}
if (!password || password.length < 8) {
  console.error("Set SEED_ADMIN_PASSWORD or ADMIN_PASSWORD (min 8 characters).");
  process.exit(1);
}

async function main() {
  const client = new pg.Client({ connectionString });
  try {
    await client.connect();
    const existing = await client.query(
      "SELECT id FROM users WHERE email = $1 AND deleted_at IS NULL",
      [email]
    );
    if (existing.rows.length > 0) {
      console.log(`User ${email} already exists. Skipping seed.`);
      return;
    }
    const password_hash = await hash(password, 10);
    await client.query(
      "INSERT INTO users (email, password_hash, name, role) VALUES ($1, $2, $3, 'admin')",
      [email, password_hash, name]
    );
    console.log(`Seeded user: ${email}`);
  } finally {
    await client.end();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
