# gotzportal – Migration from Laravel to Full Next.js (Vercel)

This app is a **full Next.js** version of the site, with all backend logic in **Next.js API Route Handlers**. No Laravel; deploy as a single app on **Vercel**.

## Where is the database?

- **The database server is not inside Next.js.** It runs externally (e.g. Neon, Vercel Postgres, or any Postgres). You connect to it via an env var (`POSTGRES_URL` or `DATABASE_URL`).
- **Inside the Next.js repo** you have:
  - **Schema**: `src/lib/db/schema.sql` – run this once in your Postgres/Neon database to create tables.
  - **Connection + queries**: `src/lib/db/client.ts` and `src/lib/db/queries.ts` – the code that connects and runs SQL. When no env is set, the app uses in-memory fallbacks so it still runs.

## What’s done

- **Frontend**: Same UI as the gotz site (home, hero, features, about, safaris, destinations, lodges, contact).
- **API**: All public endpoints implemented as Route Handlers under `src/app/api/`:
  - **Read-only**: `GET /api/hero-slides`, `feature-cards`, `about-stats`, `about-highlights`, `contact-channels`, `contact-quick-facts`, `itineraries`, `itineraries/[slug]`, `destinations`, `lodges`, `lodges/[slug]`, `tour-packages`, `tour-packages/[slug]`.
  - **Write**: `POST /api/contact`, `POST /api/bookings`.
- **Data layer**: When `POSTGRES_URL` or `DATABASE_URL` is set, the app uses **Postgres** (see `src/lib/db/`). When not set, it uses **in-memory fallbacks** and store (`src/lib/data/`) so the app runs without a DB.

## Next steps (step-by-step migration)

### 1. Add persistence for production (Vercel)

The app already includes a Postgres layer. To use it:

- **Create a Postgres database** (Neon, Vercel Storage/Neon, or any Postgres).
- **Run the schema**: Execute the SQL in `src/lib/db/schema.sql` in your database (Neon SQL Editor, psql, or any client).
- **Set env**: In Vercel (and locally), set `POSTGRES_URL` or `DATABASE_URL` to your connection string.
- The API routes will then use the DB automatically; when the env is not set, they use in-memory fallbacks.

### 2. Migrate content from Laravel

- Export from Laravel: hero_slides, feature_cards, about_stats, about_highlights, contact_channels, contact_quick_facts, itineraries, itinerary_days, destinations, lodges, tour_packages (and media if stored as base64 or URLs).
- Import into the new DB (scripts or manual SQL/CSV). Ensure IDs/slugs match if you rely on them (e.g. `package_slug` → `tour_package_id` in bookings).

### 3. Optional: copy more pages from gotz

- Itineraries list/detail: `src/app/itineraries/page.tsx`, `src/app/itineraries/[slug]/page.tsx`.
- Tour packages list/detail: `src/app/tour-packages/page.tsx`, `src/app/tour-packages/[slug]/page.tsx`.
- Admin and login can be added later (e.g. NextAuth + admin API routes or a separate admin app).

### 4. Deploy on Vercel

- Push the `gotzportal` folder to a repo (or use the same repo with root or subpath).
- In Vercel: New Project → Import repo, set **Root Directory** to `gotzportal`.
- Add env vars (e.g. `POSTGRES_URL`, `NEXT_PUBLIC_APP_URL` for absolute URLs in server-side fetch).
- Deploy. The app runs as a single Next.js app; all `/api/*` routes are serverless functions on Vercel.

## Running locally

```bash
cd gotzportal
npm install
npm run dev
```

Open http://localhost:3000. Contact and booking forms submit to `/api/contact` and `/api/bookings`; data is stored in memory (lost on restart until you add a real DB).

## Env vars (optional)

- `NEXT_PUBLIC_APP_URL`: Full URL of the app (e.g. `https://your-app.vercel.app`) for server-side API base URL. Defaults to `http://localhost:3000` when not set.
- `POSTGRES_URL` (or your DB env): Used once you add Vercel Postgres (or another DB) and wire it in `src/lib/data/` or `src/lib/db/`.
