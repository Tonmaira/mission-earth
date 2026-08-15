-- Forest Bathing — "แจ้งเตือนเมื่อมีกิจกรรม" email signups.
-- Run once in the Supabase SQL Editor.

create table if not exists public.forest_bathing_notify (
  id          bigint generated always as identity primary key,
  email       text        not null check (position('@' in email) > 1),
  location_id text        not null,
  created_at  timestamptz not null default now(),
  unique (email, location_id)
);

alter table public.forest_bathing_notify enable row level security;

-- The public site uses the anon key: it may sign people up, but must not be
-- able to read the list back. Reads go through the service role / dashboard.
drop policy if exists "anon can subscribe" on public.forest_bathing_notify;
create policy "anon can subscribe"
  on public.forest_bathing_notify
  for insert
  to anon
  with check (true);
