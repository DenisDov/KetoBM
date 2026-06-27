import { Box, Text } from "@/components/primitives";
import { useTheme } from "@shopify/restyle";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ScrollView } from "react-native";
import { Theme } from "@/theme/theme";

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const theme = useTheme<Theme>();
  return (
    <ScrollView style={{ backgroundColor: theme.colors.background }}>
      <Box gap="m" flex={1} padding="m">
        <Text>Welcome to the Home Screen</Text>
        <Text>Welcome to the Home Screen</Text>
        <Text>Welcome to the Home Screen</Text>
        <Text>Welcome to the Home Screen</Text>
        <Text>Welcome to the Home Screen</Text>
        <Text>Welcome to the Home Screen</Text>
        <Text>Welcome to the Home Screen</Text>
        <Text>Welcome to the Home Screen</Text>
        <Text>Welcome to the Home Screen</Text>
        <Text>Welcome to the Home Screen</Text>
        <Text>Welcome to the Home Screen</Text>
        <Text>Welcome to the Home Screen</Text>
        <Text>Welcome to the Home Screen</Text>
        <Text>Welcome to the Home Screen</Text>
        <Text>Welcome to the Home Screen</Text>
        <Text>Welcome to the Home Screen</Text>
        <Text>Welcome to the Home Screen</Text>
        <Text>Welcome to the Home Screen</Text>
        <Text>Welcome to the Home Screen</Text>
        <Text>Welcome to the Home Screen</Text>
        <Text>Welcome to the Home Screen</Text>
        <Text>Welcome to the Home Screen</Text>
        <Text>Welcome to the Home Screen</Text>
        <Text>Welcome to the Home Screen</Text>
      </Box>
    </ScrollView>
  );
}
