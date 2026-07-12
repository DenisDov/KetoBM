import { Box, Text } from "@/components/primitives";
import { ScrollView } from "react-native";

export default function ReminderSettingsScreen() {
  return (
    <ScrollView scrollEnabled={false}>
      <Box padding="m" gap="m">
        <Text variant="title">Reminders</Text>
        <Text>Get reminders to check your ketone levels daily.</Text>
        <Box
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center">
          <Box>
            <Text>Remind me daily</Text>
            <Text>Enable to get reminder</Text>
          </Box>
          <Box>
            <Text>Switch here</Text>
          </Box>
        </Box>
        <Box
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center">
          <Box>
            <Text>08:00 am</Text>
          </Box>
          <Box>
            <Text>Switch here</Text>
          </Box>
        </Box>
        <Box
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center">
          <Box>
            <Text>+ Add another reminder (Open time picker)</Text>
          </Box>
        </Box>
      </Box>
    </ScrollView>
  );
}
