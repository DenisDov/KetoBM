import { Text, View } from "@/components/Themed";
import { StyleSheet } from "react-native";

export default function CreateAccountScreen() {
  return (
    <View style={styles.container}>
      <Text>Create Account Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
