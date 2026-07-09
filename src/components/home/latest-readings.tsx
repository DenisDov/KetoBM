import { Link } from "expo-router";
import { Box, PressableBox, Text } from "@/components/primitives";
import { Fonts } from "@/theme/fonts";
import { formatReadingTimestamp } from "@/utils/datetime";
import { Reading, useLatestReadings } from "@/hooks/use-readings";

const formatValue = (reading: Reading): string =>
  reading.type === "ketone"
    ? `${reading.value.toFixed(1)} ${reading.unit}`
    : `${Math.round(reading.value)} ${reading.unit}`;

export const LatestReadings = () => {
  const { data: readings } = useLatestReadings(3);

  return (
    <Box gap="sm">
      <Box
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between">
        <Text variant="body" fontFamily={Fonts.semiBold}>
          Latest readings
        </Text>
        <Link href="/readings" asChild>
          <PressableBox hitSlop={8}>
            <Text fontSize={14} color="info" fontFamily={Fonts.medium}>
              View all
            </Text>
          </PressableBox>
        </Link>
      </Box>

      <Box
        backgroundColor="background"
        borderRadius="m"
        paddingHorizontal="m"
        style={{ boxShadow: "0px 2px 10px 0px rgba(37, 51, 109, 0.08)" }}>
        {readings?.length ? (
          readings.map((reading, index) => (
            <Box
              key={reading.id}
              flexDirection="row"
              alignItems="center"
              paddingVertical="sm"
              borderTopWidth={index === 0 ? 0 : 1}
              borderColor="neutral100">
              <Text flex={1} fontSize={14}>
                {formatReadingTimestamp(reading.measured_at)}
              </Text>
              <Text fontSize={14} color="textSecondary">
                {reading.type === "ketone" ? "Ket" : "Glu"}
              </Text>
              <Text
                width={100}
                textAlign="right"
                fontSize={14}
                fontFamily={Fonts.medium}>
                {formatValue(reading)}
              </Text>
            </Box>
          ))
        ) : (
          <Box paddingVertical="m" alignItems="center">
            <Text fontSize={14} color="textSecondary">
              No readings yet — take a measurement to see it here.
            </Text>
          </Box>
        )}
      </Box>
    </Box>
  );
};
