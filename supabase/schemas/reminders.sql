-- Scheduled measurement reminders, many per user. Each row is one reminder the app
-- schedules as a local/push notification (e.g. "Test ketones — 08:00 daily"). Toggling
-- a reminder off keeps the row so its time/label persist; only is_enabled flips.
create table public.reminders (
  id uuid not null default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,

  -- Local wall-clock time the reminder fires at (no date, no timezone).
  time_of_day time not null,

  -- Whether the reminder is currently active. Off keeps the row for later re-enable.
  is_enabled boolean not null default true,

  -- Repeat cadence. Constrained so scheduling logic can rely on a known set.
  repeat text not null default 'daily' check (repeat in ('daily', 'weekly')),

  -- Optional user-facing label (e.g. "Morning test"). Null falls back to a default.
  label text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  primary key (id)
);

-- Primary access pattern: a user's own reminders, earliest time first.
create index reminders_user_time_idx on public.reminders (user_id, time_of_day);

alter table public.reminders enable row level security;

grant select, insert, update, delete on public.reminders to authenticated;
grant select, insert, update, delete on public.reminders to service_role;

-- A user can only see and manage their own reminders.
create policy "Reminders are viewable by owner"
  on public.reminders for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "Reminders are insertable by owner"
  on public.reminders for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Reminders are updatable by owner"
  on public.reminders for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "Reminders are deletable by owner"
  on public.reminders for delete
  to authenticated
  using ((select auth.uid()) = user_id);

-- Keep updated_at fresh on every update (function defined in the profiles schema).
create trigger reminders_set_updated_at
  before update on public.reminders
  for each row execute procedure public.set_updated_at();
