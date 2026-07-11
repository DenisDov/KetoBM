import { ScrollView } from "react-native";
import { useTheme } from "@shopify/restyle";
import { Box } from "@/components/primitives";
import { DeletionBanner } from "@/components/deletion-banner";
import { ChartCard, GaugeCard, LatestReadings } from "@/components/home";
import { Theme } from "@/theme";
import { useBLEStore } from "@/hooks/use-ble-store";

export default function HomeScreen() {
  const theme = useTheme<Theme>();

  const {
    connected,
    scanning,
    connecting,
    discoveredDevices,
    deviceState,
    measurementType,
    device,
    progress,
    lastReading,
    error,
    scan,
    stopScan,
    connect,
    disconnect,
    startMeasurement,
    cancelMeasurement,
    clearError,
  } = useBLEStore();

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
