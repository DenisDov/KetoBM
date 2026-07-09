import { Ionicons } from "@react-native-vector-icons/ionicons";
import { useTheme } from "@shopify/restyle";
import { useRouter } from "expo-router";
import { Box, Text } from "@/components/primitives";
import { Button } from "@/components/button";
import { Theme } from "@/theme";

export default function PasswordUpdatedScreen() {
  const router = useRouter();
  const theme = useTheme<Theme>();

  return (
    <Box flex={1} padding="m" gap="m">
      <Box flex={1} justifyContent="center" alignItems="center" gap="l">
        <Box
          width={160}
          height={160}
          backgroundColor="neutral50"
          justifyContent="center"
          alignItems="center"
          style={{ borderRadius: 80 }}>
          <Ionicons name="lock-open" size={72} color={theme.colors.blue600} />
        </Box>
        <Text variant="title" textAlign="center">
          Your password has been updated
        </Text>
      </Box>

      <Button title="Back to login" onPress={() => router.replace("/login")} />
    </Box>
  );
}
