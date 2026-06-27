// components/wave-divider.tsx
import { useWindowDimensions } from "react-native";
import Svg, { Path } from "react-native-svg";
import { useTheme } from "@shopify/restyle";
import { Theme } from "@/theme/theme";

interface WaveDividerProps {
  color?: string;
}

export function WaveDivider({ color }: WaveDividerProps) {
  const { width } = useWindowDimensions();
  const theme = useTheme<Theme>();
  const fill = color ?? theme.colors.background;

  return (
    <Svg
      height={50}
      width={width}
      viewBox={`0 0 ${width} 50`}
      style={{ position: "absolute", top: -50, left: 0, right: 0 }}>
      <Path
        d={`M 0 50 L 0 0 Q ${width / 2} 50 ${width} 0 L ${width} 50 Z`}
        fill={fill}
      />
    </Svg>
  );
}
