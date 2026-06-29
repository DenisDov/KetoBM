import { Stack } from "expo-router";
import { Box, Text } from "@/components/primitives";

export default function PolicyScreen() {
  const title = "KetoBM LLC Policy";

  return (
    <>
      <Stack.Screen options={{ title }} />
      <Box flex={1} padding="m" gap="m">
        <Text>
          This Privacy Policy explains how KetoBM LLC ("we," "us," or "our")
          collects, uses, protects, and shares your information when you use our
          KetoBM mobile application (the "App"). The App connects to your ketone
          meter (and potentially glucose meter) to display your readings and
          stores this data in the cloud for your convenience, accessible only to
          you.
        </Text>
      </Box>
    </>
  );
}
