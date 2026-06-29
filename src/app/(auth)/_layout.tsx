import { Stack } from "expo-router";

const screenOptions = {
  headerLargeTitle: true,
  headerTransparent: false,
  headerBackButtonDisplayMode: "minimal",
} as const;

export default function Layout() {
  return (
    <Stack screenOptions={screenOptions}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen
        name="policy"
        options={{
          headerLargeTitle: false,
          title: "",
          headerShadowVisible: false,
        }}
      />
    </Stack>
  );
}
