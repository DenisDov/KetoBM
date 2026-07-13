import { Box, Text } from "@/components/primitives";
import { ScrollView } from "react-native";
import { Ionicons } from "@react-native-vector-icons/ionicons";
import { Link } from "expo-router";

export default function AccountSettingsScreen() {
  return (
    <ScrollView scrollEnabled={false}>
      <Box padding="m" gap="l">
        <Text variant="title">Account settings</Text>
        <Box
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center">
          <Box>
            <Text>Full name (Show modal ?)</Text>
            <Text>Sundas Kayani</Text>
          </Box>
          <Ionicons name="chevron-forward" size={20} />
        </Box>
        <Box
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center">
          <Box>
            <Text>Email address (Show modal ?)</Text>
            <Text>sundas@gmail.com</Text>
          </Box>
          <Ionicons name="chevron-forward" size={20} />
        </Box>
        <Box
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center">
          <Link href="/reset-password">Reset password</Link>
          <Ionicons name="chevron-forward" size={20} />
        </Box>
      </Box>
    </ScrollView>
  );
}
