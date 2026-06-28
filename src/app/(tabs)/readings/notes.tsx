import { Box, Text } from "@/components/primitives";
import { theme } from "@/theme/theme";
import { ScrollView } from "react-native";
import { Stack } from "expo-router";
// import { KETONE_LEVELS, KetoneLevel } from "@/components/ketone-levels";

export default function NotesScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Notes" }} />
      <ScrollView
        contentContainerStyle={{ backgroundColor: theme.colors.background }}
        showsVerticalScrollIndicator={false}>
        <Box padding="m" gap="ml" backgroundColor="background">
          <Text variant="title">Notes here</Text>
          {/* {KETONE_LEVELS.map((level) => (
            <KetoneLevel key={level.label} {...level} />
          ))} */}
        </Box>
      </ScrollView>
    </>
  );
}
