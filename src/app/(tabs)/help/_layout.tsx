import { Stack } from "expo-router";

export default function Layout() {
  const screenOptions = {
    headerBackButtonDisplayMode: "minimal",
  } as const;

  return (
    <Stack screenOptions={screenOptions}>
      <Stack.Screen name="index" options={{ title: "Help" }} />

      {/* Subsequent screens will automatically inherit the default native header */}
      <Stack.Screen name="content" />
    </Stack>
  );
}
