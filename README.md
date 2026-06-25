Build native iOS app
`bun expo run:ios`
Build native Android app
`bun expo run:android`

After first build, we can use this if we only modify TypeScript code
`bun expo start`

if fail, try

`sh reset.sh`

Install deps:

`bun expo install zustand expo-secure-store`

Install deps to dev:

`bun expo install reactotron-react-native -- --development`

Manage Expo and Supabase envs:

we have 9 Environment variables in EAS. Each env have 3 variables.

we have development, preview and production in EAS

For Supabase we also have three, but local supabase instance running in Docker for work in development. For remote Supabase we have two separate projects: keto-bm-preview and keto-bm-production. Never manually change tables in Supabse dashboard, use only migration files

BUILD AND RUN LOCALLY (WITHOUT EAS):

1. PULL ENV
   `eas env:pull` - then choose desired env
2. prebuild per env (regenerates ios/ and android/ folders)
   `APP_ENV=development npx expo prebuild --clean`
3. RUN
   `APP_ENV=development npx expo run:ios`

FOR RELEASE BUILDS USE EAS:

# Dev

`APP_ENV=development eas build --profile development --platform android --local`

# Preview

`APP_ENV=preview eas build --profile preview --platform android --local`

# Prod

`APP_ENV=production eas build --profile production --platform android --local`
