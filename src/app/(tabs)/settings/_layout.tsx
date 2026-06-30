import { Stack } from "expo-router";

export default function Layout() {
  const screenOptions = {
    headerBackButtonDisplayMode: "minimal",
  } as const;

  return (
    <Stack screenOptions={screenOptions}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
}
