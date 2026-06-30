# Project Setup

## Prerequisites

We use bun as the package manager.

Install all dependencies:

```bash
bun install
```

Install Expo-specific dependencies (ensures version compatibility):

```bash
bun expo install zustand expo-secure-store
```

Install dev dependencies:

```bash
bun expo install reactotron-react-native -- --development
```

---

## Naming Conventions

| Scope                     | Convention   | Example                              |
| ------------------------- | ------------ | ------------------------------------ |
| Directories and files     | `kebab-case` | `use-auth-store.ts`, `auth-cta.tsx`  |
| Variables and functions   | `camelCase`  | `isLoggedIn`, `startAutoRefresh()`   |
| React Native components    | `PascalCase` | `KetoneLevels`, `Box`, `Text`        |

---

## Environment Variables

We use **9 EAS environment variables** across 3 environments: `development`, `preview`, and `production`.

Each environment has 3 variables (API URLs, keys, etc.).

### Supabase

| Environment   | Instance                             |
| ------------- | ------------------------------------ |
| `development` | Local Docker instance                |
| `preview`     | Remote project: `keto-bm-preview`    |
| `production`  | Remote project: `keto-bm-production` |

> ⚠️ Avoid manually creating tables/RLS policies in the dashboard. Make migrations the single source of truth. It prevents local, preview, and production from drifting apart over time.

---

## Running the App

### First run (generates native `ios/` and `android/` folders)

```bash
bun expo run:ios
bun expo run:android
```

### Subsequent runs (TypeScript changes only)

```bash
bun expo start
```

### If something breaks

```bash
sh reset.sh
```

---

## Local Builds (Without EAS)

Use this when you need a local native build for a specific environment.

**Step 1 — Pull env vars** (writes to `.env.local` by default)

```bash
eas env:pull development   # or: preview | production
```

**Step 2 — Prebuild** (regenerates `ios/` and `android/` folders)

```bash
APP_ENV=development npx expo prebuild --clean
```

**Step 3 — Build & Run**

```bash
APP_ENV=development npx expo run:ios
APP_ENV=development npx expo run:android
```

> ⚠️ `--clean` wipes and regenerates native folders. Run one environment at a time.

---

## Release Builds (EAS)

Builds run on EAS servers. Use `--local` to run on your machine instead (experimental).

```bash
# Development
APP_ENV=development eas build --profile development --platform android --local

# Preview
APP_ENV=preview eas build --profile preview --platform android --local

# Production
APP_ENV=production eas build --profile production --platform android --local
```

# Manual migration

https://supabase.com/docs/guides/deployment/managing-environments#manual-migration

1. Create a new migration script
   `supabase migration new new_employee`
2. write SQL statements in this script

```sql
create table public.employees (
  id integer primary key generated always as identity,
  name text
);
```

3. Apply the new migration to local db. Never run it against a remote project.
   `supabase db reset`

4. For remote
   `supabase db push`

### Seeding local db

1. create file in `supabase/seeds/employees.sql`
   then paste into it

2. ```sql
   INSERT INTO public.employees (name) VALUES
     ('Alice Johnson'),
     ('Bob Smith'),
     ('Carol White'),
     ('David Brown');
   ```

3. `supabase db reset`

# Or in Declarative way (Not needed to write manually in migration file)

Decribe desired db in `sql` files

1. Create file in `supabase/schemas/todos.sql`
2. Write

```sql
create table public.todos (
    id bigint not null primary key,
    title text not null
)
```

3. Run `supabase db diff -f todos_table`
4. Apply migration `supabase migration up`

Modify this table

1. Add new `description`column to todos

```sql
create table public.todos (
    id bigint not null primary key,
    title text not null,
    description text
)
```

2. Run `supabase db diff -f add_desription_to_todos`
3. Apply migration `supabase migration up`

# Supabase - working with a team

https://supabase.com/docs/guides/deployment/database-migrations#working-with-a-team

When multiple developers share a Supabase project, a few rules keep migrations from getting out of sync.

The golden rule: never change the remote database directly. Once you're using migrations, all schema changes — even small ones — should go through migration files. Using the Dashboard's SQL editor or Table Editor on your remote database bypasses the migration history, and db push will start failing with sync errors.

## Check all migrations from linked projects

`supabase migration list`

## Scripts

Run specific from `package.json` like `bun run push:preview` to update `preview` project from `development`

## How to push to Supabase prod step by step

1. `bun run link:prod`
2. Check `supabase migration list`
3. `supabase db push`
4. check new appeared tables

## Check which remote project is currently linked

`cat supabase/.temp/project-ref`

or check `API_URL` after run `supabase status`
