import { Stack } from "expo-router";

export default function Layout() {
  const screenOptions = {
    title: "",
    headerTransparent: true,
    headerBackImageSource: require("@/assets/icons/arrow-left.png"),
    headerBackButtonDisplayMode: "minimal",
  } as const;

  return (
    <Stack screenOptions={screenOptions}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen
        name="video"
        options={{ headerShown: false, presentation: "fullScreenModal" }}
      />
    </Stack>
  );
}
