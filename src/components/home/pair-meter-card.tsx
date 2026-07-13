import { Ionicons } from "@react-native-vector-icons/ionicons";
import { useTheme } from "@shopify/restyle";
import { useRouter } from "expo-router";
import { Button } from "@/components/button";
import { Box, Text } from "@/components/primitives";
import { boxShadows, Theme } from "@/theme";
import { Fonts } from "@/theme/fonts";

/**
 * Home hero shown before any meter is paired: replaces the empty gauge with a
 * call-to-action that opens the pairing wizard.
 */
export const PairMeterCard = () => {
  const theme = useTheme<Theme>();
  const router = useRouter();

  return (
    <Box
      backgroundColor="background"
      borderRadius="m"
      padding="l"
      gap="m"
      alignItems="center"
      style={{ boxShadow: boxShadows.card }}>
      <Box
        width={72}
        height={72}
        borderRadius="xl"
        alignItems="center"
        justifyContent="center"
        backgroundColor="backgroundMuted">
        <Ionicons name="bluetooth" size={36} color={theme.colors.primary} />
      </Box>
      <Text fontSize={20} fontFamily={Fonts.semiBold} textAlign="center">
        Connect your KetoBM meter
      </Text>
      <Text color="textSecondary" textAlign="center">
        Pair your meter over Bluetooth to see your glucose and ketone readings
        here.
      </Text>
      <Box alignSelf="stretch">
        <Button
          title="Connect device"
          onPress={() => router.push("/pairing")}
          iconBefore={
            <Ionicons name="bluetooth" size={18} color={theme.colors.white} />
          }
        />
      </Box>
    </Box>
  );
};
