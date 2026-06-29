import { createBox } from "@shopify/restyle";
import { PressableOpacity } from "pressto";
import { PressableProps } from "react-native";

import { Theme } from "@/theme";

export const PressableBox = createBox<Theme, PressableProps>(PressableOpacity);
