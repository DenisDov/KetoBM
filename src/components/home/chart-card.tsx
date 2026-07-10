import { useState } from "react";
import { useTheme } from "@shopify/restyle";
import { Box, PressableBox, Text } from "@/components/primitives";
import { SelectField } from "@/components/form";
import { boxShadows, Theme } from "@/theme";
import { Fonts } from "@/theme/fonts";
import {
  ChartRange,
  ReadingType,
  useKetosisMode,
  useReadingSeries,
} from "@/hooks/use-readings";
import { ReadingChart } from "./reading-chart";

const RANGE_OPTIONS: { label: string; value: ChartRange }[] = [
  { label: "Last 24 hours", value: "24h" },
  { label: "Last 7 days", value: "7d" },
  { label: "Last 30 days", value: "30d" },
];

const METRICS: { label: string; value: ReadingType }[] = [
  { label: "Ketones", value: "ketone" },
  { label: "Glucose", value: "glucose" },
];

export const ChartCard = () => {
  const theme = useTheme<Theme>();
  const mode = useKetosisMode();

  // Keto-focused users care about ketones first; diabetic mode leads with glucose.
  const [metric, setMetric] = useState<ReadingType>(
    mode === "non_diabetic" ? "ketone" : "glucose",
  );
  const [range, setRange] = useState<ChartRange>("24h");

  const { data: readings } = useReadingSeries(metric, range);

  const points = (readings ?? []).map((reading) => ({
    timestamp: new Date(reading.measured_at).getTime(),
    value: reading.value,
  }));

  return (
    <Box
      backgroundColor="background"
      borderRadius="m"
      padding="m"
      gap="m"
      style={{ boxShadow: boxShadows.card }}>
      {/* Segmented Ketones / Glucose toggle */}
      <Box
        flexDirection="row"
        backgroundColor="backgroundMuted"
        borderRadius="xl"
        // padding="s"
      >
        {METRICS.map((option) => {
          const active = metric === option.value;
          return (
            <PressableBox
              key={option.value}
              flex={1}
              alignItems="center"
              paddingVertical="sm"
              borderRadius="xl"
              backgroundColor={active ? "primary" : "transparent"}
              onPress={() => setMetric(option.value)}>
              <Text
                fontSize={14}
                fontFamily={active ? Fonts.semiBold : Fonts.regular}
                color={active ? "white" : "text"}>
                {option.label}
              </Text>
            </PressableBox>
          );
        })}
      </Box>

      <Box width={180}>
        <SelectField
          value={range}
          options={RANGE_OPTIONS}
          onChange={(value) => setRange(value as ChartRange)}
        />
      </Box>

      <ReadingChart
        points={points}
        unit={metric === "ketone" ? "mmol/L" : "mg/dL"}
        range={range}
        lineColor={theme.colors.primary}
        gridColor={theme.colors.neutral100}
        labelColor={theme.colors.textSecondary}
        tooltipColor={theme.colors.neutral500}
        backgroundColor={theme.colors.background}
      />
    </Box>
  );
};
