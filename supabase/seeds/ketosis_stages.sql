-- Seed the ketosis_stages reference table.
--
-- ⚠️ CLINICAL REVIEW REQUIRED: the mmol/L (blood BHB) cutoffs below are common
-- conventions, NOT authoritative medical thresholds. The two modes are DIFFERENT
-- scales, not the same names re-bucketed:
--   * non_diabetic = nutritional-ketosis scale (higher ketones = "deeper", benign)
--   * diabetic     = DKA-risk warning scale (rising ketones = escalating danger)
-- Have a clinician sign off before shipping.
--
-- Ranges are half-open [min_mmol, max_mmol): null min = open lower bound,
-- null max = open upper bound.
--
-- Idempotent so it can re-run on every `supabase db reset`.

insert into public.ketosis_stages
  (mode, stage_name, min_mmol, max_mmol, color, status_label, sort_order)
values
  -- Non-diabetic: nutritional ketosis.
  ('non_diabetic', 'Not in ketosis',   null, 0.5, '#9CA3AF', 'Below ketosis',       0),
  ('non_diabetic', 'Very Light',        0.5, 1.0, '#84CC16', 'Very light ketosis',  1),
  ('non_diabetic', 'Light',             1.0, 1.5, '#22C55E', 'Light ketosis',       2),
  ('non_diabetic', 'Optimal',           1.5, 3.0, '#10B981', 'Optimal ketosis',     3),
  ('non_diabetic', 'Deep Ketosis',      3.0, 5.0, '#3B82F6', 'Deep ketosis',        4),
  ('non_diabetic', 'Fasting Ketosis',   5.0, 8.0, '#8B5CF6', 'Fasting ketosis',     5),
  ('non_diabetic', 'Ketoacidosis',      8.0, null, '#EF4444', 'Danger — seek care', 6),

  -- Diabetic: DKA-risk scale (distinct stage set — do not reuse the labels above).
  ('diabetic',     'Not in ketosis',   null, 0.6, '#22C55E', 'Normal',              0),
  ('diabetic',     'Slightly Elevated', 0.6, 1.5, '#EAB308', 'Caution — retest',    1),
  ('diabetic',     'High Risk',         1.5, 3.0, '#F97316', 'High risk of DKA',    2),
  ('diabetic',     'Ketoacidosis',      3.0, null, '#EF4444', 'Emergency — seek care', 3)
on conflict (mode, stage_name) do update set
  min_mmol     = excluded.min_mmol,
  max_mmol     = excluded.max_mmol,
  color        = excluded.color,
  status_label = excluded.status_label,
  sort_order   = excluded.sort_order;
