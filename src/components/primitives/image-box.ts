import { createBox } from "@shopify/restyle";
import { Image, ImageProps } from "expo-image";

import { Theme } from "@/theme";

export const ImageBox = createBox<Theme, ImageProps>(Image);
