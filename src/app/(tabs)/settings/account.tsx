import { Box, Text } from "@/components/primitives";
import { ScrollView } from "react-native";

export default function AccountSettingsScreen() {
  return (
    <ScrollView scrollEnabled={false}>
      <Box padding="m" gap="m">
        <Text variant="title">Account settings</Text>
      </Box>
    </ScrollView>
  );
}
