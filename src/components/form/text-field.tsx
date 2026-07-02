import { forwardRef, useState } from "react";
import { TextInput, TextInputProps } from "react-native";
import { useTheme } from "@shopify/restyle";
import { FieldShell } from "@/components/form/field-shell";
import { Fonts } from "@/theme/fonts";
import { Theme } from "@/theme";

type TextFieldProps = TextInputProps & {
  label?: string;
  error?: string;
};

export const TextField = forwardRef<TextInput, TextFieldProps>(
  ({ label, error, style, onFocus, onBlur, editable = true, ...rest }, ref) => {
    const theme = useTheme<Theme>();
    const [focused, setFocused] = useState(false);

    return (
      <FieldShell
        label={label}
        error={error}
        focused={focused}
        disabled={!editable}>
        <TextInput
          ref={ref}
          editable={editable}
          placeholderTextColor={theme.colors.placeholder}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          style={[
            {
              flex: 1,
              fontFamily: Fonts.regular,
              fontSize: 16,
              color: theme.colors.text,
              padding: 0,
            },
            style,
          ]}
          {...rest}
        />
      </FieldShell>
    );
  },
);

TextField.displayName = "TextField";
