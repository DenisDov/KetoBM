-- Support tickets submitted from Contact us ("Request submitted"). One row per
-- submission. Users create and read their own tickets but cannot edit or delete a
-- submitted ticket; staff resolve them via service_role (which bypasses RLS).
create table public.support_requests (
  id uuid not null default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,

  subject text not null,
  message text not null,

  -- Reply-to address. Captured on the form (may differ from the account email).
  email text not null,

  -- Ticket lifecycle. Advanced by staff via service_role.
  status text not null default 'open'
    check (status in ('open', 'closed')),

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  primary key (id)
);

-- Primary access pattern: a user's own tickets, newest first.
create index support_requests_user_created_at_idx
  on public.support_requests (user_id, created_at desc);

alter table public.support_requests enable row level security;

grant select, insert on public.support_requests to authenticated;
grant select, insert, update, delete on public.support_requests to service_role;

-- A user can see their own tickets...
create policy "Support requests are viewable by owner"
  on public.support_requests for select
  to authenticated
  using ((select auth.uid()) = user_id);

-- ...and submit new ones, but cannot edit or delete a submitted ticket (no update/
-- delete policy for authenticated). Staff manage status via service_role.
create policy "Support requests are insertable by owner"
  on public.support_requests for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

-- Keep updated_at fresh on every update (function defined in the profiles schema).
create trigger support_requests_set_updated_at
  before update on public.support_requests
  for each row execute procedure public.set_updated_at();
