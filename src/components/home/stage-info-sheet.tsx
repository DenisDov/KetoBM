import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { useTheme } from "@shopify/restyle";
import { useRouter } from "expo-router";
import { Ref, useCallback } from "react";
import { Box, PressableBox, Text } from "@/components/primitives";
import { KetosisStage } from "@/hooks/use-readings";
import { Theme } from "@/theme";
import { Fonts } from "@/theme/fonts";
import { isDarkColor } from "@/utils/colors";

type StageInfoSheetProps = {
  ref?: Ref<BottomSheetModal>;
  stages: KetosisStage[];
  currentStageId?: string;
};

const formatValue = (value: number) => (value === 0 ? "0" : value.toFixed(1));

/**
 * Display string for a half-open [min, max) range, in 0.1 mmol/L reading
 * ticks: upper bound shown is one tick below the exclusive max, an open upper
 * bound renders as "min+", and a single-tick range collapses to one value.
 */
const formatRange = (stage: KetosisStage): string => {
  const lower = stage.min_mmol ?? 0;
  if (stage.max_mmol === null) return `${formatValue(lower)}+`;
  const upper = Math.round((stage.max_mmol - 0.1) * 10) / 10;
  if (upper <= lower) return formatValue(lower);
  return `${formatValue(lower)} – ${formatValue(upper)}`;
};

/**
 * Explainer for the gauge's stage badge: the full ketosis-stage table for the
 * active mode, with the user's current stage highlighted. Parent presents it
 * via `ref.current?.present()`.
 */
export function StageInfoSheet({
  ref,
  stages,
  currentStageId,
}: StageInfoSheetProps) {
  const theme = useTheme<Theme>();
  const router = useRouter();

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

  const openHelp = () => {
    if (ref && typeof ref !== "function") ref.current?.dismiss();
    router.push("/(tabs)/help");
  };

  return (
    <BottomSheetModal
      ref={ref}
      enableDynamicSizing
      backgroundStyle={{ backgroundColor: theme.colors.background }}
      handleIndicatorStyle={{ backgroundColor: theme.colors.border }}
      backdropComponent={renderBackdrop}>
      <BottomSheetView>
        <Box padding="m" paddingBottom="xl" gap="s">
          <Box
            flexDirection="row"
            alignItems="center"
            padding="sm"
            backgroundColor="neutral100"
            borderRadius="xs">
            <Text flex={1} fontFamily={Fonts.semiBold}>
              Ketosis Stage
            </Text>
            <Text fontFamily={Fonts.semiBold}>Reading (mmol/L)</Text>
          </Box>

          {stages.map((stage) => {
            const isCurrent = stage.id === currentStageId;
            const textColor = isDarkColor(stage.color ?? "#FFFFFF")
              ? theme.colors.white
              : theme.colors.neutral900;
            return (
              <Box
                key={stage.id}
                flexDirection="row"
                alignItems="center"
                padding="sm"
                borderRadius="xs"
                borderWidth={2}
                style={{
                  backgroundColor: stage.color ?? theme.colors.neutral100,
                  borderColor: isCurrent ? theme.colors.text : "transparent",
                }}>
                <Text
                  flex={1}
                  fontFamily={isCurrent ? Fonts.semiBold : Fonts.regular}
                  style={{ color: textColor }}>
                  {stage.stage_name}
                </Text>
                <Text
                  fontFamily={isCurrent ? Fonts.semiBold : Fonts.regular}
                  style={{ color: textColor }}>
                  {formatRange(stage)}
                </Text>
              </Box>
            );
          })}

          <PressableBox paddingTop="s" onPress={openHelp}>
            <Text color="textSecondary" textAlign="center">
              More detailed info on ketone levels is available in the{" "}
              <Text color="primary" fontFamily={Fonts.medium}>
                Help
              </Text>{" "}
              tab.
            </Text>
          </PressableBox>
        </Box>
      </BottomSheetView>
    </BottomSheetModal>
  );
}
