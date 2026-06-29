import { Stack } from "expo-router";
// import { useColorScheme } from "react-native";

export default function Layout() {
  const screenOptions = {
    headerBackButtonDisplayMode: "minimal",
  } as const;

  return (
    <Stack screenOptions={screenOptions}>
      {/* Hide the header ONLY for the first screen */}
      <Stack.Screen name="index" options={{ headerShown: true }} />

      {/* Subsequent screens will automatically inherit the default native header */}
      <Stack.Screen name="notes" />
    </Stack>
  );
}
