-- Reference table of predefined note options shown in the "Notes" dropdown when
-- annotating a reading (e.g. "After workout", "Fasted", "Post-meal"). Global
-- lookup data, not user-owned: everyone reads it, only service_role writes it
-- (seeded via migration). A note (public.notes) may point at one of these
-- presets, or carry free-form body text instead.
create table public.note_presets (
  id uuid not null default gen_random_uuid(),

  label text not null,

  -- Display order in the dropdown.
  sort_order smallint not null,

  -- Soft toggle so a preset can be retired without deleting it (and orphaning
  -- the notes that reference it).
  is_active boolean not null default true,

  primary key (id),

  unique (label),
  unique (sort_order)
);

alter table public.note_presets enable row level security;

-- Read-only to clients; writes go through migrations (service_role bypasses RLS).
grant select on public.note_presets to authenticated;
grant select, insert, update, delete on public.note_presets to service_role;

create policy "Note presets are viewable by all authenticated users"
  on public.note_presets for select
  to authenticated
  using (true);
