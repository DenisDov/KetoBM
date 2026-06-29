import { Stack } from "expo-router";

export default function Layout() {
  const screenOptions = {
    headerBackButtonDisplayMode: "minimal",
    title: "",
  } as const;

  return (
    <Stack screenOptions={screenOptions}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="content" />
    </Stack>
  );
}
