-- One row per auth user, created automatically on signup.
create table public.profiles (
  id uuid not null references auth.users on delete cascade,
  email text,
  first_name text,
  avatar_url text,

  -- Legal acceptance (null until the user accepts).
  terms_accepted_at timestamptz,
  privacy_accepted_at timestamptz,

  -- 4-step onboarding. step 0 = not started, set on completion.
  onboarding_step smallint not null default 0 check (onboarding_step between 0 and 4),
  onboarding_completed_at timestamptz,

  -- Onboarding answers (null until the user reaches the step that asks).
  year_of_birth smallint check (year_of_birth between 1900 and 2100),
  gender text check (gender in ('male', 'female', 'other')),
  primary_goal text check (primary_goal in ('ketogenic_diet', 'diabetes_management', 'both')),
  meter_experience text check (meter_experience in ('none', 'glucose', 'ketone', 'both')),
  supplements text[] not null default '{}',

  -- Soft delete: set when the user requests deletion.
  deleted_at timestamptz,

  guided_tour_completed boolean not null default false,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  primary key (id)
);

-- Enable row level security.
alter table public.profiles enable row level security;

-- Grant the privileges the roles need. anon gets nothing (profiles are private).
-- No delete grant for authenticated: deletion is handled server-side (soft delete + audit).
grant select, insert, update on public.profiles to authenticated;
grant select, insert, update, delete on public.profiles to service_role;

-- A user can only see and change their own row. No delete policy: deletion is
-- handled server-side (soft delete + audit), not by the client.
create policy "Profiles are viewable by owner"
  on public.profiles for select
  to authenticated
  using ((select auth.uid()) = id);

create policy "Profiles are insertable by owner"
  on public.profiles for insert
  to authenticated
  with check ((select auth.uid()) = id);

create policy "Profiles are updatable by owner"
  on public.profiles for update
  to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

-- Keep updated_at fresh on every update.
create function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute procedure public.set_updated_at();

-- Insert a profile row whenever a new auth user is created. coalesce covers the
-- different metadata keys email/password vs. Google/Apple OAuth will populate.
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, email, first_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(
      new.raw_user_meta_data ->> 'first_name',
      new.raw_user_meta_data ->> 'full_name',
      new.raw_user_meta_data ->> 'name'
    ),
    coalesce(
      new.raw_user_meta_data ->> 'avatar_url',
      new.raw_user_meta_data ->> 'picture'
    )
  );
  return new;
end;
$$;

-- Trigger the function every time a user is created.
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
