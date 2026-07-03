import { Stack } from "expo-router";
import { defaultScreenOptions } from "@/theme/screen-options";

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        ...defaultScreenOptions,
        headerTransparent: false,
        headerShadowVisible: false,
      }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
}
