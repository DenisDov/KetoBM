run app

`bunx expo run:ios`
`bunx expo run:android`

if fail, try

`sh reset.sh`

Install deps:

`bunx expo install zustand expo-secure-store`

Install deps to dev:

`bunx expo install reactotron-react-native -- --development`

Manage Expo and Supabase envs:

we have 9 Environment variables in EAS. Each env have 3 variables.

we have development, preview and production in EAS

For Supabase we also have three, but local supabase instance running in Docker for work in development. For remote Supabase we have two separate projects: keto-bm-preview and keto-bm-production. Never manually change tables in Supabse dashboard, use only migration files

Typical work with eas, run:

`eas env:pull` - then choose desired env
