-- Reference table of ketone (BHB) ranges, one row per stage per mode. Used to
-- classify a ketone reading at read time (readings.ketosis_stage_id). Global
-- lookup data, not user-owned: everyone reads it, only service_role writes it
-- (seeded via migration). mode mirrors devices.operating_mode.
create table public.ketosis_stages (
  id uuid not null default gen_random_uuid(),

  mode text not null check (mode in ('diabetic', 'non_diabetic')),
  stage_name text not null,

  -- Half-open range [min_mmol, max_mmol). min_mmol null = open lower bound,
  -- max_mmol null = open upper bound (e.g. Ketoacidosis). Value in mmol/L.
  min_mmol numeric,
  max_mmol numeric,

  -- Hex color for the badge/dot, plus a short status descriptor for the UI.
  color text,
  status_label text,

  sort_order smallint not null,

  primary key (id),

  -- One stage per position within a mode.
  unique (mode, sort_order),
  unique (mode, stage_name)
);

alter table public.ketosis_stages enable row level security;

-- Read-only to clients; writes go through migrations (service_role bypasses RLS).
grant select on public.ketosis_stages to authenticated;
grant select, insert, update, delete on public.ketosis_stages to service_role;

create policy "Ketosis stages are viewable by all authenticated users"
  on public.ketosis_stages for select
  to authenticated
  using (true);
