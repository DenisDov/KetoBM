DROP POLICY "Allow public read access" ON public.todos;
CREATE POLICY "Allow authenticated read access" ON public.todos FOR SELECT TO authenticated USING (true);
