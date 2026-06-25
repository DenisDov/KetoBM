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

## Environment Variables

We use **9 EAS environment variables** across 3 environments: `development`, `preview`, and `production`.

Each environment has 3 variables (API URLs, keys, etc.).

### Supabase

| Environment   | Instance                             |
| ------------- | ------------------------------------ |
| `development` | Local Docker instance                |
| `preview`     | Remote project: `keto-bm-preview`    |
| `production`  | Remote project: `keto-bm-production` |

> ⚠️ Never manually change tables in the Supabase dashboard. Use migration files only.

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
