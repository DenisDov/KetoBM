import { Text, View } from "@/components/Themed";
import { useAuthStore } from "@/hooks/use-auth-store";
import { Button, StyleSheet } from "react-native";

export default function OnboardingFinalScreen() {
  const { completeOnboarding } = useAuthStore();
  return (
    <View style={styles.container}>
      <Text>Onboarding Screen 2</Text>
      <Button title="Complete Onboarding" onPress={completeOnboarding} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
