import { StyleSheet, FlatList, ActivityIndicator } from "react-native";
import { supabase } from "@/lib/supabase";
import { Link } from "expo-router";
import { Text } from "@/components/primitives";

import { useQuery } from "@tanstack/react-query";

export default function ReadingsScreen() {
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

  if (isPending) return <ActivityIndicator />;

  if (error) return <Text>Error: {error.message}</Text>;

  return (
    <FlatList
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
