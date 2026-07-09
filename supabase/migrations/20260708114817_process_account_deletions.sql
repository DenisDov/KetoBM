-- Hard-delete accounts whose 7-day soft-delete grace period has elapsed.
--
-- Flow: the client sets profiles.deleted_at when the user requests deletion and
-- can clear it (undo) any time in the next 7 days. This scheduled job performs
-- the actual, irreversible deletion once the window has passed.

-- pg_cron installs into the "cron" schema and only runs in the default
-- "postgres" database (Supabase's default), so enabling it here is safe.
create extension if not exists pg_cron;

-- Writes an audit row (which survives the cascade because account_deletions.user_id
-- is deliberately not a foreign key), then deletes the auth user. The
-- ON DELETE CASCADE foreign keys on auth.users wipe the profile and every owned
-- row — readings, notes, devices, reminders, support tickets/messages,
-- notification settings — plus auth internals (identities, sessions, tokens).
--
-- Returns the number of accounts deleted (handy for logging / manual runs).
create or replace function public.process_account_deletions()
returns integer
language plpgsql
security definer
set search_path = ''
as $$
declare
  deleted_count integer;
begin
  with expired as (
    select p.id, p.email
    from public.profiles p
    where p.deleted_at is not null
      and p.deleted_at < now() - interval '7 days'
  ),
  audit as (
    insert into public.account_deletions (user_id, email, reason)
    select id, email, 'grace_period_elapsed' from expired
    returning 1
  ),
  removed as (
    delete from auth.users u
    using expired e
    where u.id = e.id
    returning 1
  )
  select count(*) into deleted_count from removed;

  return deleted_count;
end;
$$;

-- Deletion is a privileged background job. Never expose it through the API:
-- strip the default EXECUTE-to-PUBLIC grant so only the owner (postgres, which
-- pg_cron runs as) can invoke it.
revoke execute on function public.process_account_deletions() from public;
revoke execute on function public.process_account_deletions() from anon, authenticated;

-- Remove any prior schedule so re-running this migration is idempotent.
select cron.unschedule(jobid)
from cron.job
where jobname = 'process-account-deletions';

-- Run daily at 03:00 UTC. Daily granularity is plenty for a 7-day window.
select cron.schedule(
  'process-account-deletions',
  '0 3 * * *',
  $$select public.process_account_deletions()$$
);
