import { Link } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Box, Text, ImageBox } from "@/components/primitives";
import { WaveDivider } from "@/components/wave-divider";
import { Button } from "@/components/button";
import { EnvBanner } from "@/components/dev/env-banner";
import { Fonts } from "@/theme/fonts";

// FIRST SCREEN
export default function LandingScreen() {
  const { bottom } = useSafeAreaInsets();

  return (
    <Box flex={1} justifyContent="flex-end">
      {__DEV__ ? <EnvBanner /> : null}

      <ImageBox flex={1} source={require("@/assets/images/landing.jpg")} />

      <Box paddingHorizontal="m" style={{ paddingBottom: bottom }}>
        <WaveDivider />
        <Text fontSize={24} textAlign="center" fontFamily={Fonts.bold}>
          {"Track your ketones and \n glucose. Own your health"}
        </Text>
        <Text textAlign="center" marginTop="m" marginBottom="l">
          {
            "Connect your KetoBM meter and see real- \n time readings on your phone."
          }
        </Text>
        <Box gap="m">
          <Link href="/auth-cta?mode=create" asChild>
            <Button title="Create account" />
          </Link>
          <Link href="/auth-cta?mode=login" asChild>
            <Button title="Login" variant="secondary" />
          </Link>
        </Box>
      </Box>
    </Box>
  );
}
