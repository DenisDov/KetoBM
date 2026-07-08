-- A single note attached to a reading. One note per reading by design (the unique
-- constraint on reading_id), so "Add custom note" upserts and "delete note" removes
-- the row. A note is either a picked preset (preset_id) or free-form text (body).
create table public.notes (
  id uuid not null default gen_random_uuid(),

  -- The reading this note annotates. Cascade so deleting a reading removes its note.
  -- Unique: at most one note per reading.
  reading_id uuid not null references public.readings on delete cascade,

  user_id uuid not null references auth.users on delete cascade,

  -- Set when the note is one of the dropdown presets. set null (not cascade) so
  -- retiring/removing a preset keeps the note; pair it with a body backfill if needed.
  preset_id uuid references public.note_presets on delete set null,

  -- Free-form text for a custom note. Null when the note is a plain preset selection.
  body text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  primary key (id),

  -- One note per reading.
  unique (reading_id),

  -- A note must carry content: a preset, custom text, or both.
  constraint notes_has_content check (preset_id is not null or body is not null)
);

-- Notes are fetched by their reading, and listed per user.
create index notes_reading_id_idx on public.notes (reading_id);
create index notes_user_id_idx on public.notes (user_id);

alter table public.notes enable row level security;

grant select, insert, update, delete on public.notes to authenticated;
grant select, insert, update, delete on public.notes to service_role;

-- A user can only see and manage their own notes.
create policy "Notes are viewable by owner"
  on public.notes for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "Notes are insertable by owner"
  on public.notes for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Notes are updatable by owner"
  on public.notes for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "Notes are deletable by owner"
  on public.notes for delete
  to authenticated
  using ((select auth.uid()) = user_id);

-- Keep updated_at fresh on every update (function defined in the profiles schema).
create trigger notes_set_updated_at
  before update on public.notes
  for each row execute procedure public.set_updated_at();
