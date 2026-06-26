ALTER TABLE public.todos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow read for authenticated users" ON public.todos FOR SELECT TO authenticated USING (true);
