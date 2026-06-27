import { Box, Text } from "@/components/primitives";
import { Link } from "expo-router";
import { ScrollView } from "react-native";
import { Theme } from "@/theme/theme";
import { useTheme } from "@shopify/restyle";

export default function HelpScreen() {
  const theme = useTheme<Theme>();
  return (
    <ScrollView
      style={{ backgroundColor: theme.colors.background }}
      contentContainerStyle={{ paddingBottom: theme.spacing.m }}>
      <Box gap="m" flex={1} padding="m">
        <Link href="/help/content" asChild>
          <Text fontSize={24}>Go to Help Content</Text>
        </Link>
      </Box>
    </ScrollView>
  );
}
