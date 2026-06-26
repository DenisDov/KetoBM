# Local Supabase migrations

This project uses local Docker Supabase for learning, so these migrations are a
clean baseline instead of immutable production history.

Keep migrations in this flat directory, ordered by timestamp. Supabase tracks
applied migrations by filename, so only squash or rename files when the local
database can be reset.

Current baseline:

- `20260626092557_create_todos.sql`
- `20260626092701_create_employees.sql`

Readable schema references live in:

- `../schemas/todos.sql`
- `../schemas/employees.sql`

After changing migration history, run a local Supabase reset so the migration
tracking table matches the files on disk.
