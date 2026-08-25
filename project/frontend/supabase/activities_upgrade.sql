-- Upgrades the existing `activities` table to support Forest-Bathing-grade
-- detail pages: multiple dated/priced trips, multi-section content, an
-- instructor list, a photo gallery, campaign branding, and a "notify me"
-- signup for activities that aren't open yet.
--
-- Run once in the Supabase SQL Editor. Safe to re-run (uses IF NOT EXISTS /
-- ADD COLUMN IF NOT EXISTS throughout) — existing rows are unaffected aside
-- from getting sensible defaults for the new columns.

-- 1) New columns on the existing `activities` table -------------------------
-- (en_desc / th_desc are reused as the "blurb"; start_date / end_date are
--  kept as-is and remain the fallback for activities with no trips.)
alter table public.activities
  add column if not exists poster_image_url text,
  add column if not exists poster_ratio      numeric,
  add column if not exists campaign_eyebrow  text,
  add column if not exists campaign_title    text,
  add column if not exists is_open           boolean not null default true,
  add column if not exists partner_logo_url  text,
  add column if not exists register_url      text,
  add column if not exists en_region         text,
  add column if not exists th_region         text,
  add column if not exists sections_en       jsonb not null default '{}'::jsonb,
  add column if not exists sections_th       jsonb not null default '{}'::jsonb,
  add column if not exists instructors       jsonb not null default '[]'::jsonb,
  add column if not exists gallery_urls      text[] not null default '{}'::text[];

-- 2) Trips — one activity can have many dated/priced sessions ---------------
create table if not exists public.activity_trips (
  id          uuid primary key default gen_random_uuid(),
  activity_id uuid not null references public.activities(id) on delete cascade,
  start_date  date not null,
  end_date    date not null,
  hours       numeric,
  price       numeric not null,
  full_price  numeric,
  sort_order  int not null default 0
);

alter table public.activity_trips enable row level security;

-- Public site only needs to read trips (to show dates/prices/calendar).
drop policy if exists "anon can read trips" on public.activity_trips;
create policy "anon can read trips"
  on public.activity_trips
  for select
  to anon
  using (true);

-- The admin panel writes trips as a logged-in Supabase user (same trust
-- model as whatever already lets it insert/update/delete on `activities`).
drop policy if exists "authenticated can manage trips" on public.activity_trips;
create policy "authenticated can manage trips"
  on public.activity_trips
  for all
  to authenticated
  using (true)
  with check (true);

-- 3) "Notify me" signups for activities with is_open = false -----------------
-- Same shape/policy as forest_bathing_notify.sql, generalized to any activity.
create table if not exists public.activity_notify (
  id          bigint generated always as identity primary key,
  email       text        not null check (position('@' in email) > 1),
  activity_id uuid        not null references public.activities(id) on delete cascade,
  created_at  timestamptz not null default now(),
  unique (email, activity_id)
);

alter table public.activity_notify enable row level security;

-- The public site uses the anon key: it may sign people up, but must not be
-- able to read the list back. Reads go through the service role / dashboard.
drop policy if exists "anon can subscribe" on public.activity_notify;
create policy "anon can subscribe"
  on public.activity_notify
  for insert
  to anon
  with check (true);
