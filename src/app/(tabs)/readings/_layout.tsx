import { Stack } from "expo-router";
// import { useColorScheme } from "react-native";

export default function Layout() {
  // const colorScheme = useColorScheme();
  // const darkMode = colorScheme === "dark";

  const headerOptions = {
    headerTransparent: true,
    headerBackButtonDisplayMode: "minimal",
    headerBackImageSource: require("../../../../assets/icons/arrow-left.png"),
    // headerTintColor: darkMode ? "#fff" : "#000",
  } as const;

  return (
    <Stack screenOptions={{ headerBackButtonDisplayMode: "minimal" }}>
      {/* Hide the header ONLY for the first screen */}
      <Stack.Screen name="index" options={{ headerShown: true }} />

      {/* Subsequent screens will automatically inherit the default native header */}
      <Stack.Screen name="notes" />
    </Stack>
  );
}
