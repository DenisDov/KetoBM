import { Box, Text } from "@/components/primitives";
import { ScrollView } from "react-native";
import { Ionicons } from "@react-native-vector-icons/ionicons";
import { Link } from "expo-router";

export default function DeviceSettingsScreen() {
  return (
    <ScrollView scrollEnabled={false}>
      <Box padding="m" gap="m">
        <Text variant="title">Device settings</Text>

        <Box
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center">
          <Box>
            <Text>Paired device</Text>
            <Text>KetoBM</Text>
          </Box>
          <Box flexDirection="row" alignItems="center" gap="s">
            <Box
              width={8}
              height={8}
              backgroundColor="green300"
              borderRadius="xl"
            />
            <Text>Connected</Text>
          </Box>
        </Box>
        <Box
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center">
          <Box>
            <Text>Bluetooth</Text>
            <Text>Enable to connect to device</Text>
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
            <Text>Operating mode</Text>
            <Text>Diabetic or non-diabetic</Text>
          </Box>
          <Box>
            <Text>Select here with options: Diabetic or Non-diabetic</Text>
          </Box>
        </Box>
        <Box
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center">
          <Text>Disconnect meter cta(show alert)</Text>
          <Ionicons name="chevron-forward" size={20} />
        </Box>
        <Box
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center">
          <Link href="/(tabs)/settings/add-new-meter">Add new meter link</Link>
          <Ionicons name="chevron-forward" size={20} />
        </Box>
      </Box>
    </ScrollView>
  );
}
