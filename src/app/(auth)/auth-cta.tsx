import { useLocalSearchParams, useRouter } from "expo-router";
import { Platform } from "react-native";
import { Box, Text } from "@/components/primitives";
import { ButtonAuth } from "@/components/button-auth";

// SECOND SCREEN
export default function AuthCTAScreen() {
  const { mode } = useLocalSearchParams<{ mode?: "login" | "create" }>();
  console.log("mode", mode);
  const isLoginMode = mode !== "create";
  const router = useRouter();

  const title = isLoginMode ? "Login to your account" : "Create your account";

  const handleSubmit = () => {
    if (isLoginMode) {
      router.push("/(auth)/login");
    } else {
      router.push("/(auth)/create-account");
    }
  };

  return (
    <Box flex={1} padding="m" gap="m">
      <Text variant="title">{title}</Text>
      <Box
        gap="m"
        flexDirection={Platform.OS === "ios" ? "column-reverse" : "column"}>
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
      </Box>
      <Box gap="m" flexDirection="row" alignItems="center" marginVertical="m">
        <Box height={1} backgroundColor="neutral300" flex={1} />
        <Text variant="body">or</Text>
        <Box height={1} backgroundColor="neutral300" flex={1} />
      </Box>
      <ButtonAuth title="Continue with email" onPress={handleSubmit} />
    </Box>
  );
}
