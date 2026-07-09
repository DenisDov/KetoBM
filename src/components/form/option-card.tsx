import { PressableBox, Text } from "@/components/primitives";
import { Checkbox } from "@/components/form/checkbox";
import { Radio } from "@/components/form/radio-group";

type OptionCardProps = {
  label: string;
  selected: boolean;
  onPress: () => void;
  /** Left control: radio for single-choice, checkbox for multi-choice. */
  control?: "radio" | "checkbox";
  disabled?: boolean;
};

export const OptionCard = ({
  label,
  selected,
  onPress,
  control = "radio",
  disabled = false,
}: OptionCardProps) => {
  return (
    <PressableBox
      flexDirection="row"
      alignItems="center"
      gap="s"
      padding="m"
      borderWidth={1}
      borderRadius="s"
      borderColor={selected ? "primary" : "border"}
      opacity={disabled ? 0.5 : 1}
      disabled={disabled}
      onPress={onPress}>
      {control === "radio" ? (
        <Radio selected={selected} onPress={onPress} disabled={disabled} />
      ) : (
        <Checkbox checked={selected} onChange={onPress} disabled={disabled} />
      )}
      <Text flex={1} fontSize={16} color="text">
        {label}
      </Text>
    </PressableBox>
  );
};
