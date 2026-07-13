import { Ionicons } from "@react-native-vector-icons/ionicons";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useTheme } from "@shopify/restyle";
import { router } from "expo-router";
import { useRef, useState } from "react";
import { useBLEStore } from "@/hooks/use-ble-store";
import { Box, PressableBox, Text } from "@/components/primitives";
import { boxShadows, Theme } from "@/theme";
import { Fonts } from "@/theme/fonts";
import { isDarkColor } from "@/utils/colors";
import { formatReadingTimestamp } from "@/utils/datetime";
import {
  findStageForValue,
  useActiveDevice,
  useKetosisMode,
  useKetosisStages,
  useLatestReadings,
} from "@/hooks/use-readings";
import { Gauge, GLUCOSE_GAUGE_SCALE, KETONE_GAUGE_SCALE } from "./gauge";
import { PairMeterCard } from "./pair-meter-card";
import { StageInfoSheet } from "./stage-info-sheet";

/**
 * Hero card: connection status, the reading dial for the most recent
 * measurement (either type), and its timestamp.
 *
 * The dial is theme-blue by default. In non-diabetic mode a ketone reading gets
 * a dial colored by its ketosis stage plus a stage badge. Diabetic mode keeps
 * the plain blue dial with just the value + unit — no stage badge. The mode
 * comes from the active meter's `operating_mode` (see `useKetosisMode`).
 */
export const GaugeCard = () => {
  const theme = useTheme<Theme>();
  const mode = useKetosisMode();

  const { data: readings, isPending } = useLatestReadings(1);
  const { data: device, isPending: devicePending } = useActiveDevice();
  const { data: stages } = useKetosisStages(mode);

  const stageSheetRef = useRef<BottomSheetModal>(null);

  // Dial diameter tracks the card's inner width so the tick labels get the
  // same breathing room from the center content on every screen size.
  const [gaugeSize, setGaugeSize] = useState(280);

  // Live measurement in progress (physical button-press on the meter).
  const deviceState = useBLEStore((state) => state.deviceState);
  const bleProgress = useBLEStore((state) => state.progress);
  const bleType = useBLEStore((state) => state.measurementType);
  const measuring = deviceState === "measuring";

  const reading = readings?.[0] ?? null;
  const isKetone = reading?.type === "ketone";
  const scale = isKetone ? KETONE_GAUGE_SCALE : GLUCOSE_GAUGE_SCALE;

  // Only non-diabetic mode gets a stage-colored dial + badge. Diabetic mode
  // shows a plain blue dial with just the value + unit underneath.
  const stage =
    isKetone && mode === "non_diabetic" && reading
      ? findStageForValue(stages, reading.value)
      : undefined;

  // Non-diabetic ketone dial takes the stage color; everything else stays blue.
  const gaugeColor =
    isKetone && mode === "non_diabetic" && stage?.color
      ? stage.color
      : theme.colors.primary;

  const connected = device?.connection_status === "connected";

  // No meter paired yet — prompt the user to connect one instead of showing an
  // empty dial they can't do anything with. Wait for the query to resolve so a
  // returning user's gauge doesn't flash the CTA on load.
  if (!device && !devicePending) {
    return <PairMeterCard />;
  }

  return (
    <Box
      backgroundColor="background"
      borderRadius="m"
      padding="m"
      gap="s"
      style={{ boxShadow: boxShadows.card }}>
      <Box
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between">
        <Box flexDirection="row" alignItems="center" gap="s">
          <Ionicons
            name="bluetooth"
            size={16}
            color={connected ? theme.colors.success : theme.colors.error}
          />
          <Text>{connected ? "Connected" : "Disconnected"}</Text>
        </Box>
        {/* Annotates the latest reading; inert until one exists. */}
        <PressableBox
          flexDirection="row"
          alignItems="center"
          gap="s"
          paddingVertical="s"
          paddingHorizontal="sm"
          borderRadius="s"
          borderWidth={1}
          borderColor="border"
          opacity={reading ? 1 : 0.4}
          disabled={!reading}
          onPress={() => reading && router.push(`/note/${reading.id}`)}>
          <Ionicons
            name="document-text-outline"
            size={16}
            color={theme.colors.text}
          />
          <Text>Add note</Text>
        </PressableBox>
      </Box>

      <Box
        onLayout={(event) => {
          const { width } = event.nativeEvent.layout;
          if (width > 0) setGaugeSize(Math.min(Math.round(width), 360));
        }}>
        <Gauge
          value={reading?.value ?? null}
          scale={scale}
          color={gaugeColor}
          trackColor={theme.colors.neutral200}
          tickColor={theme.colors.neutral300}
          labelColor={theme.colors.textSecondary}
          markerColor={theme.colors.text}
          size={gaugeSize}>
          <Box alignItems="center" gap="s" style={{ marginTop: 24 }}>
            <Text letterSpacing={1} color="primary" fontFamily={Fonts.semiBold}>
              {(measuring ? bleType === "ketone" : isKetone)
                ? "KETONES"
                : "GLUCOSE"}
            </Text>
            {measuring ? (
              <>
                <Text fontSize={48} lineHeight={52} fontFamily={Fonts.bold}>
                  {bleProgress}%
                </Text>
                <Text fontSize={16} color="textSecondary">
                  Measuring…
                </Text>
              </>
            ) : (
              <>
                <Text fontSize={48} lineHeight={52} fontFamily={Fonts.bold}>
                  {reading
                    ? isKetone
                      ? reading.value.toFixed(1)
                      : Math.round(reading.value)
                    : "--"}
                </Text>
                {stage ? (
                  <PressableBox
                    flexDirection="row"
                    alignItems="center"
                    gap="s"
                    paddingHorizontal="sm"
                    paddingVertical="s"
                    borderRadius="xl"
                    // Stage names come from the DB, so cap the pill before it
                    // reaches the dial's tick labels.
                    maxWidth={gaugeSize * 0.55}
                    style={{
                      backgroundColor: stage.color ?? theme.colors.primary,
                    }}
                    onPress={() => stageSheetRef.current?.present()}>
                    <Text
                      fontSize={13}
                      fontFamily={Fonts.medium}
                      numberOfLines={1}
                      style={{
                        flexShrink: 1,
                        color: isDarkColor(stage.color ?? "#000000")
                          ? theme.colors.white
                          : theme.colors.neutral900,
                      }}>
                      {stage.stage_name}
                    </Text>
                    <Ionicons
                      name="information-circle"
                      size={16}
                      color={
                        isDarkColor(stage.color ?? "#000000")
                          ? theme.colors.white
                          : theme.colors.neutral900
                      }
                    />
                  </PressableBox>
                ) : (
                  <Text fontSize={16} color="textSecondary">
                    {reading?.unit ?? (isPending ? " " : "No readings yet")}
                  </Text>
                )}
              </>
            )}
          </Box>
        </Gauge>
      </Box>

      {reading && (
        <Box
          flexDirection="row"
          alignItems="center"
          justifyContent="center"
          gap="s">
          <Ionicons name="refresh" color={theme.colors.textSecondary} />
          <Text fontSize={13} color="textSecondary" fontFamily={Fonts.medium}>
            {formatReadingTimestamp(reading.measured_at)}
          </Text>
        </Box>
      )}

      <StageInfoSheet
        ref={stageSheetRef}
        stages={stages ?? []}
        currentStageId={stage?.id}
      />
    </Box>
  );
};
