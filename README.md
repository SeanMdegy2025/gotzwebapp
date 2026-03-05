# gotzportal

Full **Next.js** version of the Go Tanzania Safari site, designed to run on **Vercel** with no Laravel backend. All API logic lives in Next.js Route Handlers (`src/app/api/`).

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Stack

- **Next.js 16** (App Router)
- **React 19**
- **Tailwind CSS 4**
- **TypeScript**

## Project layout

- `src/app/` – App Router pages and API routes
- `src/app/api/` – Route Handlers (GET/POST); Vercel serverless
- `src/components/` – React components
- `src/lib/api.ts` – Frontend API client (calls same-origin `/api/...`)
- `src/lib/db/` – Postgres layer (schema + client + queries). **The DB server is external**; only schema and connection code live in the repo. Set `POSTGRES_URL` or `DATABASE_URL` to use it.
- `src/lib/data/` – Fallbacks and in-memory store when no DB is configured

## Production (Vercel)

For the live site to show **Safaris, Itineraries, and other content from the database** (instead of default/fallback content), set in Vercel:

- **Environment variables** (Project → Settings → Environment Variables):
  - `POSTGRES_URL` or `DATABASE_URL` – your Postgres connection string (e.g. Neon, Vercel Postgres).

Apply to **Production** (and Preview if you want). Redeploy after adding or changing these variables.

See **[MIGRATION.md](./MIGRATION.md)** for step-by-step migration from Laravel and Vercel deployment.
