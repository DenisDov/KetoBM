import { Ionicons } from "@react-native-vector-icons/ionicons";
import { useTheme } from "@shopify/restyle";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "@/components/button";
import { Box, Text } from "@/components/primitives";
import { useAuthStore } from "@/hooks/use-auth-store";
import { Theme } from "@/theme";
import { Fonts } from "@/theme/fonts";

export default function ModalScreen() {
  const router = useRouter();
  const { colors } = useTheme<Theme>();
  const { cancelAccountDeletion } = useAuthStore();
  const [undoing, setUndoing] = useState(false);

  const handleUndo = async () => {
    setUndoing(true);
    try {
      await cancelAccountDeletion();
      router.back();
    } catch {
      // cancelAccountDeletion already surfaces the error to the user.
    } finally {
      setUndoing(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["bottom"]}>
      <Box
        flex={1}
        justifyContent="center"
        alignItems="center"
        padding="l"
        gap="l">
        <Box
          justifyContent="center"
          alignItems="center"
          width={72}
          height={72}
          borderRadius="xl"
          backgroundColor="neutral100">
          <Ionicons name="time-outline" size={36} color={colors.text} />
        </Box>

        <Box gap="s" alignItems="center">
          <Text variant="title" textAlign="center">
            Deletion requested
          </Text>
          <Text
            variant="body"
            color="textSecondary"
            textAlign="center"
            fontFamily={Fonts.regular}>
            We&rsquo;ve received your request to delete your data. Your account
            and associated information will be permanently removed from our
            system within 7 days.
          </Text>
        </Box>
      </Box>

      <Box padding="l" gap="s">
        <Button title="Undo deletion" onPress={handleUndo} disabled={undoing} />
        <Button title="Done" variant="link" onPress={() => router.back()} />
      </Box>

      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
    </SafeAreaView>
  );
}
