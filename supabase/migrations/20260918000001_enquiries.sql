-- ---------------------------------------------------------------------------
-- 0001: enquiries + admin_users
--
-- Privacy model
--   * anon / authenticated roles have NO direct access to enquiries.
--   * Inserts happen only via the service role from the Next.js server.
--   * Admin users (rows in admin_users) may read/update through RLS.
--   * admin_users is managed only by the service role / SQL editor.
-- ---------------------------------------------------------------------------

create extension if not exists "pgcrypto";

-- Enums -----------------------------------------------------------------------
do $$
begin
  if not exists (select 1 from pg_type where typname = 'enquiry_status') then
    create type public.enquiry_status as enum ('new', 'contacted', 'closed', 'spam');
  end if;
end $$;

-- updated_at helper -------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- admin_users -------------------------------------------------------------------
create table if not exists public.admin_users (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

comment on table public.admin_users is
  'Users allowed into /admin. Insert rows manually (SQL editor) after creating the auth user. No public registration.';

alter table public.admin_users enable row level security;

-- An authenticated user may see only their own membership row (used by is_admin()).
drop policy if exists "admin_users: self read" on public.admin_users;
create policy "admin_users: self read"
  on public.admin_users
  for select
  to authenticated
  using (user_id = (select auth.uid()));

-- is_admin(): security definer so it can be used inside policies on other tables.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admin_users a where a.user_id = (select auth.uid())
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

-- enquiries ---------------------------------------------------------------------
create table if not exists public.enquiries (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  name text not null check (char_length(name) between 2 and 120),
  email text not null check (char_length(email) <= 254),
  phone text check (phone is null or char_length(phone) <= 40),
  interest text not null check (char_length(interest) <= 64),
  message text not null check (char_length(message) between 10 and 2000),
  marketing_consent boolean not null default false,
  status public.enquiry_status not null default 'new',
  -- Client-generated UUID; unique so a double submit cannot create two rows.
  client_token uuid not null unique,
  -- HMAC of the IP address (never the raw IP). Used only for rate limiting.
  ip_hash text,
  user_agent text check (user_agent is null or char_length(user_agent) <= 500),
  notes text check (notes is null or char_length(notes) <= 4000)
);

comment on table public.enquiries is 'Website enquiries. Private: readable only by admins via RLS, inserted only by the server (service role).';

create index if not exists enquiries_created_at_idx on public.enquiries (created_at desc);
create index if not exists enquiries_status_idx on public.enquiries (status);
create index if not exists enquiries_ip_hash_created_at_idx on public.enquiries (ip_hash, created_at desc);

drop trigger if exists enquiries_set_updated_at on public.enquiries;
create trigger enquiries_set_updated_at
  before update on public.enquiries
  for each row execute function public.set_updated_at();

alter table public.enquiries enable row level security;

-- Least privilege: strip default grants, then grant only what admins need.
revoke all on public.enquiries from anon, authenticated;
grant select, update on public.enquiries to authenticated;
-- Restrict which columns an admin may change.
revoke update on public.enquiries from authenticated;
grant update (status, notes) on public.enquiries to authenticated;

drop policy if exists "enquiries: admin read" on public.enquiries;
create policy "enquiries: admin read"
  on public.enquiries
  for select
  to authenticated
  using (public.is_admin());

drop policy if exists "enquiries: admin update" on public.enquiries;
create policy "enquiries: admin update"
  on public.enquiries
  for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- No insert/delete policies for anon/authenticated: only the service role inserts.

-- Rate limiting helper (called by the server with the service role) ------------
create or replace function public.count_recent_enquiries(p_ip_hash text, p_since timestamptz)
returns integer
language sql
stable
security definer
set search_path = public
as $$
  select count(*)::integer
  from public.enquiries e
  where e.ip_hash = p_ip_hash and e.created_at >= p_since;
$$;

revoke all on function public.count_recent_enquiries(text, timestamptz) from public, anon, authenticated;
