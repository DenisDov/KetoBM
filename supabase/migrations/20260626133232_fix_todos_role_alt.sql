DROP POLICY "Allow read for anonymous users" ON public.todos;
DROP POLICY "Allow read for authenticated users" ON public.todos;
ALTER TABLE public.todos DISABLE ROW LEVEL SECURITY;
