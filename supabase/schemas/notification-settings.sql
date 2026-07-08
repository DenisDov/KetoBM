-- Per-user push notification preferences, one row per user (singleton, enforced by the
-- unique user_id). Records whether push is enabled and when the OS permission was
-- granted. Written from the allow-notifications permission screen.
create table public.notification_settings (
  id uuid not null default gen_random_uuid(),

  -- One settings row per user.
  user_id uuid not null references auth.users on delete cascade,

  -- Whether the user has push notifications turned on in-app.
  push_enabled boolean not null default false,

  -- When the OS notification permission was granted. Null until/if granted.
  permission_granted_at timestamptz,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  primary key (id),

  -- Singleton per user.
  unique (user_id)
);

alter table public.notification_settings enable row level security;

grant select, insert, update, delete on public.notification_settings to authenticated;
grant select, insert, update, delete on public.notification_settings to service_role;

-- A user can only see and manage their own settings.
create policy "Notification settings are viewable by owner"
  on public.notification_settings for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "Notification settings are insertable by owner"
  on public.notification_settings for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Notification settings are updatable by owner"
  on public.notification_settings for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "Notification settings are deletable by owner"
  on public.notification_settings for delete
  to authenticated
  using ((select auth.uid()) = user_id);

-- Keep updated_at fresh on every update (function defined in the profiles schema).
create trigger notification_settings_set_updated_at
  before update on public.notification_settings
  for each row execute procedure public.set_updated_at();
