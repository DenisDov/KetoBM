import { ScrollView } from "react-native";
import { useTheme } from "@shopify/restyle";
import { Box } from "@/components/primitives";
import { DeletionBanner } from "@/components/deletion-banner";
import { ChartCard, GaugeCard, LatestReadings } from "@/components/home";
import { Theme } from "@/theme";

export default function HomeScreen() {
  const theme = useTheme<Theme>();

  return (
    <ScrollView
      style={{ backgroundColor: theme.colors.backgroundMuted }}
      contentInsetAdjustmentBehavior="automatic">
      <DeletionBanner />
      <Box padding="m" gap="m">
        <GaugeCard />
        <LatestReadings />
        <ChartCard />
      </Box>
    </ScrollView>
  );
}
