# Vercel environment variables (complete setup)

**Done:** The following were added to Production (and some to Preview) via CLI. Redeploy completed.

| Name | Value | Environments |
|------|--------|--------------|
| `POSTGRES_URL` | *(copy from .env.local – same Neon connection string)* | Production, Preview |
| `ADMIN_PASSWORD` | *(choose a secure password for admin login)* | Production, Preview |
| `NEXT_PUBLIC_APP_URL` | `https://gotzportal.vercel.app` | Production, Preview |

**Steps:**
1. Open https://vercel.com → your **gotzportal** project → **Settings** → **Environment Variables**.
2. Add each variable; for **POSTGRES_URL** copy the value from your local `.env.local` (the `postgresql://...` line).
3. Go to **Deployments** → ⋮ on the latest deployment → **Redeploy** (so new env vars are used).

After redeploy, the app at https://gotzportal.vercel.app will use Neon and your admin password.
