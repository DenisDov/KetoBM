import { createTheme } from "@shopify/restyle";
import { FONTS } from "./_fonts";

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

  white: "#FFFFFF",
};

export const colors = {
  background: palette.white,
  surface: palette.neutral800,
  text: palette.neutral900,
  textSecondary: palette.neutral500,

  primary: palette.blue900,
  success: palette.green600,
  warning: palette.yellow500,
  error: palette.red500,
  info: palette.blue500,
} as const;

const theme = createTheme({
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
  // iconSizes: {
  //   s: 16,
  //   sm: 20,
  //   m: 24,
  //   l: 32,
  //   xl: 40,
  // },
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
      fontFamily: "GeneralSans-Regular",
      color: "text",
      includeFontPadding: false,
    },
    title: {
      fontFamily: "GeneralSans-SemiBold",
      fontSize: {
        phone: 24,
        tablet: 32,
      },
    },
    body: {
      fontSize: {
        phone: 16,
        tablet: 18,
      },
    },
  },
  // cardVariants: {
  //   defaults: {
  //     backgroundColor: "surface",
  //     borderRadius: "s",
  //     padding: "sm",
  //   },
  //   outlined: {
  //     borderWidth: 1,
  //     borderColor: "border",
  //   },
  // },
});

const darkTheme: Theme = {
  ...theme,
  colors: {
    ...theme.colors,
    background: palette.neutral900,
    text: palette.white,
  },
};

export type Theme = typeof theme;

export { theme, darkTheme };
