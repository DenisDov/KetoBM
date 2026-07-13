import { Ionicons } from "@react-native-vector-icons/ionicons";
import { useTheme } from "@shopify/restyle";
import { Link } from "expo-router";
import { Box, PressableBox, Text } from "@/components/primitives";
import { Theme } from "@/theme";
import { Fonts } from "@/theme/fonts";
import { ReadingWithNote } from "@/hooks/use-readings";
import { formatClock12, formatTableDate } from "@/utils/datetime";

/** Shared flex ratios so the header row lines up with the data rows. */
const COLUMNS = { date: 2, time: 2.6, value: 1.8, notes: 4.2 } as const;

/** Width reserved for the trailing chevron, mirrored in the header spacer. */
const CHEVRON_SIZE = 16;

export const ReadingsTableHeader = () => (
  <Box
    flexDirection="row"
    alignItems="center"
    gap="s"
    padding="m"
    backgroundColor="backgroundMuted">
    {(
      [
        ["Date", COLUMNS.date],
        ["Time", COLUMNS.time],
        ["Value", COLUMNS.value],
        ["Notes", COLUMNS.notes],
      ] as const
    ).map(([label, flex]) => (
      <Text
        key={label}
        flex={flex}
        fontFamily={Fonts.medium}
        color="textSecondary">
        {label}
      </Text>
    ))}
    <Box width={CHEVRON_SIZE} />
  </Box>
);

/** One tappable row of the readings table; opens the reading's note editor. */
export const ReadingRow = ({ reading }: { reading: ReadingWithNote }) => {
  const theme = useTheme<Theme>();
  const measured = new Date(reading.measured_at);
  const noteLabel = reading.notes
    ? (reading.notes.note_presets?.label ?? reading.notes.body)
    : null;

  return (
    <Link href={`/note/${reading.id}`} asChild>
      <PressableBox
        flexDirection="row"
        alignItems="center"
        gap="s"
        padding="m"
        borderBottomWidth={1}
        borderBottomColor="border">
        <Text flex={COLUMNS.date} fontFamily={Fonts.medium}>
          {formatTableDate(measured)}
        </Text>
        <Text flex={COLUMNS.time} fontFamily={Fonts.medium}>
          {formatClock12(measured)}
        </Text>
        <Text flex={COLUMNS.value} fontFamily={Fonts.medium}>
          {reading.value}
        </Text>
        <Text
          fontFamily={Fonts.medium}
          flex={COLUMNS.notes}
          numberOfLines={1}
          color={noteLabel ? "text" : "placeholder"}>
          {noteLabel ?? "+ Add note"}
        </Text>
        <Ionicons
          name="chevron-forward"
          size={CHEVRON_SIZE}
          color={theme.colors.textSecondary}
        />
      </PressableBox>
    </Link>
  );
};
