import { Link, Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Platform } from "react-native";
import * as Linking from "expo-linking";
import { Box, Text } from "@/components/primitives";
import { ButtonAuth } from "@/components/button-auth";

// SECOND SCREEN
export default function ForgotPasswordScreen() {
  const router = useRouter();
  //   const { mode } = useLocalSearchParams<{ mode?: "login" | "register" }>();
  //   const isLoginMode = mode !== "register";

  //   const title = isLoginMode ? "Login to your account" : "Create your account";

  return (
    <>
      {/* <Stack.Screen options={{ title }} /> */}
      <Box flex={1} padding="m" gap="m">
        <Text>Check your email</Text>
        <Text>
          sundas@gmail.com is registered with KetoBM, you’ll receive an email
          with a link to reset your password. Don’t forget to check your spam or
          junk folder too.
        </Text>
        <Text>Use phone number instead?</Text>
        {/* <Link href={`/auth?mode=${mode}`} asChild>
          <ButtonAuth title="Continue with email" />
        </Link> */}
        <Text onPress={() => Linking.openURL("message://")}>Open email</Text>
        <Link href="../">Back to login</Link>
      </Box>
    </>
  );
}
