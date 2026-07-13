import {
  BackgroundColorProps,
  BorderProps,
  OpacityProps,
  SpacingProps,
  VariantProps,
  backgroundColor,
  border,
  createRestyleComponent,
  createVariant,
  opacity,
  spacing,
} from "@shopify/restyle";
import { PressableOpacity } from "pressto";
import { ReactNode } from "react";
import { Text } from "@/components/primitives";
import { boxShadows, Theme } from "@/theme";
import { Fonts } from "@/theme/fonts";

type ButtonVariant = "primary" | "secondary" | "link";

type RestyleProps = SpacingProps<Theme> &
  BorderProps<Theme> &
  BackgroundColorProps<Theme> &
  OpacityProps<Theme> &
  VariantProps<Theme, "buttonVariants">;

type ButtonBaseProps = RestyleProps &
  React.ComponentProps<typeof PressableOpacity>;

const ButtonBase = createRestyleComponent<ButtonBaseProps, Theme>(
  [
    spacing,
    border,
    backgroundColor,
    opacity,
    createVariant({ themeKey: "buttonVariants" }),
  ],
  PressableOpacity,
);

const textColors: Record<ButtonVariant, keyof Theme["colors"]> = {
  primary: "white",
  secondary: "text",
  link: "primary",
};

const disabledStyles: Record<ButtonVariant, RestyleProps> = {
  primary: { backgroundColor: "border", borderColor: "border" },
  secondary: { borderColor: "border" },
  link: {},
};

const disabledTextColor: keyof Theme["colors"] = "textSecondary";

export const Button = ({
  title,
  onPress,
  variant = "primary",
  disabled = false,
  destructive = false,
  iconBefore,
  iconAfter,
}: {
  title: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  destructive?: boolean;
  iconBefore?: ReactNode;
  iconAfter?: ReactNode;
}) => {
  // Destructive primary buttons (e.g. "Disconnect my meter") use the error
  // color and drop the primary drop-shadow.
  const isDestructive = destructive && variant === "primary" && !disabled;

  return (
    <ButtonBase
      variant={variant}
      disabled={disabled}
      {...(disabled ? disabledStyles[variant] : undefined)}
      {...(isDestructive ? { backgroundColor: "error" } : undefined)}
      style={
        variant === "primary" && !disabled && !isDestructive
          ? { boxShadow: boxShadows.button }
          : undefined
      }
      onPress={onPress}>
      {iconBefore}
      <Text
        fontSize={16}
        color={disabled ? disabledTextColor : textColors[variant]}
        fontFamily={Fonts.medium}>
        {title}
      </Text>
      {iconAfter}
    </ButtonBase>
  );
};
