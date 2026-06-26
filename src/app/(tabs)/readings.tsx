import { useEffect, useState } from "react";
import { StyleSheet, FlatList } from "react-native";
import { Text, View } from "@/components/Themed";
import { supabase } from "@/lib/supabase";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ReadingsScreen() {
  const { top, bottom } = useSafeAreaInsets();
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
    <View style={styles.container}>
      <FlatList
        data={todos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <Text>{item.title}</Text>}
        style={styles.flatList}
        contentContainerStyle={[
          styles.flatListContent,
          { paddingTop: top },
          { paddingBottom: Math.max(bottom, 16) },
        ]}
      />
    </View>
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
    paddingHorizontal: 16,
    gap: 8,
  },
});
