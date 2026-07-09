import { StyleSheet, FlatList, ActivityIndicator } from "react-native";
import { Link } from "expo-router";
import { Box, Text } from "@/components/primitives";

import { useReadings } from "@/hooks/use-readings";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ReadingsScreen() {
  // TODO: check if needed
  const insets = useSafeAreaInsets();
  const { isPending, error, data: readings } = useReadings();

  if (isPending)
    return (
      <Box flex={1} alignItems="center" justifyContent="center" padding="m">
        <ActivityIndicator size="large" />
      </Box>
    );

  if (error)
    return (
      <Box flex={1} alignItems="center" justifyContent="center" padding="m">
        <Text>Error: {error.message}</Text>
      </Box>
    );

  return (
    <FlatList
      // contentInset={insets}
      data={readings}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <Link href="/readings/notes" asChild>
          <Text>
            {item.value} {item.unit}
          </Text>
        </Link>
      )}
      style={styles.flatList}
      contentContainerStyle={styles.flatListContent}
    />
  );
}

const styles = StyleSheet.create({
  flatList: {
    flex: 1,
  },
  flatListContent: {
    padding: 16,
    gap: 8,
  },
});
