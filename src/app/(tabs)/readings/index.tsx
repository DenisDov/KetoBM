import { useEffect, useState } from "react";
import { StyleSheet, FlatList } from "react-native";
import { supabase } from "@/lib/supabase";
import { Stack, Link } from "expo-router";
import { Box, Text } from "@/components/primitives";

export default function ReadingsScreen() {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    getTodos();
  }, []);

  async function getTodos() {
    const { data, error } = await supabase.from("todos").select("*");
    if (error) console.error("Supabase Error Details:", error);
    setTodos(data);
  }
  return (
    <>
      <Stack.Screen options={{ title: "Ketone Readings" }} />
      <FlatList
        data={todos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Box>
            <Link href="/readings/notes" asChild>
              <Text fontSize={24}>Go to Notes</Text>
            </Link>
          </Box>
        )}
        style={styles.flatList}
        contentContainerStyle={styles.flatListContent}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  flatList: {
    flex: 1,
  },
  flatListContent: {
    padding: 16,
    gap: 8,
  },
});
