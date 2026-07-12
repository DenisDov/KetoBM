import { Box, Text } from "@/components/primitives";
import { ScrollView } from "react-native";
import { Ionicons } from "@react-native-vector-icons/ionicons";

import { Button } from "@/components/button";

export default function DeviceSettingsScreen() {
  return (
    <ScrollView scrollEnabled={false}>
      <Box padding="m" gap="m">
        <Box>
          <Text variant="title">Add new meter</Text>
        </Box>
        <Text>Meter img</Text>
        <Text>
          Note: Please disconnect or remove any previously paired meter before
          adding a new one
        </Text>
        <Button
          title="Connect your new meter"
          onPress={() => console.log("link back to new user journey")}
        />
      </Box>
    </ScrollView>
  );
}
