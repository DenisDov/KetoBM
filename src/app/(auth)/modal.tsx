import { Link, Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Platform } from "react-native";
import * as Linking from "expo-linking";
import { Box, Text } from "@/components/primitives";
import { ButtonAuth } from "@/components/button-auth";

export default function ModalScreen() {
  const router = useRouter();
  //   const { mode } = useLocalSearchParams<{ mode?: "login" | "register" }>();
  //   const isLoginMode = mode !== "register";

  //   const title = isLoginMode ? "Login to your account" : "Create your account";

  return (
    <>
      {/* <Stack.Screen options={{ title }} /> */}
      <Box flex={1} padding="m" gap="m">
        <Text>LARGE ICON HERE</Text>

        <Text>Your password has been updated</Text>
        <Link href="../">Back to login</Link>
      </Box>
    </>
  );
}
