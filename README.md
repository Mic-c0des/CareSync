# PCE Hours Tracker

A lightweight PWA for tracking PCE (patient care experience) hours ahead of PA school
applications. Add workplaces, log hours against them, and watch a goal ring fill up.
Works as a normal website and can be added to a phone's home screen like an app.

## Stack
- Vite + React + TypeScript
- Tailwind CSS
- Supabase (Postgres + Auth)
- `vite-plugin-pwa` for installability

## 1. Set up Supabase
1. Create a free project at supabase.com.
2. Open **SQL Editor** → paste the contents of `supabase/schema.sql` → Run.
   This creates the `workplaces`, `hour_entries`, and `goals` tables, and turns on
   Row Level Security so each signed-up user only ever sees their own data.
   database needed per person.
3. In **Project Settings → API**, copy the Project URL and the `anon public` key.
4. In **Authentication → Providers**, email/password is on by default. If you don't
   want email confirmation required for a small friend group, you can turn off
   "Confirm email" under Authentication → Settings.

## 2. Configure the app
```bash
cp .env.example .env
# then paste your Project URL and anon key into .env
```

## 3. Run it locally
```bash
npm install
npm run dev
```
Visit the printed localhost URL.

## 4. Deploy
Push this folder to a GitHub repo, then import it into Vercel or Netlify.
Add the same two env vars (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`) in the
hosting dashboard's environment variables settings. Once deployed over HTTPS,
anyone can visit the site and use their browser's "Add to Home Screen" option
to install it like an app.

