-- ---------------------------------------------------------------------------
-- 0002: email_deliveries
--
-- Tracks every transactional email attempt separately from the enquiry so
-- that email failures never lose or duplicate an enquiry. One row per
-- (enquiry, kind). Retried by POST /api/email/retry with bounded attempts.
-- ---------------------------------------------------------------------------

do $$
begin
  if not exists (select 1 from pg_type where typname = 'email_kind') then
    create type public.email_kind as enum ('acknowledgement', 'owner_notification');
  end if;
  if not exists (select 1 from pg_type where typname = 'email_status') then
    create type public.email_status as enum ('pending', 'sent', 'failed', 'abandoned');
  end if;
end $$;

create table if not exists public.email_deliveries (
  id uuid primary key default gen_random_uuid(),
  enquiry_id uuid not null references public.enquiries (id) on delete cascade,
  kind public.email_kind not null,
  status public.email_status not null default 'pending',
  attempts integer not null default 0 check (attempts >= 0),
  max_attempts integer not null default 5 check (max_attempts between 1 and 20),
  last_error text check (last_error is null or char_length(last_error) <= 1000),
  provider_message_id text,
  next_attempt_at timestamptz not null default now(),
  sent_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (enquiry_id, kind)
);

comment on table public.email_deliveries is 'Per-email delivery attempts for enquiries (Brevo). Private; admins read-only.';

create index if not exists email_deliveries_due_idx
  on public.email_deliveries (next_attempt_at)
  where status in ('pending', 'failed');

drop trigger if exists email_deliveries_set_updated_at on public.email_deliveries;
create trigger email_deliveries_set_updated_at
  before update on public.email_deliveries
  for each row execute function public.set_updated_at();

alter table public.email_deliveries enable row level security;

revoke all on public.email_deliveries from anon, authenticated;
grant select on public.email_deliveries to authenticated;

drop policy if exists "email_deliveries: admin read" on public.email_deliveries;
create policy "email_deliveries: admin read"
  on public.email_deliveries
  for select
  to authenticated
  using (public.is_admin());

-- Writes happen only through the service role (server). No other policies.
