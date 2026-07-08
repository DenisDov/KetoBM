-- Per-platform version gate, one row per platform (singleton). Used to gate the app
-- on launch: the client compares its installed version against this row for its
-- platform. Below min_supported_version forces a hard update; below latest_version
-- shows an optional "update available" prompt. Global reference data, not user-owned:
-- everyone reads it, only service_role writes it (managed via migration).
create table public.app_versions (
  id uuid not null default gen_random_uuid(),

  -- Store platform this gate applies to. One row each.
  platform text not null check (platform in ('ios', 'android')),

  -- Newest version available in the store (semver, e.g. "1.4.0"). Drives the soft
  -- "update available" prompt.
  latest_version text not null,

  -- Oldest version still allowed to run (semver). Installed versions below this are
  -- hard-blocked and must update before continuing.
  min_supported_version text not null,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  primary key (id),

  -- One gate row per platform.
  unique (platform)
);

alter table public.app_versions enable row level security;

-- Read-only to clients; writes go through migrations (service_role bypasses RLS).
grant select on public.app_versions to authenticated;
grant select, insert, update, delete on public.app_versions to service_role;

create policy "App versions are viewable by all authenticated users"
  on public.app_versions for select
  to authenticated
  using (true);

-- Keep updated_at fresh on every update (function defined in the profiles schema).
create trigger app_versions_set_updated_at
  before update on public.app_versions
  for each row execute procedure public.set_updated_at();
