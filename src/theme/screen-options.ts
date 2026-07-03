import type { ComponentProps } from "react";
import type { Stack } from "expo-router";

export const defaultScreenOptions: ComponentProps<
  typeof Stack
>["screenOptions"] = {
  title: "",
  headerTransparent: true,
  headerBackImageSource: require("@/assets/icons/arrow-left.png"),
  headerBackButtonDisplayMode: "minimal",
};
