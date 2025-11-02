import { Text, View } from "@/components/Themed";
import { useAuthStore } from "@/hooks/use-auth-store";
import { Button, StyleSheet } from "react-native";

export default function SignInScreen() {
  const { logIn } = useAuthStore();
  return (
    <View style={styles.container}>
      <Text>Sign In Screen</Text>
      <Button title="Sign In" onPress={logIn} />
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
