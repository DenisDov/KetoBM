CREATE POLICY "Allow read for anonymous users" ON public.todos FOR SELECT TO anon USING (true);
