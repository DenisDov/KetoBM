-- Seed the note_presets reference table (the "Note (Optional)" dropdown options).
--
-- Labels match the readings/note design mocks.
--
-- Idempotent so it can re-run on every `supabase db reset`, and safe on a
-- database seeded with an older preset list: sort_order is unique, so retired
-- rows are first parked on negative values to free the 0..n range.

update public.note_presets
set is_active  = false,
    sort_order = -(sort_order + 1)
where sort_order >= 0
  and label not in ('After meal', 'Fast after waking up', 'After workout', 'Long fast');

insert into public.note_presets
  (label, sort_order, is_active)
values
  ('After meal',           0, true),
  ('Fast after waking up', 1, true),
  ('After workout',        2, true),
  ('Long fast',            3, true)
on conflict (label) do update set
  sort_order = excluded.sort_order,
  is_active  = excluded.is_active;
