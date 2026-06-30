import { Box, Text } from "@/components/primitives";
import { Stack } from "expo-router";

export default function AccountSettingsScreen() {
  return (
    <Box flex={1} paddingHorizontal="m">
      <Stack.Screen options={{ title: "Account settings" }} />
      <Text>Account settings</Text>
    </Box>
  );
}
