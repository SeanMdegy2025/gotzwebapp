# Vercel setup checklist – gotzportal

Use this when setting up a **new Vercel account** and deploying gotzportal so everything works (DB, login, admin).

---

## 1. Push your code

- Repo must be on GitHub (or GitLab/Bitbucket) and pushed.
- Vercel will deploy from `main` by default (or your chosen branch).

---

## 2. Create the Vercel project

1. Go to [vercel.com](https://vercel.com) and sign in (or create an account).
2. **Add New** → **Project**.
3. **Import** your gotzportal repo.
4. **Framework Preset**: Next.js (should be auto-detected).
5. **Root Directory**: leave blank (repo root).
6. Do **not** deploy yet if you want to set env vars first; or deploy once, then add env vars and redeploy.

---

## 3. Environment variables

In the project: **Settings** → **Environment Variables**.

Add these. Use **Production** (and optionally **Preview** if you want preview deployments to use DB too).

| Name | Value | Required | Notes |
|-----|--------|----------|--------|
| `POSTGRES_URL` | Your Neon connection string | **Yes** | Same as in your local `.env.local`. From [Neon Console](https://console.neon.tech) → your project → Connection string (with pooler). |
| `ADMIN_PASSWORD` | Your admin password | **Yes** | Same as local, e.g. `gotzportal-admin-2025`. Used for token + legacy login. |
| `NEXT_PUBLIC_APP_URL` | Your production URL | Recommended | After first deploy use `https://<your-project>.vercel.app`, or your custom domain later. |

**Optional**

| Name | Value | When to use |
|-----|--------|-------------|
| `ADMIN_EMAIL` | e.g. `gotzadmin@gotzportal.local` | Only if you rely on legacy single-password login and want to allow a specific email; DB login does not need this. |

**Example values (replace with your real ones):**

```
POSTGRES_URL=postgresql://neondb_owner:YOUR_PASSWORD@ep-xxx-pooler.region.aws.neon.tech/neondb?sslmode=require
ADMIN_PASSWORD=gotzportal-admin-2025
NEXT_PUBLIC_APP_URL=https://gotzportal.vercel.app
```

- No quotes around values.
- No spaces before/after the `=` or the value.
- For **POSTGRES_URL**, copy the full string from Neon (or from your `.env.local`).

---

## 4. Deploy

- If you already created the project: **Deployments** → **Redeploy** (latest) → optionally enable **Clear Build Cache** → **Redeploy**.
- New projects deploy automatically when you connect the repo; add env vars first if you can, then trigger a deploy (or redeploy after adding them).

---

## 5. After deploy – verify

1. **Homepage**  
   Open `https://<your-project>.vercel.app` – the site should load.

2. **Login API**  
   In terminal (replace URL and password with yours):
   ```bash
   curl -s -X POST https://YOUR_PROJECT.vercel.app/api/login \
     -H "Content-Type: application/json" \
     -d '{"email":"gotzadmin@gotzportal.local","password":"GotzPortal2025"}'
   ```
   You should get JSON with `token` and `user` (no "Invalid request" or 500).

3. **Login in browser**  
   Go to `https://YOUR_PROJECT.vercel.app/login`, sign in with:
   - Email: `gotzadmin@gotzportal.local`
   - Password: `GotzPortal2025`  
   You should be redirected to admin.

4. **Admin**  
   After login, open `https://YOUR_PROJECT.vercel.app/admin` – dashboard and features (e.g. hero slides, users) should work and use the database.

---

## 6. If something fails

- **"Database not configured"** → `POSTGRES_URL` missing or wrong. Re-check **Settings → Environment Variables**, fix, then **Redeploy**.
- **"Invalid request." / "Invalid request body" / 500 on login** → Ensure latest code is deployed (Redeploy with **Clear Build Cache**). Check **Deployments → [latest] → Logs** for `[login]` errors.
- **Wrong redirect URL** → Set `NEXT_PUBLIC_APP_URL` to your real production URL (e.g. `https://gotzportal.vercel.app`).

---

## Quick reference – minimum for a new Vercel account

1. Create account at vercel.com.
2. Import gotzportal repo as a **Project**.
3. Add env vars: **POSTGRES_URL**, **ADMIN_PASSWORD**, **NEXT_PUBLIC_APP_URL**.
4. Deploy (or redeploy after adding env vars).
5. Test login and admin as in section 5.

That’s everything you need in place for it to work on a new Vercel account.
