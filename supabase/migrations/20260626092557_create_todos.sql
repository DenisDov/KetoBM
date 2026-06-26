create table public.todos (
  id bigint not null primary key,
  title text not null,
  description text
);

alter table public.todos enable row level security;

create policy "Allow authenticated read access"
on public.todos
for select
to authenticated
using (true);

grant select on public.todos to authenticated;
