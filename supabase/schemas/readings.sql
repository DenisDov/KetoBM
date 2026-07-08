-- Ketone / glucose measurements, one row per reading. Taken from a paired device
-- or entered manually. measured_at (not created_at) is the source of truth for the
-- date/calendar filters and the Today/Yesterday grouping.
create table public.readings (
  id uuid not null default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,

  -- The device the reading came from. Null for manual entries. set null (not cascade)
  -- so unpairing/deleting a device keeps the reading history intact.
  meter_id uuid references public.devices on delete set null,

  type text not null check (type in ('ketone', 'glucose')),
  value numeric not null,

  -- mmol/L for ketones, mg/dL for glucose.
  unit text not null check (unit in ('mmol/L', 'mg/dL')),

  -- Derived at read time for ketone readings only; null for glucose. set null so
  -- reclassifying/removing a stage keeps the reading.
  ketosis_stage_id uuid references public.ketosis_stages on delete set null,

  -- When the reading was actually taken (may differ from created_at for manual
  -- back-dated entries). Powers all date filtering and grouping.
  measured_at timestamptz not null default now(),

  source text not null check (source in ('device', 'manual')),

  created_at timestamptz not null default now(),

  primary key (id)
);

-- Primary access pattern: a user's own readings, newest first, filtered by date.
create index readings_user_measured_at_idx
  on public.readings (user_id, measured_at desc);

alter table public.readings enable row level security;

grant select, insert, update, delete on public.readings to authenticated;
grant select, insert, update, delete on public.readings to service_role;

-- A user can only see and manage their own readings.
create policy "Readings are viewable by owner"
  on public.readings for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "Readings are insertable by owner"
  on public.readings for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Readings are updatable by owner"
  on public.readings for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "Readings are deletable by owner"
  on public.readings for delete
  to authenticated
  using ((select auth.uid()) = user_id);
