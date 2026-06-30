import { Box, Text } from "@/components/primitives";
import { Stack } from "expo-router";

export default function ReminderSettingsScreen() {
  return (
    <Box flex={1} paddingHorizontal="m">
      <Stack.Screen options={{ title: "Reminder settings" }} />
      <Text>Reminder settings</Text>
    </Box>
  );
}
