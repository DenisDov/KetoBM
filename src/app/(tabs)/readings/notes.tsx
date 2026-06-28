import { Box, Text } from "@/components/primitives";
import { ScrollView } from "react-native";
import { Stack } from "expo-router";

export default function NotesScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Notes" }} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <Box padding="m" gap="ml" backgroundColor="background">
          <Text variant="title">Notes here</Text>
        </Box>
      </ScrollView>
    </>
  );
}
