import { createTheme } from "@shopify/restyle";
import { Fonts } from "./fonts";

export const palette = {
  neutral900: "#181A1E",
  neutral800: "#26272E",
  neutral700: "#474B53",
  neutral600: "#5F616C",
  neutral500: "#7F8490",
  neutral400: "#A3A7AD",
  neutral300: "#BBBCC3",
  neutral200: "#D1D3D5",
  neutral100: "#EBEBEB",
  neutral50: "#F6F6F6",

  green600: "#61A685",
  green400: "#A5CE97",
  green300: "#59E794",

  red500: "#FA7272",
  red300: "#FDA99D",

  yellow500: "#F1BD6C",
  yellow300: "#F7D882",

  blue900: "#25336D",
  blue600: "#4385F5",
  blue500: "#2CAFF0",
  blue50: "#EDF1F9",

  white: "#FFFFFF",
  transparent: "transparent",
};

export const colors = {
  background: palette.white,
  backgroundMuted: palette.blue50,
  surface: palette.neutral800,
  text: palette.neutral900,
  textSecondary: palette.neutral500,
  placeholder: palette.neutral500,

  border: palette.neutral200,
  borderFocus: palette.blue900,

  primary: palette.blue900,
  success: palette.green600,
  warning: palette.yellow500,
  error: palette.red500,
  info: palette.blue500,
} as const;

const lightTheme = createTheme({
  colors: {
    ...palette,
    ...colors,
  },
  spacing: {
    s: 8,
    sm: 12,
    m: 16,
    ml: 20,
    l: 24,
    xl: 40,
  },
  borderRadii: {
    xs: 4,
    s: 8,
    sm: 12,
    m: 16,
    l: 24,
    xl: 40,
  },
  breakpoints: {
    phone: 0,
    tablet: 768,
  },
  textVariants: {
    defaults: {
      fontSize: {
        phone: 14,
        tablet: 16,
      },
      fontFamily: Fonts.regular,
      color: "text",
      includeFontPadding: false,
    },
    title: {
      fontFamily: Fonts.semiBold,
      fontSize: {
        phone: 24,
        tablet: 32,
      },
    },
    body: {
      fontFamily: Fonts.regular,
      fontSize: {
        phone: 16,
        tablet: 18,
      },
    },
  },
  buttonVariants: {
    defaults: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: "s",
      padding: "m",
      borderRadius: "sm",
      borderWidth: 1,
      borderColor: "transparent",
      backgroundColor: "transparent",
    },
    primary: {
      borderColor: "primary",
      backgroundColor: "primary",
    },
    secondary: {
      borderColor: "neutral700",
      backgroundColor: "background",
    },
    link: {
      padding: "s",
      borderWidth: 0,
      borderColor: "transparent",
      backgroundColor: "transparent",
    },
  },
});

const darkTheme: Theme = {
  ...lightTheme,
  colors: {
    ...lightTheme.colors,
    // surface
    background: palette.neutral900,
    backgroundMuted: palette.neutral800,
    surface: palette.neutral800,
    // text
    text: palette.white,
    textSecondary: palette.neutral400,
    placeholder: palette.neutral400,
    // border
    border: palette.neutral700,
  },
};

export type Theme = typeof lightTheme;

export { lightTheme, darkTheme };
