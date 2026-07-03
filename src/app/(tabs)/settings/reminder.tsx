import { Box, Text } from "@/components/primitives";
import { ScrollView } from "react-native";

export default function ReminderSettingsScreen() {
  return (
    <ScrollView scrollEnabled={false}>
      <Box padding="m" gap="m">
        <Text variant="title">Reminder settings</Text>
      </Box>
    </ScrollView>
  );
}
