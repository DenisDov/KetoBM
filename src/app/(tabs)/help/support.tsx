import { Box, Text } from "@/components/primitives";
import { ScrollView } from "react-native";

export default function SupportScreen() {
  return (
    <ScrollView>
      <Box gap="m" flex={1} padding="m">
        <Text variant="title">Support (chat here)</Text>
        <Box padding="m" borderRadius="s" backgroundColor="neutral100">
          <Text>
            Welcome to KetoBM Support! Ask us anything — from using the app to
            understanding your ketone levels. (First massage, seems hardcoded if
            chat has no messages yet)
          </Text>
        </Box>
      </Box>
    </ScrollView>
  );
}
