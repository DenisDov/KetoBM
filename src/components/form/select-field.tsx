import { Ionicons } from "@react-native-vector-icons/ionicons";
import {
  BottomSheetBackdrop,
  BottomSheetFlatList,
  BottomSheetModal,
} from "@gorhom/bottom-sheet";
import { useTheme } from "@shopify/restyle";
import { useCallback, useRef } from "react";
import { PressableBox, Text } from "@/components/primitives";
import { FieldShell } from "@/components/form/field-shell";
import { Theme } from "@/theme";

export type SelectFieldOption = {
  label: string;
  value: string;
};

type SelectFieldProps = {
  label?: string;
  error?: string;
  placeholder?: string;
  value: string | null;
  options: SelectFieldOption[];
  onChange: (value: string) => void;
  disabled?: boolean;
};

export const SelectField = ({
  label,
  error,
  placeholder = "Select an option",
  value,
  options,
  onChange,
  disabled = false,
}: SelectFieldProps) => {
  const theme = useTheme<Theme>();
  const sheetRef = useRef<BottomSheetModal>(null);

  const selectedOption = options.find((option) => option.value === value);

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

  return (
    <>
      <FieldShell label={label} error={error} disabled={disabled}>
        <PressableBox
          flex={1}
          flexDirection="row"
          alignItems="center"
          disabled={disabled}
          onPress={() => sheetRef.current?.present()}>
          <Text
            flex={1}
            fontSize={16}
            color={selectedOption ? "text" : "placeholder"}
            numberOfLines={1}>
            {selectedOption ? selectedOption.label : placeholder}
          </Text>
          <Ionicons
            name="chevron-down"
            size={20}
            color={theme.colors.textSecondary}
          />
        </PressableBox>
      </FieldShell>

      <BottomSheetModal
        ref={sheetRef}
        enableDynamicSizing
        backgroundStyle={{ backgroundColor: theme.colors.background }}
        handleIndicatorStyle={{ backgroundColor: theme.colors.border }}
        backdropComponent={renderBackdrop}>
        <BottomSheetFlatList
          data={options}
          keyExtractor={(item) => item.value}
          contentContainerStyle={{
            paddingBottom: theme.spacing.xl,
            paddingHorizontal: theme.spacing.m,
          }}
          renderItem={({ item }) => {
            const isSelected = item.value === value;
            return (
              <PressableBox
                flexDirection="row"
                alignItems="center"
                justifyContent="space-between"
                paddingVertical="m"
                onPress={() => {
                  onChange(item.value);
                  sheetRef.current?.dismiss();
                }}>
                <Text fontSize={16} color="text">
                  {item.label}
                </Text>
                {isSelected && (
                  <Ionicons
                    name="checkmark"
                    size={20}
                    color={theme.colors.primary}
                  />
                )}
              </PressableBox>
            );
          }}
        />
      </BottomSheetModal>
    </>
  );
};
