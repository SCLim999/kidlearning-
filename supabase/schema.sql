-- Momo 云端同步: run this once in the Supabase dashboard → SQL Editor.
-- One row of progress per parent login, one backup per day; row-level security lets each parent reach only their own rows.

create table if not exists public.momo_progress (
  owner uuid primary key default auth.uid() references auth.users(id) on delete cascade,
  data jsonb not null check (pg_column_size(data) < 3000000),
  updated_at timestamptz not null default now()
);

create table if not exists public.momo_backups (
  id bigserial primary key,
  owner uuid not null default auth.uid() references auth.users(id) on delete cascade,
  day date not null,
  data jsonb not null check (pg_column_size(data) < 3000000),
  created_at timestamptz not null default now(),
  unique (owner, day)
);

alter table public.momo_progress enable row level security;
alter table public.momo_backups enable row level security;

drop policy if exists "own progress" on public.momo_progress;
create policy "own progress" on public.momo_progress for all to authenticated
  using (owner = auth.uid()) with check (owner = auth.uid());

drop policy if exists "own backups" on public.momo_backups;
create policy "own backups" on public.momo_backups for all to authenticated
  using (owner = auth.uid()) with check (owner = auth.uid());

-- not reachable without a login
revoke all on public.momo_progress, public.momo_backups from anon;

-- 「删除云端资料」 also removes the parent's login itself
create or replace function public.delete_my_account() returns void
language sql security definer set search_path = '' as $$
  delete from auth.users where id = auth.uid();
$$;
revoke all on function public.delete_my_account() from public, anon;
grant execute on function public.delete_my_account() to authenticated;
