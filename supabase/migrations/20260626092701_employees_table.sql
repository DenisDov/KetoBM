CREATE TABLE public.employees (id integer GENERATED ALWAYS AS IDENTITY NOT NULL, name text);
ALTER TABLE public.employees ADD CONSTRAINT employees_pkey PRIMARY KEY (id);
GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.employees TO anon;
GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.employees TO authenticated;
GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.employees TO service_role;
