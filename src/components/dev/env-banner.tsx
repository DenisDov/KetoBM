import Constants from "expo-constants";
import { Box, Text } from "@/components/primitives";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const ENV_COLORS: Record<string, string> = {
  development: "#FFD700",
  preview: "#87CEEB",
  production: "#98FB98",
};

export function EnvBanner() {
  const { env } = Constants.expoConfig?.extra ?? {};
  const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
  const { top } = useSafeAreaInsets();

  return (
    <Box
      position="absolute"
      top={0}
      zIndex={1}
      style={{
        marginTop: top,
        backgroundColor: ENV_COLORS[env] ?? "#000",
      }}>
      <Text color="neutral900">ENV: {env}</Text>
      <Text color="neutral900">SUPABASE URL: {supabaseUrl}</Text>
    </Box>
  );
}
