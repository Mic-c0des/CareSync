-- PCE Hours Tracker — Supabase schema
-- Run this in the Supabase SQL editor (Project > SQL Editor > New query)

-- 1. Workplaces --------------------------------------------------------
create table if not exists workplaces (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  notes text,
  created_at timestamptz not null default now()
);

-- 2. Hour entries -------------------------------------------------------
create table if not exists hour_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  workplace_id uuid not null references workplaces(id) on delete cascade,
  entry_date date not null default current_date,
  duration_hours numeric(6,2) not null check (duration_hours > 0),
  notes text,
  created_at timestamptz not null default now()
);

-- 3. Goal (one row per user) --------------------------------------------
create table if not exists goals (
  user_id uuid primary key references auth.users(id) on delete cascade,
  target_hours numeric(7,2) not null default 100,
  updated_at timestamptz not null default now()
);

-- 4. Row Level Security ---------------------------------------------------
-- This is what makes it "multi-tenant" without separate databases:
-- every policy checks that the row's user_id matches the logged-in user.

alter table workplaces enable row level security;
alter table hour_entries enable row level security;
alter table goals enable row level security;

create policy "Users manage their own workplaces"
  on workplaces for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users manage their own hour entries"
  on hour_entries for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users manage their own goal"
  on goals for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- 5. Helpful index for the dashboard query -------------------------------
create index if not exists hour_entries_user_idx on hour_entries(user_id);
create index if not exists workplaces_user_idx on workplaces(user_id);
