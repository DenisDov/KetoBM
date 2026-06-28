import { Box, Text } from "@/components/primitives";
import { StyleSheet } from "react-native";

export default function OnboardingFinalScreen() {
  // const { completeOnboarding } = useAuthStore();
  return (
    <Box style={styles.container}>
      <Text>Onboarding Screen 2</Text>
      {/* <Button title="Complete Onboarding" onPress={completeOnboarding} /> */}
    </Box>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
