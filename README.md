# PCE Hours Tracker

A lightweight PWA for tracking PCE (patient care experience) hours ahead of PA school
applications. Add workplaces, log hours against them, and watch a goal ring fill up.
Works as a normal website and can be added to a phone's home screen like an app.

## Stack
- Vite + React + TypeScript
- Tailwind CSS
- Neon Postgres, Managed Better Auth, and Data API
- `vite-plugin-pwa` for installability

## Configure the app
The Neon project is linked in `.neon`, and `neon.ts` declares Auth and Data API
for the production branch. After signing in to the Neon CLI, deploy config and
pull local environment variables:
```bash
neon login
neon deploy
```
The local `.env` uses `VITE_NEON_AUTH_URL` and `VITE_NEON_DATA_API_URL`. Keep
these values in the hosting provider's environment settings for production.
Add your local development URL and deployed app origin to Neon Auth's trusted
domains. Database access is governed by PostgreSQL grants and row-level
security policies; verify those controls on the existing `workplaces`,
`hour_entries`, and `goals` tables before exposing the app publicly.

## Run it locally
```bash
npm install
npm run dev
```
Visit the printed localhost URL.

## Deploy
Push this folder to a GitHub repo, then import it into Vercel or Netlify.
Set the two `VITE_NEON_*` variables in the hosting dashboard. Once deployed
over HTTPS, anyone can visit the site and use their browser's "Add to Home
Screen" option to install it like an app.

