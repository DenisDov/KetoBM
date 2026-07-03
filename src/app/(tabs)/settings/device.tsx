import { Box, Text } from "@/components/primitives";
import { ScrollView } from "react-native";

export default function DeviceSettingsScreen() {
  return (
    <ScrollView scrollEnabled={false}>
      <Box padding="m" gap="m">
        <Text variant="title">Device settings</Text>
      </Box>
    </ScrollView>
  );
}
