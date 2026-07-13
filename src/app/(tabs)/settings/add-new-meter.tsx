import { Box, Text } from "@/components/primitives";
import { ScrollView } from "react-native";
import { useRouter } from "expo-router";

import { Button } from "@/components/button";

export default function DeviceSettingsScreen() {
  const router = useRouter();

  return (
    <ScrollView scrollEnabled={false}>
      <Box padding="m" gap="l">
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
          onPress={() => router.push("/pairing")}
        />
      </Box>
    </ScrollView>
  );
}
