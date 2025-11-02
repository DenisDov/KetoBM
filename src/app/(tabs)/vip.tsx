import { StyleSheet } from "react-native";

import { Text, View } from "@/components/Themed";
import { useAuthStore } from "@/hooks/use-auth-store";

export default function VipScreen() {
  const { logOut } = useAuthStore();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>VIP tab</Text>
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
