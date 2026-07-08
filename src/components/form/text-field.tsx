import { forwardRef, ReactNode, useState } from "react";
import { TextInput, TextInputProps } from "react-native";
import { Ionicons } from "@react-native-vector-icons/ionicons";
import { useTheme } from "@shopify/restyle";
import { FieldShell } from "@/components/form/field-shell";
import { PressableBox } from "@/components/primitives";
import { Fonts } from "@/theme/fonts";
import { Theme } from "@/theme";

type TextFieldProps = TextInputProps & {
  label?: string;
  error?: string;
  /** Trailing content (e.g. a validation checkmark). Ignored for password fields, which render a visibility toggle. */
  rightElement?: ReactNode;
};

export const TextField = forwardRef<TextInput, TextFieldProps>(
  (
    {
      label,
      error,
      style,
      onFocus,
      onBlur,
      editable = true,
      secureTextEntry,
      rightElement,
      ...rest
    },
    ref,
  ) => {
    const theme = useTheme<Theme>();
    const [focused, setFocused] = useState(false);
    const [passwordVisible, setPasswordVisible] = useState(false);

    const isPassword = !!secureTextEntry;

    return (
      <FieldShell
        label={label}
        error={error}
        focused={focused}
        disabled={!editable}>
        <TextInput
          ref={ref}
          editable={editable}
          secureTextEntry={isPassword && !passwordVisible}
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
        {isPassword ? (
          <PressableBox
            hitSlop={8}
            onPress={() => setPasswordVisible((v) => !v)}>
            <Ionicons
              name={passwordVisible ? "eye-off-outline" : "eye-outline"}
              size={22}
              color={theme.colors.text}
            />
          </PressableBox>
        ) : (
          rightElement
        )}
      </FieldShell>
    );
  },
);

TextField.displayName = "TextField";
