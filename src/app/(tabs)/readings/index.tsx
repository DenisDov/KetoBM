import { useState } from "react";
import { ActivityIndicator, FlatList } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Box, Text } from "@/components/primitives";
import { SegmentedControl } from "@/components/segmented-control";
import {
  ReadingRow,
  ReadingsTableHeader,
} from "@/components/readings/reading-row";
import { ReadingType, useKetosisMode, useReadings } from "@/hooks/use-readings";

const METRICS: { label: string; value: ReadingType }[] = [
  { label: "Ketones", value: "ketone" },
  { label: "Glucose", value: "glucose" },
];

export default function ReadingsScreen() {
  const insets = useSafeAreaInsets();
  const mode = useKetosisMode();

  // Keto-focused users care about ketones first; diabetic mode leads with glucose.
  const [metric, setMetric] = useState<ReadingType>(
    mode === "non_diabetic" ? "ketone" : "glucose",
  );

  const { isPending, error, data: readings } = useReadings(metric);

  return (
    <Box
      flex={1}
      backgroundColor="background"
      style={{ paddingTop: insets.top }}>
      <Box paddingHorizontal="m" paddingVertical="m" gap="m">
        <Text variant="title">Readings</Text>
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
            <Box alignItems="center" padding="xl">
              <Text color="textSecondary">No readings yet</Text>
            </Box>
          }
          contentContainerStyle={{ paddingBottom: insets.bottom }}
        />
      )}
    </Box>
  );
}
