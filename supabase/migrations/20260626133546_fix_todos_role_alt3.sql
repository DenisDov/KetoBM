ALTER TABLE public.todos ENABLE ROW LEVEL SECURITY;
REVOKE SELECT ON public.todos FROM authenticated;
CREATE POLICY "Allow public read access" ON public.todos FOR SELECT USING (true);
