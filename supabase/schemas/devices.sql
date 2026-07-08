-- Bluetooth devices a user pairs after onboarding.
create table public.devices (
  id uuid not null default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  name text,
  model text,
  serial_number text,
  bluetooth_id text,

  -- Drives which ketone reference ranges apply to readings from this device.
  operating_mode text not null default 'non_diabetic'
    check (operating_mode in ('diabetic', 'non_diabetic')),

  connection_status text not null default 'disconnected'
    check (connection_status in ('connected', 'disconnected')),
  bluetooth_enabled boolean not null default false,

  firmware_version text,
  paired_at timestamptz,
  last_connected_at timestamptz,
  is_active boolean not null default true,

  created_at timestamptz not null default now(),

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
