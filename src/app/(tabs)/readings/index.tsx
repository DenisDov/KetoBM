import { StyleSheet, FlatList, ActivityIndicator } from "react-native";
import { supabase } from "@/lib/supabase";
import { Link } from "expo-router";
import { Box, Text } from "@/components/primitives";

import { useQuery } from "@tanstack/react-query";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ReadingsScreen() {
  // TODO: check if needed
  const insets = useSafeAreaInsets();
  const {
    isPending,
    error,
    data: todos,
  } = useQuery({
    queryKey: ["todos"],
    queryFn: async () => {
      const { data, error } = await supabase.from("todos").select("*");
      // .eq('user_id', userId)
      // .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

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
      contentInset={insets}
      data={todos}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <Link href="/readings/notes" asChild>
          <Text>{item.title}</Text>
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
