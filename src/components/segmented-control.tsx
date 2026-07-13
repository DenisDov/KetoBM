import { Box, PressableBox, Text } from "@/components/primitives";
import { Fonts } from "@/theme/fonts";

type SegmentedControlProps<T extends string> = {
  options: { label: string; value: T }[];
  value: T;
  onChange: (value: T) => void;
};

/** Pill-style toggle (e.g. Ketones | Glucose). */
export const SegmentedControl = <T extends string>({
  options,
  value,
  onChange,
}: SegmentedControlProps<T>) => (
  <Box flexDirection="row" backgroundColor="backgroundMuted" borderRadius="xl">
    {options.map((option) => {
      const active = value === option.value;
      return (
        <PressableBox
          key={option.value}
          flex={1}
          alignItems="center"
          paddingVertical="sm"
          borderRadius="xl"
          backgroundColor={active ? "primary" : "transparent"}
          onPress={() => onChange(option.value)}>
          <Text
            fontFamily={active ? Fonts.semiBold : Fonts.regular}
            color={active ? "white" : "text"}>
            {option.label}
          </Text>
        </PressableBox>
      );
    })}
  </Box>
);
