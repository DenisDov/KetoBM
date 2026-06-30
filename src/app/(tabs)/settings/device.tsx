import { Box, Text } from "@/components/primitives";
import { Stack } from "expo-router";

export default function DeviceSettingsScreen() {
  return (
    <Box flex={1} paddingHorizontal="m">
      <Stack.Screen options={{ title: "Device settings" }} />
      <Text>Device settings</Text>
    </Box>
  );
}
