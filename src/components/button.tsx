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
import { Theme } from "@/theme";
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

export const Button = ({
  title,
  onPress,
  variant = "primary",
  disabled = false,
  iconBefore,
  iconAfter,
}: {
  title: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  iconBefore?: ReactNode;
  iconAfter?: ReactNode;
}) => {
  return (
    <ButtonBase
      variant={variant}
      disabled={disabled}
      opacity={disabled ? 0.5 : 1}
      style={
        variant === "primary" && !disabled ? styles.primaryShadow : undefined
      }
      onPress={onPress}>
      {iconBefore}
      <Text fontSize={16} color={textColors[variant]} fontFamily={Fonts.medium}>
        {title}
      </Text>
      {iconAfter}
    </ButtonBase>
  );
};

const styles = {
  primaryShadow: {
    boxShadow: "0px 4px 6px 0px rgba(37, 51, 109, .21)",
  },
} as const;
