import { Button, StyleSheet } from "react-native";

import { Text, View } from "@/components/Themed";
import { useAuthStore } from "@/hooks/use-auth-store";

export default function SettingsScreen() {
  const { logOut } = useAuthStore();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      <Button title="Log Out" onPress={logOut} />
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
