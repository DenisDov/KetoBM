import { Ionicons } from "@react-native-vector-icons/ionicons";
import { useTheme } from "@shopify/restyle";
import { Box, Text } from "@/components/primitives";
import { passwordRules } from "@/lib/validation";
import { Theme } from "@/theme";

type PasswordRulesProps = {
  password: string;
};

export const PasswordRules = ({ password }: PasswordRulesProps) => {
  const theme = useTheme<Theme>();

  return (
    <Box gap="s">
      {passwordRules.map((rule) => {
        const met = rule.test(password);
        return (
          <Box key={rule.key} flexDirection="row" alignItems="center" gap="s">
            <Ionicons
              name={met ? "checkmark-circle" : "checkmark-circle-outline"}
              size={20}
              color={met ? theme.colors.success : theme.colors.placeholder}
            />
            <Text color={met ? "text" : "textSecondary"}>{rule.label}</Text>
          </Box>
        );
      })}
    </Box>
  );
};
