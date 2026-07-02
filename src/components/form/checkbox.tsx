import { Ionicons } from "@react-native-vector-icons/ionicons";
import { useTheme } from "@shopify/restyle";
import { Box, PressableBox, Text } from "@/components/primitives";
import { Theme } from "@/theme";

type CheckboxProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
};

export const Checkbox = ({
  checked,
  onChange,
  label,
  disabled = false,
}: CheckboxProps) => {
  const theme = useTheme<Theme>();

  return (
    <PressableBox
      flexDirection="row"
      alignItems="center"
      gap="s"
      opacity={disabled ? 0.5 : 1}
      disabled={disabled}
      onPress={() => onChange(!checked)}>
      <Box
        width={22}
        height={22}
        borderRadius="xs"
        borderWidth={1}
        borderColor={checked ? "primary" : "border"}
        backgroundColor={checked ? "primary" : "background"}
        alignItems="center"
        justifyContent="center">
        {checked && (
          <Ionicons name="checkmark" size={16} color={theme.colors.white} />
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
