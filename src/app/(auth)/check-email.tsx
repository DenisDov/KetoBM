import { Platform } from "react-native";
import * as Linking from "expo-linking";
import { Ionicons } from "@react-native-vector-icons/ionicons";
import { useTheme } from "@shopify/restyle";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Box, Text } from "@/components/primitives";
import { Button } from "@/components/button";
import { Theme } from "@/theme";

export default function CheckEmailScreen() {
  const { email } = useLocalSearchParams<{ email: string }>();
  const router = useRouter();
  const theme = useTheme<Theme>();

  const openEmailApp = () => {
    // "message://" opens the iOS Mail app; Android has no universal inbox
    // URL, so fall back to the mail handler via mailto:.
    const url = Platform.OS === "ios" ? "message://" : "mailto:";
    Linking.openURL(url).catch(() => {});
  };

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
          <Ionicons name="mail-open" size={72} color={theme.colors.primary} />
        </Box>
        <Text variant="title">Check your email</Text>
        <Text textAlign="center">
          {email} is registered with KetoBM, you’ll receive an email with a link
          to reset your password. Don’t forget to check your spam or junk folder
          too.
        </Text>
      </Box>

      <Button title="Open email" onPress={openEmailApp} />
      <Button
        title="Back to login"
        variant="secondary"
        onPress={() => router.dismissTo("/login")}
      />
    </Box>
  );
}
