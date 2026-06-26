CREATE TABLE public.todos (
    id bigint not null primary key,
    title text not null,
    description text
);

ALTER TABLE public.todos ENABLE ROW LEVEL SECURITY;

-- Allow only authenticated users to read data
CREATE POLICY "Allow authenticated read access"
ON public.todos
FOR SELECT
TO authenticated          -- ← only users with a valid JWT
USING (true);

GRANT SELECT ON public.todos TO authenticated;