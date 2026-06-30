-- Bluetooth devices a user pairs after onboarding.
create table public.devices (
  id uuid not null default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  name text,
  identifier text,
  created_at timestamptz not null default now(),
  last_connected_at timestamptz,

  primary key (id)
);

alter table public.devices enable row level security;

grant select, insert, update, delete on public.devices to authenticated;
grant select, insert, update, delete on public.devices to service_role;

-- A user can only see and manage their own devices.
create policy "Devices are viewable by owner"
  on public.devices for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "Devices are insertable by owner"
  on public.devices for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Devices are updatable by owner"
  on public.devices for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "Devices are deletable by owner"
  on public.devices for delete
  to authenticated
  using ((select auth.uid()) = user_id);
