import { Stack } from "expo-router";
import { defaultScreenOptions } from "@/theme/screen-options";

export default function Layout() {
  return (
    <Stack screenOptions={defaultScreenOptions}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen
        name="video"
        options={{ headerShown: false, presentation: "fullScreenModal" }}
      />
    </Stack>
  );
}
