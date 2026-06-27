import { Link, Stack, useLocalSearchParams } from "expo-router";
import { PressableOpacity } from "pressto";
import { Box, Text } from "@/components/primitives";

export default function AuthCTAScreen() {
  const { mode } = useLocalSearchParams<{ mode?: "login" | "register" }>();
  const isLoginMode = mode !== "register";

  const title = isLoginMode ? "Login to your account" : "Create your account";

  return (
    <>
      <Stack.Screen options={{ title }} />
      <Box flex={1} backgroundColor="background" padding="m">
        <PressableOpacity>
          <Text>Continue with Google</Text>
        </PressableOpacity>
        <PressableOpacity>
          <Text>Continue with Apple</Text>
        </PressableOpacity>
        <Text>or</Text>
        <Link href={`/auth?mode=${mode}`} asChild>
          <PressableOpacity>
            <Text>Continue with Email</Text>
          </PressableOpacity>
        </Link>
      </Box>
    </>
  );
}
