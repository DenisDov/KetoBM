import { Link, Stack, useLocalSearchParams } from "expo-router";
import { Box, Text } from "@/components/primitives";
import { ButtonAuth } from "@/components/button-auth";

export default function AuthCTAScreen() {
  const { mode } = useLocalSearchParams<{ mode?: "login" | "register" }>();
  const isLoginMode = mode !== "register";

  const title = isLoginMode ? "Login to your account" : "Create your account";

  return (
    <>
      <Stack.Screen options={{ title }} />
      <Box flex={1} padding="m" gap="m">
        <ButtonAuth
          title="Continue with Google"
          variant="google"
          onPress={() => null}
        />
        <ButtonAuth
          title="Continue with Apple"
          variant="apple"
          onPress={() => null}
        />
        <Box gap="m" flexDirection="row" alignItems="center" marginVertical="m">
          <Box height={1} backgroundColor="neutral300" flex={1} />
          <Text variant="body">or</Text>
          <Box height={1} backgroundColor="neutral300" flex={1} />
        </Box>
        <Link href={`/auth?mode=${mode}`} asChild>
          <ButtonAuth title="Continue with email" />
        </Link>
      </Box>
    </>
  );
}
