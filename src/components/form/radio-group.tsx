import { Box, PressableBox, Text } from "@/components/primitives";

export type RadioOption = {
  label: string;
  value: string;
};

type RadioGroupProps = {
  value: string | null;
  onChange: (value: string) => void;
  options: RadioOption[];
  direction?: "row" | "column";
  disabled?: boolean;
};

export const RadioGroup = ({
  value,
  onChange,
  options,
  direction = "column",
  disabled = false,
}: RadioGroupProps) => {
  return (
    <Box
      flexDirection={direction}
      gap="m"
      flexWrap={direction === "row" ? "wrap" : undefined}>
      {options.map((option) => (
        <Radio
          key={option.value}
          label={option.label}
          selected={option.value === value}
          onPress={() => onChange(option.value)}
          disabled={disabled}
        />
      ))}
    </Box>
  );
};

type RadioProps = {
  label?: string;
  selected: boolean;
  onPress: () => void;
  disabled?: boolean;
};

export const Radio = ({
  label,
  selected,
  onPress,
  disabled = false,
}: RadioProps) => {
  return (
    <PressableBox
      flexDirection="row"
      alignItems="center"
      gap="s"
      opacity={disabled ? 0.5 : 1}
      disabled={disabled}
      onPress={onPress}>
      <Box
        width={22}
        height={22}
        borderRadius="l"
        borderWidth={1}
        borderColor={selected ? "primary" : "border"}
        alignItems="center"
        justifyContent="center">
        {selected && (
          <Box
            width={12}
            height={12}
            borderRadius="l"
            backgroundColor="primary"
          />
        )}
      </Box>
      {label && (
        <Text flex={1} fontSize={16} color="text">
          {label}
        </Text>
      )}
    </PressableBox>
  );
};
