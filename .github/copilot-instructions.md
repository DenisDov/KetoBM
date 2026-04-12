# Copilot Instructions for AI Coding Agents

## Project Overview

- **Type:** React Native app using Expo, with iOS and Android native code.
- **Structure:**
  - `src/` — Main app code (components, screens, hooks, utils, app logic)
  - `android/` and `ios/` — Native platform code and configs
  - `assets/` — Images, fonts, icons
  - `supabase/` — Backend config and migrations

## Key Patterns & Conventions

- **Navigation:** Likely handled in `src/app/` (see `_layout.tsx` and tab structure)
- **State Management:** Custom hooks (e.g., `src/hooks/use-auth-store.ts`)
- **Theming:** Themed components in `src/components/Themed.tsx`, color constants in `src/constants/Colors.ts`
- **API/Backend:** Supabase integration in `src/lib/supabase.ts`
- **Component Style:** Functional components, hooks, and TypeScript throughout
- **File Naming:**
  - `+html.tsx`, `+not-found.tsx` — Next.js/Expo Router conventions
  - `[...]` and `(tabs)` — Route grouping and dynamic routing

## Developer Workflows

- **Start App (Expo):**
  ```sh
  npx expo start
  ```
- **iOS Native:**
  - Open `ios/KetoBMDev.xcworkspace` in Xcode for native changes
- **Android Native:**
  - Use Android Studio with `android/` directory
- **Supabase Migrations:**
  - SQL files in `supabase/migrations/`
- **Type Checking:**
  ```sh
  npx tsc --noEmit
  ```
- **Linting:**
  ```sh
  npx eslint .
  ```

## Integration Points

- **Supabase:** Config in `src/lib/supabase.ts` and `supabase/config.toml`
- **Reactotron:** Debugging config in `ReactotronConfig.js`
- **Expo:** Project config in `app.config.ts`, native config in `ios/` and `android/`

## Project-Specific Notes

- **Expo Router** conventions are used for file-based routing in `src/app/`
- **Custom hooks** are preferred for state and logic reuse
- **Assets** are organized by type in `assets/`
- **Native code** is only modified for platform-specific features

## Examples

- To add a new screen: create a `.tsx` file in `src/app/` or a subfolder
- To add a new migration: add a `.sql` file to `supabase/migrations/`

---

**For AI agents:**

- Prefer existing patterns and file locations
- Reference this file for project structure and workflow
- If unsure about a pattern, check similar files in the same directory
