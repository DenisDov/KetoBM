import { Ionicons } from "@react-native-vector-icons/ionicons";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { useTheme } from "@shopify/restyle";
import { forwardRef, useCallback } from "react";
import { Button } from "@/components/button";
import { Box, Text } from "@/components/primitives";
import { Theme } from "@/theme";

type ConfirmSheetProps = {
  title: string;
  description?: string;
  confirmLabel: string;
  cancelLabel?: string;
  icon?: React.ComponentProps<typeof Ionicons>["name"];
  destructive?: boolean;
  onConfirm: () => void;
};

/**
 * Reusable confirmation bottom sheet. The parent holds a ref to the underlying
 * `BottomSheetModal` and triggers it via `ref.current?.present()`. Modeled on
 * the sheet pattern in `select-field.tsx`.
 */
export const ConfirmSheet = forwardRef<BottomSheetModal, ConfirmSheetProps>(
  (
    {
      title,
      description,
      confirmLabel,
      cancelLabel = "Cancel",
      icon = "alert-circle",
      destructive = false,
      onConfirm,
    },
    ref,
  ) => {
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
        backgroundStyle={{ backgroundColor: theme.colors.background }}
        handleIndicatorStyle={{ backgroundColor: theme.colors.border }}
        backdropComponent={renderBackdrop}>
        <BottomSheetView>
          <Box padding="l" paddingBottom="xl" gap="m" alignItems="center">
            <Box
              width={64}
              height={64}
              borderRadius="xl"
              alignItems="center"
              justifyContent="center"
              backgroundColor={destructive ? "red300" : "backgroundMuted"}>
              <Ionicons
                name={icon}
                size={28}
                color={destructive ? theme.colors.error : theme.colors.primary}
              />
            </Box>

            <Text variant="title" textAlign="center">
              {title}
            </Text>
            {description && (
              <Text color="textSecondary" textAlign="center">
                {description}
              </Text>
            )}

            <Box alignSelf="stretch" gap="s" marginTop="s">
              <Button
                title={confirmLabel}
                destructive={destructive}
                onPress={() => {
                  onConfirm();
                  dismiss();
                }}
              />
              <Button
                title={cancelLabel}
                variant="secondary"
                onPress={dismiss}
              />
            </Box>
          </Box>
        </BottomSheetView>
      </BottomSheetModal>
    );
  },
);

ConfirmSheet.displayName = "ConfirmSheet";
