CREATE TABLE public.todos (id bigint NOT NULL, title text NOT NULL, description text);
ALTER TABLE public.todos ADD CONSTRAINT todos_pkey PRIMARY KEY (id);
GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.todos TO anon;
GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.todos TO authenticated;
GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.todos TO service_role;
