import { Text, View } from "@/components/Themed";
import { useAuthStore } from "@/hooks/use-auth-store";
import Constants from "expo-constants";
import { Button, StyleSheet } from "react-native";

export default function TabOneScreen() {
  const { env } = Constants.expoConfig?.extra ?? {};
  console.log("Running in:", env);

  const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
  console.log("SUPABASE URL:", supabaseUrl);

  const { user, signOut } = useAuthStore();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ENV:{env}</Text>
      <Text style={styles.title}>SUPABASE URL:{supabaseUrl}</Text>
      <View style={styles.separator} />
      <Text style={styles.title}>User:{user?.email}</Text>
      <Button title="Log Out" onPress={signOut} />
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
  separator: {
    marginVertical: 30,
    height: StyleSheet.hairlineWidth,
    width: "80%",
    backgroundColor: "lightgray",
  },
});
