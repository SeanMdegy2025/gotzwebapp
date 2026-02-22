#!/usr/bin/env node
/**
 * Reset password (and optionally email) for an existing user.
 * Loads .env.local, then uses RESET_PASSWORD_EMAIL, RESET_PASSWORD_NEW, and optionally RESET_PASSWORD_NEW_EMAIL.
 *
 * Usage:
 *   RESET_PASSWORD_EMAIL=admin@gotzportal.local RESET_PASSWORD_NEW=your-new-password npm run db:reset-password
 *   RESET_PASSWORD_EMAIL=admin@gotzportal.local RESET_PASSWORD_NEW=pass RESET_PASSWORD_NEW_EMAIL=new@example.com npm run db:reset-password
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
const email = (process.env.RESET_PASSWORD_EMAIL || "admin@gotzportal.local").trim().toLowerCase();
const newPassword = process.env.RESET_PASSWORD_NEW;
const newEmail = process.env.RESET_PASSWORD_NEW_EMAIL ? process.env.RESET_PASSWORD_NEW_EMAIL.trim().toLowerCase() : null;

if (!connectionString) {
  console.error("Missing POSTGRES_URL or DATABASE_URL in .env.local");
  process.exit(1);
}
if (!newPassword || newPassword.length < 8) {
  console.error("Set RESET_PASSWORD_NEW (min 8 characters). Example:");
  console.error('  RESET_PASSWORD_EMAIL=admin@gotzportal.local RESET_PASSWORD_NEW=mynewpass npm run db:reset-password');
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
    if (existing.rows.length === 0) {
      console.error(`No user found with email: ${email}`);
      process.exit(1);
    }
    if (newEmail && newEmail === email) {
      console.error("RESET_PASSWORD_NEW_EMAIL must be different from current email.");
      process.exit(1);
    }
    if (newEmail) {
      const taken = await client.query(
        "SELECT id FROM users WHERE email = $1 AND deleted_at IS NULL",
        [newEmail]
      );
      if (taken.rows.length > 0) {
        console.error(`Email already in use: ${newEmail}`);
        process.exit(1);
      }
    }
    const password_hash = await hash(newPassword, 10);
    if (newEmail) {
      await client.query(
        "UPDATE users SET email = $1, password_hash = $2, updated_at = NOW() WHERE email = $3 AND deleted_at IS NULL",
        [newEmail, password_hash, email]
      );
      console.log(`Updated: email ${email} → ${newEmail}, password reset. Log in with the new email and password.`);
    } else {
      await client.query(
        "UPDATE users SET password_hash = $1, updated_at = NOW() WHERE email = $2 AND deleted_at IS NULL",
        [password_hash, email]
      );
      console.log(`Password updated for ${email}. You can log in with the new password.`);
    }
  } finally {
    await client.end();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
