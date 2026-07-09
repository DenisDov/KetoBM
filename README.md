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

| Scope                   | Convention   | Example                             |
| ----------------------- | ------------ | ----------------------------------- |
| Directories and files   | `kebab-case` | `use-auth-store.ts`, `auth-cta.tsx` |
| Variables and functions | `camelCase`  | `isLoggedIn`, `startAutoRefresh()`  |
| React Native components | `PascalCase` | `KetoneLevels`, `Box`, `Text`       |

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

## Deep links

Testing opening the `reset-password` screen on the `ketobm-dev` scheme (without tokens — the screen will show "This link has expired"):

```bash
bunx uri-scheme open ketobm-dev://reset-password --ios
```

## Supabase Schema Visualizer

http://localhost:54323/project/default/database/schemas

## Run on real IOS device

1. Get your IP address: `ipconfig getifaddr en0` -> `192.168.1.42`
2. Change in `.env.local` - `EXPO_PUBLIC_SUPABASE_URL=http://192.168.1.42:54321`
3. In `supabase/config.toml`, set `[auth] external_url` to the same IP so URLs inside emails (password reset) are reachable from the phone:

   ```toml
   external_url = "http://192.168.1.42:54321/auth/v1"
   ```

4. Restart Supabase so the config applies (config changes are only read on start):

   ```bash
   supabase stop && supabase start
   ```

5. Run `bun expo run:ios --device` (or restart Metro with `bun expo start -c` if the app is already installed — `-c` is needed to pick up `.env.local` changes)

> ⚠️ Both the phone and the Mac must be on the same Wi-Fi network. If your LAN IP changes (DHCP), update `.env.local` **and** `external_url` and restart Supabase.

## Testing password reset

How the flow works: the app calls `resetPasswordForEmail` with `redirectTo: ketobm-dev://reset-password` → Supabase sends an email (locally it lands in **Mailpit**, not a real inbox) → tapping the link hits `/auth/v1/verify`, which consumes the token and redirects to the deep link with recovery tokens in the URL fragment → the app opens `src/app/reset-password.tsx`, exchanges the tokens for a session, and the user sets a new password.

Prerequisites (already in `supabase/config.toml`, but they only apply after a Supabase restart):

- `ketobm-dev://reset-password` listed in `additional_redirect_urls`
- `[auth] external_url` set to your LAN IP (real device only, see above)

### On a real device

1. In the app: **Login → Forgot password?** → enter the account email → you land on "Check your email"
2. On the **phone**, open Safari and go to Mailpit: `http://<your-LAN-IP>:54324`
3. Open the **newest** message and tap the reset link. It must be tapped **on the device** — a Mac can't open `ketobm-dev://`. Links are single-use.
4. iOS asks to open the dev app → the app opens on the Reset password screen → set the new password → "Back to login" → log in with the new password

### On the simulator

The simulator shares the Mac's network, so no LAN IP / `external_url` changes are needed:

1. Request the reset email in the app
2. Open Safari **inside the simulator** → `http://127.0.0.1:54324` → tap the link in the newest message

   Or copy the verify link from Mailpit on the Mac and open it directly:

   ```bash
   xcrun simctl openurl booted "http://127.0.0.1:54321/auth/v1/verify?token=...&type=recovery&redirect_to=ketobm-dev://reset-password"
   ```

### Troubleshooting

| Symptom | Cause |
| --- | --- |
| Email link host is `127.0.0.1` when testing on a device, or link ends with `redirect_to=http://127.0.0.1:3000` | Supabase wasn't restarted after the `config.toml` change (`redirect_to` silently falls back to `site_url` when the requested URL isn't allow-listed) |
| "This link has expired" screen | The link was already used (single-use) or is older than `otp_expiry` (1 h). Request a new email and open the **newest** Mailpit message |
| Deep link doesn't open the app | You're in Expo Go — the `ketobm-dev://` scheme only exists in the dev build (`bun expo run:ios`) |

The reset screen logs `[reset-password] link { url, linkingUrl, hash, ... }` to Metro — check it to see exactly what the app received from the deep link.
