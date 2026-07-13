-- Align the non_diabetic ketosis stages with the dev-ready design and the
-- Help-tab content (src/components/ketone-levels.tsx): the original seed used
-- different ranges (e.g. Optimal 1.5–3.0, Ketoacidosis 8.0+) and generic hex
-- colors. Ranges stay half-open [min_mmol, max_mmol); colors come from the app
-- theme palette. Diabetic rows are intentionally untouched.

UPDATE public.ketosis_stages
SET stage_name = 'Not in ketosis', min_mmol = NULL, max_mmol = 0.1, color = '#FDA99D'
WHERE mode = 'non_diabetic' AND sort_order = 0;

UPDATE public.ketosis_stages
SET stage_name = 'Very light', min_mmol = 0.1, max_mmol = 0.6, color = '#F7D882'
WHERE mode = 'non_diabetic' AND sort_order = 1;

UPDATE public.ketosis_stages
SET stage_name = 'Light', min_mmol = 0.6, max_mmol = 1.0, color = '#A5CE97'
WHERE mode = 'non_diabetic' AND sort_order = 2;

UPDATE public.ketosis_stages
SET stage_name = 'Optimal', min_mmol = 1.0, max_mmol = 2.1, color = '#59E794'
WHERE mode = 'non_diabetic' AND sort_order = 3;

UPDATE public.ketosis_stages
SET stage_name = 'Deep Ketosis', min_mmol = 2.1, max_mmol = 3.0, color = '#61A685'
WHERE mode = 'non_diabetic' AND sort_order = 4;

UPDATE public.ketosis_stages
SET stage_name = 'Fasting Ketosis', min_mmol = 3.0, max_mmol = 5.0, color = '#F1BD6C'
WHERE mode = 'non_diabetic' AND sort_order = 5;

UPDATE public.ketosis_stages
SET stage_name = 'Ketoacidosis', min_mmol = 5.0, max_mmol = NULL, color = '#FA7272'
WHERE mode = 'non_diabetic' AND sort_order = 6;
