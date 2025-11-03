import { Text, View } from "@/components/Themed";
import Constants from "expo-constants";
import { StyleSheet } from "react-native";

export default function TabOneScreen() {
  const { env } = Constants.expoConfig?.extra ?? {};
  console.log("Running in:", env);

  const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL
  console.log("SUPABASE URL:", supabaseUrl);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home tab</Text>
      <Text style={styles.title}>ENV:{env}</Text>
      <Text style={styles.title}>SUPABASE URL:{supabaseUrl}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
});
