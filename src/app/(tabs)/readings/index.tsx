import { Ionicons } from "@react-native-vector-icons/ionicons";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useTheme } from "@shopify/restyle";
import { useRef, useState } from "react";
import { ActivityIndicator, FlatList } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "@/components/button";
import { Box, PressableBox, Text } from "@/components/primitives";
import { SegmentedControl } from "@/components/segmented-control";
import { DateRangeSheet } from "@/components/readings/date-range-sheet";
import {
  ReadingRow,
  ReadingsTableHeader,
} from "@/components/readings/reading-row";
import {
  ReadingDateRange,
  ReadingType,
  useKetosisMode,
  useReadings,
} from "@/hooks/use-readings";
import { Theme } from "@/theme";

const METRICS: { label: string; value: ReadingType }[] = [
  { label: "Ketones", value: "ketone" },
  { label: "Glucose", value: "glucose" },
];

export default function ReadingsScreen() {
  const insets = useSafeAreaInsets();
  const theme = useTheme<Theme>();
  const mode = useKetosisMode();

  // Keto-focused users care about ketones first; diabetic mode leads with glucose.
  const [metric, setMetric] = useState<ReadingType>(
    mode === "non_diabetic" ? "ketone" : "glucose",
  );

  // Screen-level filter: deliberately persists across the metric switch.
  const [range, setRange] = useState<ReadingDateRange | null>(null);
  const filterSheetRef = useRef<BottomSheetModal>(null);

  const { isPending, error, data: readings } = useReadings(metric, range);

  return (
    <Box
      flex={1}
      backgroundColor="background"
      style={{ paddingTop: insets.top }}>
      <Box padding="m" gap="m">
        <Box
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between">
          <Text variant="title">Readings</Text>
          <PressableBox
            padding="s"
            onPress={() => filterSheetRef.current?.present()}>
            <Ionicons
              name={range ? "calendar" : "calendar-outline"}
              size={24}
              color={range ? theme.colors.primary : theme.colors.text}
            />
            {range && (
              <Box
                position="absolute"
                top={4}
                right={4}
                width={8}
                height={8}
                borderRadius="xs"
                backgroundColor="primary"
              />
            )}
          </PressableBox>
        </Box>
        <SegmentedControl
          options={METRICS}
          value={metric}
          onChange={setMetric}
        />
      </Box>

      {isPending ? (
        <Box flex={1} alignItems="center" justifyContent="center" padding="m">
          <ActivityIndicator size="large" />
        </Box>
      ) : error ? (
        <Box flex={1} alignItems="center" justifyContent="center" padding="m">
          <Text>Error: {error.message}</Text>
        </Box>
      ) : (
        <FlatList
          data={readings}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={ReadingsTableHeader}
          stickyHeaderIndices={[0]}
          renderItem={({ item }) => <ReadingRow reading={item} />}
          ListEmptyComponent={
            <Box alignItems="center" padding="xl" gap="s">
              <Text color="textSecondary">
                {range ? "No readings in this date range" : "No readings yet"}
              </Text>
              {range && (
                <Button
                  title="Clear filter"
                  variant="link"
                  onPress={() => setRange(null)}
                />
              )}
            </Box>
          }
          contentContainerStyle={{ paddingBottom: insets.bottom }}
        />
      )}

      <DateRangeSheet ref={filterSheetRef} range={range} onApply={setRange} />
    </Box>
  );
}
