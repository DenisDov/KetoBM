import { Box, Text } from "@/components/primitives";
import { theme } from "@/theme/theme";
import { ScrollView } from "react-native";
import { Stack } from "expo-router";
import { KETONE_LEVELS, KetoneLevel } from "@/components/ketone-levels";

export default function HelpContentScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Ketone Readings" }} />
      <ScrollView style={{ backgroundColor: theme.colors.background }}>
        <Box backgroundColor="background" paddingHorizontal="m" gap="ml">
          <Text variant="title">What do my ketone readings mean?</Text>
          {KETONE_LEVELS.map((level) => (
            <KetoneLevel key={level.label} {...level} />
          ))}
        </Box>
      </ScrollView>
    </>
  );
}
