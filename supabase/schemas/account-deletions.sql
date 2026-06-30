-- Audit log of account deletions. user_id is intentionally NOT a foreign key so
-- the record survives after the auth user and profile are hard-deleted.
create table public.account_deletions (
  id uuid not null default gen_random_uuid(),
  user_id uuid not null,
  email text,
  reason text,
  deleted_at timestamptz not null default now(),

  primary key (id)
);

-- RLS on with no policies: only service_role (which bypasses RLS) can touch it.
-- Clients never read or write the audit log.
alter table public.account_deletions enable row level security;

grant select, insert on public.account_deletions to service_role;
