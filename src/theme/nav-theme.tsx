import {
  DarkTheme as NavDarkTheme,
  DefaultTheme as NavLightTheme,
} from "expo-router";
import { lightTheme, darkTheme } from "./theme";

export const NavLightAdapter = {
  ...NavLightTheme,
  colors: {
    ...NavLightTheme.colors,
    primary: lightTheme.colors.primary,
    background: lightTheme.colors.background,
    card: lightTheme.colors.white, // Color for Headers / Tab bars
    text: lightTheme.colors.text,
    border: lightTheme.colors.neutral200, // Line separators
    notification: lightTheme.colors.error, // Badge color
  },
};

export const NavDarkAdapter = {
  ...NavDarkTheme,
  colors: {
    ...NavDarkTheme.colors,
    primary: darkTheme.colors.primary,
    background: darkTheme.colors.background,
    card: darkTheme.colors.neutral800, // Color for Headers / Tab bars
    text: darkTheme.colors.text,
    border: darkTheme.colors.neutral700,
    notification: darkTheme.colors.error, // Badge color
  },
};
