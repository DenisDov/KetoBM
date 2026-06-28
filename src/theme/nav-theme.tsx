import {
  DarkTheme as NavDarkTheme,
  DefaultTheme as NavLightTheme,
} from "expo-router";
import { theme, darkTheme } from "./theme";

export const NavLightAdapter = {
  ...NavLightTheme,
  colors: {
    ...NavLightTheme.colors,
    primary: theme.colors.primary,
    background: theme.colors.background,
    card: theme.colors.white, // Color for Headers / Tab bars
    text: theme.colors.text,
    border: theme.colors.neutral200, // Line separators
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
  },
};
