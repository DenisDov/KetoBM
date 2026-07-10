import { Ionicons } from "@react-native-vector-icons/ionicons";
import { useTheme } from "@shopify/restyle";
import { Link } from "expo-router";
import { Box, PressableBox, Text } from "@/components/primitives";
import { boxShadows, Theme } from "@/theme";
import { Fonts } from "@/theme/fonts";
import { formatReadingTimestamp } from "@/utils/datetime";
import {
  findStageForValue,
  useActiveDevice,
  useKetosisMode,
  useKetosisStages,
  useLatestReadings,
} from "@/hooks/use-readings";
import { Gauge, GLUCOSE_GAUGE_SCALE, KETONE_GAUGE_SCALE } from "./gauge";

/** Perceived luminance — picks readable text for a stage-colored badge. */
const isDarkColor = (hex: string): boolean => {
  const rgb = hex.replace("#", "");
  const r = parseInt(rgb.slice(0, 2), 16);
  const g = parseInt(rgb.slice(2, 4), 16);
  const b = parseInt(rgb.slice(4, 6), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 < 0.55;
};

/**
 * Hero card: connection status, the reading dial for the most recent
 * measurement (either type), and its timestamp.
 *
 * The dial is theme-blue by default. Non-diabetic users (primary goal
 * "ketogenic diet") get a ketone dial colored by their current ketosis stage,
 * plus a stage badge. Diabetic-mode ketone readings keep the blue dial but
 * still show the DKA-risk stage badge — that warning matters most for them.
 */
export const GaugeCard = () => {
  const theme = useTheme<Theme>();
  const mode = useKetosisMode();

  const { data: readings, isPending } = useLatestReadings(1);
  const { data: device } = useActiveDevice();
  const { data: stages } = useKetosisStages(mode);

  const reading = readings?.[0] ?? null;
  const isKetone = reading?.type === "ketone";
  const scale = isKetone ? KETONE_GAUGE_SCALE : GLUCOSE_GAUGE_SCALE;

  const stage =
    isKetone && reading ? findStageForValue(stages, reading.value) : undefined;

  // Non-diabetic ketone dial takes the stage color; everything else stays blue.
  const gaugeColor =
    isKetone && mode === "non_diabetic" && stage?.color
      ? stage.color
      : theme.colors.primary;

  const connected = device?.connection_status === "connected";

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
          <Text fontSize={14}>{connected ? "Connected" : "Disconnected"}</Text>
        </Box>
        <Link href="/readings/notes" asChild>
          <PressableBox
            flexDirection="row"
            alignItems="center"
            gap="s"
            paddingVertical="s"
            paddingHorizontal="sm"
            borderRadius="s"
            borderWidth={1}
            borderColor="border">
            <Ionicons
              name="document-text-outline"
              size={16}
              color={theme.colors.text}
            />
            <Text fontSize={14}>Add note</Text>
          </PressableBox>
        </Link>
      </Box>

      <Gauge
        value={reading?.value ?? null}
        scale={scale}
        color={gaugeColor}
        trackColor={theme.colors.neutral200}
        tickColor={theme.colors.neutral300}
        labelColor={theme.colors.textSecondary}
        markerColor={theme.colors.text}>
        <Box alignItems="center" gap="s" style={{ marginTop: 24 }}>
          <Text
            fontSize={14}
            letterSpacing={1}
            color="primary"
            fontFamily={Fonts.semiBold}>
            {isKetone ? "KETONES" : "GLUCOSE"}
          </Text>
          <Text fontSize={48} lineHeight={52} fontFamily={Fonts.bold}>
            {reading
              ? isKetone
                ? reading.value.toFixed(1)
                : Math.round(reading.value)
              : "--"}
          </Text>
          {stage ? (
            <Box
              flexDirection="row"
              alignItems="center"
              gap="s"
              paddingHorizontal="sm"
              paddingVertical="s"
              borderRadius="xl"
              style={{ backgroundColor: stage.color ?? theme.colors.primary }}>
              <Text
                fontSize={13}
                fontFamily={Fonts.medium}
                style={{
                  color: isDarkColor(stage.color ?? "#000000")
                    ? theme.colors.white
                    : theme.colors.neutral900,
                }}>
                {stage.stage_name}
              </Text>
            </Box>
          ) : (
            <Text fontSize={16} color="textSecondary">
              {reading?.unit ?? (isPending ? " " : "No readings yet")}
            </Text>
          )}
        </Box>
      </Gauge>

      {reading && (
        <Box
          flexDirection="row"
          alignItems="center"
          justifyContent="center"
          gap="s">
          <Ionicons
            name="refresh"
            size={14}
            color={theme.colors.textSecondary}
          />
          <Text fontSize={13} color="textSecondary">
            {formatReadingTimestamp(reading.measured_at)}
          </Text>
        </Box>
      )}
    </Box>
  );
};
