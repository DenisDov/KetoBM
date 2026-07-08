import { ReactNode } from "react";
import { Box, Text } from "@/components/primitives";
import { Theme } from "@/theme";
import { Fonts } from "@/theme/fonts";

type FieldShellProps = {
  label?: string;
  error?: string;
  focused?: boolean;
  disabled?: boolean;
  children: ReactNode;
};

export const FieldShell = ({
  label,
  error,
  focused = false,
  disabled = false,
  children,
}: FieldShellProps) => {
  const borderColor: keyof Theme["colors"] = error
    ? "error"
    : focused
      ? "borderFocus"
      : "border";

  return (
    <Box gap="s" opacity={disabled ? 0.5 : 1}>
      {label && <Text fontFamily={Fonts.medium}>{label}</Text>}
      <Box
        flexDirection="row"
        alignItems="center"
        gap="s"
        minHeight={52}
        paddingHorizontal="m"
        borderWidth={1}
        borderColor={borderColor}
        borderRadius="sm"
        backgroundColor="background">
        {children}
      </Box>
      {error && (
        <Text fontSize={13} color="error">
          {error}
        </Text>
      )}
    </Box>
  );
};
