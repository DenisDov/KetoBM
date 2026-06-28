import { Box, Text } from "@/components/primitives";
import { Link } from "expo-router";
import { Button, StyleSheet } from "react-native";

export default function OnboardingFirstScreen() {
  return (
    <Box style={styles.container}>
      <Text>Onboarding Screen 1</Text>
      <Link href="/onboarding/final" asChild push>
        <Button title="Go to final screen" />
      </Link>
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
