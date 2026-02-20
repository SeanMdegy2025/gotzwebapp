#!/usr/bin/env node
/**
 * Create a Neon project via API (needs org_id for personal API keys), apply schema, write .env.local.
 * Get API key: https://console.neon.tech/app/settings/api-keys
 * Get org id: https://console.neon.tech/app/settings (under General / Organization)
 * Usage: NEON_API_KEY=... NEON_ORG_ID=org-xxx node scripts/neon-create-and-setup.mjs
 */
import { writeFileSync, existsSync, readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";
import { createApiClient } from "@neondatabase/api-client";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const envPath = join(root, ".env.local");

function loadEnvLocal() {
  if (!existsSync(envPath)) return;
  const content = readFileSync(envPath, "utf8");
  for (const line of content.split("\n")) {
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
    if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "").trim();
  }
}
loadEnvLocal();

const NEON_API_KEY = process.env.NEON_API_KEY;
const NEON_ORG_ID = process.env.NEON_ORG_ID;

if (!NEON_API_KEY) {
  console.log(`
Set NEON_API_KEY (from https://console.neon.tech/app/settings/api-keys).
Also set NEON_ORG_ID (from https://console.neon.tech/app/settings → Organization ID).
`);
  process.exit(1);
}

async function main() {
  const api = createApiClient({ apiKey: NEON_API_KEY });

  console.log("Creating Neon project 'gotzportal'...");
  const body = {
    project: { name: "gotzportal", region_id: "aws-us-east-2" },
    ...(NEON_ORG_ID && { org_id: NEON_ORG_ID }),
  };
  const params = NEON_ORG_ID ? { query: { org_id: NEON_ORG_ID } } : {};
  const { data } = await api.createProject(body, params);

  const connectionUri = data.connection_uris?.[0]?.connection_uri;
  if (!connectionUri || !String(connectionUri).startsWith("postgres")) {
    console.error("No connection string in response. If you see 'org_id is required', add NEON_ORG_ID.");
    console.error("Get org_id from: https://console.neon.tech/app/settings (Organization section)");
    process.exit(1);
  }

  const conn = String(connectionUri).trim();
  console.log("Project created. Writing .env.local and applying schema...");

  let envContent = "";
  if (existsSync(envPath)) {
    envContent = readFileSync(envPath, "utf8");
    if (envContent.includes("POSTGRES_URL=")) {
      envContent = envContent.replace(/POSTGRES_URL=.*(\n|$)/, `POSTGRES_URL=${conn}\n`);
    } else {
      envContent = envContent.trimEnd() + "\nPOSTGRES_URL=" + conn + "\n";
    }
  } else {
    envContent = "POSTGRES_URL=" + conn + "\n";
  }
  writeFileSync(envPath, envContent, "utf8");

  execSync("node scripts/db-setup.mjs", {
    cwd: root,
    stdio: "inherit",
    env: { ...process.env, POSTGRES_URL: conn },
  });
  console.log("\nDone. Add POSTGRES_URL to Vercel → Environment Variables and redeploy.");
}

main().catch((err) => {
  const msg = err.response?.data?.message || err.message;
  if (String(msg).includes("org_id")) {
    console.error("\norg_id is required. Get it from: https://console.neon.tech/app/settings");
    console.error("Under your organization name you'll see Organization ID (e.g. org-xxxx-xxxx).");
    console.error("Then run: NEON_ORG_ID=org-xxxx node scripts/neon-create-and-setup.mjs");
  } else {
    console.error(err);
  }
  process.exit(1);
});
