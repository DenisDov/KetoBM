import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { useTheme } from "@shopify/restyle";
import { eachDayOfInterval, format, parseISO } from "date-fns";
import { forwardRef, useCallback, useMemo, useState } from "react";
import { Calendar } from "react-native-calendars";
import { Button } from "@/components/button";
import { Box } from "@/components/primitives";
import { ReadingDateRange } from "@/hooks/use-readings";
import { Theme } from "@/theme";
import { Fonts } from "@/theme/fonts";

type DateRangeSheetProps = {
  /** Currently applied filter, pre-marked when the sheet reopens. */
  range: ReadingDateRange | null;
  /** Apply commits the draft; `null` clears the filter. */
  onApply: (range: ReadingDateRange | null) => void;
};

type PeriodMark = {
  startingDay?: boolean;
  endingDay?: boolean;
  color: string;
  textColor: string;
};

/**
 * Draft selection lives in this inner component so it mounts fresh on every
 * `present()` (the modal unmounts its content on dismiss) — Cancel is then
 * just a dismiss, and reopening re-seeds from the applied range.
 */
const DateRangeSheetContent = ({
  range,
  onApply,
  dismiss,
}: DateRangeSheetProps & { dismiss: () => void }) => {
  const theme = useTheme<Theme>();
  const [draftStart, setDraftStart] = useState(range?.start);
  const [draftEnd, setDraftEnd] = useState(range?.end);

  const onDayPress = ({ dateString }: { dateString: string }) => {
    if (!draftStart || draftEnd) {
      // No selection yet, or a complete range — start over from this day.
      setDraftStart(dateString);
      setDraftEnd(undefined);
    } else if (dateString < draftStart) {
      // Second tap landed before the start — swap the endpoints.
      setDraftEnd(draftStart);
      setDraftStart(dateString);
    } else {
      setDraftEnd(dateString);
    }
  };

  const marks = useMemo(() => {
    if (!draftStart) return {};
    const end = draftEnd ?? draftStart;
    const endpoint = {
      color: theme.colors.primary,
      textColor: theme.colors.white,
    };
    const result: Record<string, PeriodMark> = {};
    // Interior days of the span, exclusive of both endpoints.
    for (const day of eachDayOfInterval({
      start: parseISO(draftStart),
      end: parseISO(end),
    }).slice(1, -1)) {
      result[format(day, "yyyy-MM-dd")] = {
        color: theme.colors.backgroundMuted,
        textColor: theme.colors.text,
      };
    }
    result[draftStart] = {
      ...endpoint,
      startingDay: true,
      endingDay: draftStart === end,
    };
    if (end !== draftStart) result[end] = { ...endpoint, endingDay: true };
    return result;
  }, [draftStart, draftEnd, theme]);

  return (
    <Box padding="l" paddingBottom="xl" gap="m">
      <Calendar
        // react-native-calendars caches theme styles, so remount on scheme change.
        key={theme.colors.background}
        markingType="period"
        markedDates={marks}
        onDayPress={onDayPress}
        initialDate={draftStart}
        maxDate={format(new Date(), "yyyy-MM-dd")}
        theme={{
          calendarBackground: theme.colors.background,
          dayTextColor: theme.colors.text,
          monthTextColor: theme.colors.text,
          textSectionTitleColor: theme.colors.textSecondary,
          textDisabledColor: theme.colors.placeholder,
          arrowColor: theme.colors.primary,
          todayTextColor: theme.colors.info,
          textDayFontFamily: Fonts.regular,
          textMonthFontFamily: Fonts.semiBold,
          textDayHeaderFontFamily: Fonts.medium,
        }}
      />

      {(range || draftStart) && (
        <Button
          title="Clear filter"
          variant="link"
          onPress={() => {
            onApply(null);
            dismiss();
          }}
        />
      )}

      <Box flexDirection="row" gap="s">
        <Box flex={1}>
          <Button title="Cancel" variant="secondary" onPress={dismiss} />
        </Box>
        <Box flex={1}>
          <Button
            title="Apply"
            disabled={!draftStart}
            onPress={() => {
              if (!draftStart) return;
              onApply({ start: draftStart, end: draftEnd ?? draftStart });
              dismiss();
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};

/**
 * Date-range filter for the readings list. The parent holds a ref to the
 * underlying `BottomSheetModal` and opens it via `ref.current?.present()`.
 * Modeled on the sheet pattern in `confirm-sheet.tsx`.
 */
export const DateRangeSheet = forwardRef<BottomSheetModal, DateRangeSheetProps>(
  ({ range, onApply }, ref) => {
    const theme = useTheme<Theme>();

    const renderBackdrop = useCallback(
      (props: React.ComponentProps<typeof BottomSheetBackdrop>) => (
        <BottomSheetBackdrop
          {...props}
          appearsOnIndex={0}
          disappearsOnIndex={-1}
        />
      ),
      [],
    );

    const dismiss = () => {
      if (ref && typeof ref !== "function") ref.current?.dismiss();
    };

    return (
      <BottomSheetModal
        ref={ref}
        enableDynamicSizing
        // Day-cell taps shouldn't start a sheet drag; the handle, backdrop,
        // and Cancel remain as close affordances.
        enableContentPanningGesture={false}
        backgroundStyle={{ backgroundColor: theme.colors.background }}
        handleIndicatorStyle={{ backgroundColor: theme.colors.border }}
        backdropComponent={renderBackdrop}>
        <BottomSheetView>
          <DateRangeSheetContent
            range={range}
            onApply={onApply}
            dismiss={dismiss}
          />
        </BottomSheetView>
      </BottomSheetModal>
    );
  },
);

DateRangeSheet.displayName = "DateRangeSheet";
