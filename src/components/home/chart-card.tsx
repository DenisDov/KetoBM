import { useState } from "react";
import { useTheme } from "@shopify/restyle";
import { Box } from "@/components/primitives";
import { SelectField } from "@/components/form";
import { SegmentedControl } from "@/components/segmented-control";
import { boxShadows, Theme } from "@/theme";
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
      <SegmentedControl options={METRICS} value={metric} onChange={setMetric} />

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
