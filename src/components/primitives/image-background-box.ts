import { createBox } from "@shopify/restyle";
import { ImageBackground, ImageBackgroundProps } from "react-native";

import { Theme } from "@/theme";

export const ImageBackgroundBox = createBox<Theme, ImageBackgroundProps>(
  ImageBackground,
);
