# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

KetoBM — Expo / React Native app (Expo Router, file-based routing), TypeScript, Supabase backend.

## Commands

Package manager: **bun**.

```bash
bun install                 # install deps
bun expo start               # dev server (TS-only changes, after first native build)
bun expo run:ios              # first run / native changes — generates ios/
bun expo run:android          # first run / native changes — generates android/
bun expo start --web          # web
bunx expo lint                 # lint (alias: bun run lint)
bunx expo-doctor                # doctor (alias: bun run doctor)
bunx expo install --fix          # fix dependency versions (alias: bun run fix:deps)
sh reset.sh                       # nuke caches/native folders if something's broken
```

No test runner is configured beyond `react-test-renderer` being present as a devDependency; there is one legacy test file (`src/components/__tests__/StyledText-test.js`) but no test script in package.json.

### Env vars / local builds

3 EAS environments: `development`, `preview`, `production`. `APP_ENV` selects the env (read in [app.config.ts](app.config.ts) and used to pick bundle id/scheme/name per environment).

```bash
eas env:pull development                 # writes .env.local
APP_ENV=development npx expo prebuild --clean   # regenerate ios/ android/
APP_ENV=development npx expo run:ios
```

### Supabase

- `development` → local Docker instance
- `preview` → remote project `keto-bm-preview`
- `production` → remote project `keto-bm-production`

Schema changes must go through migrations — never edit tables/RLS directly in the dashboard (causes drift, breaks `db push`).

```bash
supabase migration new <name>             # write SQL by hand, OR:
# Declarative: edit supabase/schemas/*.sql, then:
supabase db diff -f <name>
supabase migration up
supabase db reset                          # apply locally only, never on remote
supabase migration list                     # check sync status of linked project
bun run link:preview / link:prod            # link CLI to a remote project
bun run push:preview / push:prod            # push migrations to remote
cat supabase/.temp/project-ref               # check which project is currently linked
```

## Architecture

- **Routing**: `src/app/` is Expo Router file-based routing (typed routes enabled). Route groups: `(auth)` for landing/login/signup/password-reset request, `(tabs)` for the main authenticated tab navigator (`NativeTabs`), `onboarding/`. [src/app/_layout.tsx](src/app/_layout.tsx) is the root layout — it gates the whole nav tree with `Stack.Protected` based on auth state (`(tabs)` when logged in + terms accepted + onboarded, `onboarding` when not yet onboarded, `terms` when terms not accepted, `(auth)` when logged out), loads custom fonts, and wires up both the Restyle theme provider and the navigation theme adapter. `policy`, `reset-password`, and `password-updated` are deliberately unguarded root routes — the latter two are password-reset deep-link targets that must survive the auth-state flip when the recovery link signs the user in.
- **Auth**: [src/hooks/use-auth-store.ts](src/hooks/use-auth-store.ts) is a zustand store wrapping Supabase auth (login/register/signOut, session restore, listens to `onAuthStateChange`). Google/Apple OAuth methods exist but are stubbed (commented out). This store is the single source of truth for `isLoggedIn` used in the root layout's route guards.
- **Supabase client**: [src/lib/supabase.ts](src/lib/supabase.ts) — uses `expo-sqlite/localStorage/install` as the auth storage adapter (not AsyncStorage/SecureStore), and toggles `auth.startAutoRefresh/stopAutoRefresh` on app foreground/background (native only).
- **Theming**: Built on `@shopify/restyle`, not StyleSheet. [src/theme/theme.ts](src/theme/theme.ts) defines the palette, light/dark `colors`, spacing/borderRadii scales, breakpoints (`phone`/`tablet`), and text variants. `darkTheme` is derived by overriding select color tokens on top of `theme`. Root layout picks light/dark theme via `useColorScheme()`. Custom fonts are defined in `src/theme/fonts.ts` and loaded in the root layout. `textVariants.defaults` already sets `fontSize: 14` (phone) / `16` (tablet), `fontFamily`, and `color: "text"` — don't pass these as explicit props on `<Text>` (e.g. `fontSize={14}`) unless overriding away from the default/variant value; it's redundant and drifts silently if the theme default changes.
- **Primitives**: `src/components/primitives/` (`box.ts`, `text.ts`, `image-box.ts`) are restyle `createBox`/`createText` wrappers — prefer these (`<Box>`, `<Text variant="title">`) over raw RN `View`/`Text` + StyleSheet anywhere theme tokens apply.
- **Path alias**: `@/*` maps to `src/*` (see [tsconfig.json](tsconfig.json)).
- **Multi-environment config**: [app.config.ts](app.config.ts) drives bundle identifiers, app name/icon, and scheme per `APP_ENV` (dev/preview/prod each get distinct bundle ids so they can coexist on a device).
- **Native projects**: `ios/` and `android/` are generated by `expo prebuild` — don't hand-edit unless intentionally ejecting further; prefer config plugins in `app.config.ts`.

## Naming conventions

- **Directories and files**: `kebab-case` (e.g. `use-auth-store.ts`, `auth-cta.tsx`).
- **Variables and functions**: `camelCase` (e.g. `isLoggedIn`, `startAutoRefresh`).
- **React Native components**: `PascalCase` (e.g. `KetoneLevels`, `Box`, `Text`).

## React 19

We're on React 19 — `ref` is a regular prop, so don't use `forwardRef`. Destructure `ref` directly and type it as `Ref<T>` (from `"react"`):

```tsx
export const TextField = ({
  label,
  ref,
  ...rest
}: TextFieldProps & { ref?: Ref<TextInput> }) => {
  return <TextInput ref={ref} {...rest} />;
};
```
