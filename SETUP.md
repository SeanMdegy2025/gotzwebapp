# Gotzportal setup: Neon + Vercel test domain

## 1. Create a Neon database (one-time)

In the browser (Neon signup/login page should have opened; if not, open **https://console.neon.tech**):

1. Sign in with GitHub or email.
2. Click **New Project**.
3. Name: `gotzportal`, region: **US East** (or nearest), Postgres **15**.
4. Click **Create project**.
5. On the project dashboard, open **Connection details** or the **.env** tab.
6. Copy the **connection string** (starts with `postgres://`). Use the **pooled** one if you see both.

## 2. Apply the schema and save env (one command)

From the project root, paste your connection string into one of these:

```bash
cd gotzportal
npm run neon:setup -- "postgres://USER:PASSWORD@ep-xxx.neon.tech/neondb?sslmode=require"
```

Or with the variable set:

```bash
POSTGRES_URL='postgres://...' npm run neon:setup
```

This writes `POSTGRES_URL` to `.env.local` and runs the schema. You should see `Schema applied successfully.`

## 3. Test domain (Vercel)

Your deployed app is available at:

- **Production:** https://gotzportal.vercel.app  
- **Preview (per deploy):** `https://gotzportal-<hash>-<team>.vercel.app`

Use **https://gotzportal.vercel.app** as the test domain. No extra DNS or domain setup is required.

## 4. Environment variables on Vercel

1. Open **https://vercel.com** → your **gotzportal** project → **Settings** → **Environment Variables**.
2. Add:

   | Name               | Value                    | Environments   |
   |--------------------|--------------------------|----------------|
   | `POSTGRES_URL`     | (Neon connection string) | Production, Preview |
   | `ADMIN_PASSWORD`   | (admin login password)   | Production, Preview |
   | `NEXT_PUBLIC_APP_URL` | `https://gotzportal.vercel.app` | Production, Preview (optional) |

3. **Redeploy** (Deployments → ⋮ on latest → Redeploy) so the new env vars are used.

## 5. Verify

- Visit **https://gotzportal.vercel.app** (home).
- Visit **https://gotzportal.vercel.app/login** and sign in with the admin password you set.
- Open **https://gotzportal.vercel.app/admin** and confirm dashboard and content load (data comes from Neon).

---

**Summary**

- **Neon:** Create project at console.neon.tech → copy `POSTGRES_URL` → run `npm run db:setup`.
- **Test domain:** Use **https://gotzportal.vercel.app**.
- **Vercel:** Set `POSTGRES_URL`, `ADMIN_PASSWORD`, and optionally `NEXT_PUBLIC_APP_URL`, then redeploy.
