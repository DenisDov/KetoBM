import { Box, Text } from "@/components/primitives";
import { useAuthStore } from "@/hooks/use-auth-store";
import { Button } from "react-native";

export default function SettingsScreen() {
  const { user, signOut } = useAuthStore();

  return (
    <Box
      flex={1}
      backgroundColor="background"
      padding="m"
      justifyContent="center"
      alignItems="center">
      <Text fontSize={24}>User:{user?.email}</Text>
      <Button title="Log Out" onPress={signOut} />
    </Box>
  );
}
