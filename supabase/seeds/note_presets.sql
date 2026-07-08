-- Seed the note_presets reference table (the "Notes" dropdown options).
--
-- ⚠️ Placeholder labels — confirm the final wording/ordering with product/design
-- before shipping.
--
-- Idempotent so it can re-run on every `supabase db reset`.

insert into public.note_presets
  (label, sort_order, is_active)
values
  ('Fasted',        0, true),
  ('Post-meal',     1, true),
  ('After workout', 2, true),
  ('Feeling low',   3, true),
  ('Feeling great', 4, true),
  ('Sick',          5, true)
on conflict (label) do update set
  sort_order = excluded.sort_order,
  is_active  = excluded.is_active;
