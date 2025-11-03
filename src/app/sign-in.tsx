import { Text, View } from "@/components/Themed";
import { useAuthStore } from "@/hooks/use-auth-store";
import { Button, StyleSheet } from "react-native";

export default function SignInScreen() {
  const { signInWithEmail, signUpWithEmail, signInWithGoogle, signInWithApple } = useAuthStore();
  return (
    <View style={styles.container}>
      <Text>Sign In Screen</Text>
      <Button title="create account with Email" onPress={() => signUpWithEmail('test@test.com', 'test123')} />
      <Button title="login with Email" onPress={() => signInWithEmail('test@test.com', 'test123')} />
      <Button title="Sign In with Google" onPress={signInWithGoogle} />
      <Button title="Sign In with Apple" onPress={signInWithApple} />
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
