import { Stack } from "expo-router";
// import { useColorScheme } from "react-native";

export default function Layout() {
  const screenOptions = {
    headerBackButtonDisplayMode: "minimal",
  } as const;

  return (
    <Stack screenOptions={screenOptions}>
      <Stack.Screen name="index" options={{ headerShown: true }} />
      <Stack.Screen name="notes" />
    </Stack>
  );
}
