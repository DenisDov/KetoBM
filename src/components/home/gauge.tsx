import { useEffect, useMemo } from "react";
import {
  Canvas,
  Group,
  Path,
  Skia,
  Text as SkiaText,
  useFont,
  vec,
} from "@shopify/react-native-skia";
import {
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Box } from "@/components/primitives";

const START_ANGLE = 135;
const SWEEP_ANGLE = 270;
const STROKE_WIDTH = 22;
const MARKER_GAP = 6;
const MARKER_SIZE = 12;

export type GaugeScale = {
  /**
   * Tick stops spread evenly along the arc. Stops may be non-linear (the
   * ketone dial compresses 0–0.5 and stretches 3–5); the needle interpolates
   * piecewise between neighbours.
   */
  stops: number[];
  formatStop: (stop: number, index: number) => string;
};

export const GLUCOSE_GAUGE_SCALE: GaugeScale = {
  stops: [60, 74, 88, 102, 116, 130, 144, 158, 172, 186, 200],
  formatStop: (stop, index) =>
    index === 0 ? "<60" : index === 10 ? ">200" : String(stop),
};

export const KETONE_GAUGE_SCALE: GaugeScale = {
  stops: [0, 0.3, 0.5, 1.0, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0, 5.0],
  formatStop: (stop) => (stop === 0 ? "0" : stop.toFixed(1)),
};

/** Piecewise-linear position (0..1) of a value along the scale's stops. */
const valueToFraction = (scale: GaugeScale, value: number): number => {
  const { stops } = scale;
  const segments = stops.length - 1;
  if (value <= stops[0]) return 0;
  if (value >= stops[segments]) return 1;
  const i = stops.findIndex((stop, index) => value < stops[index + 1]);
  const within = (value - stops[i]) / (stops[i + 1] - stops[i]);
  return (i + within) / segments;
};

// "worklet" so the marker's useDerivedValue can call it on the UI thread.
const toRadians = (degrees: number) => {
  "worklet";
  return (degrees * Math.PI) / 180;
};

type GaugeProps = {
  /** Current reading; null renders an empty dial (track only, no marker). */
  value: number | null;
  scale: GaugeScale;
  /** Progress arc color — theme primary by default, stage color in non-diabetic mode. */
  color: string;
  trackColor: string;
  tickColor: string;
  labelColor: string;
  markerColor: string;
  size?: number;
  /** Center content (reading label, value, unit/stage badge) overlaid on the dial. */
  children?: React.ReactNode;
};

export const Gauge = ({
  value,
  scale,
  color,
  trackColor,
  tickColor,
  labelColor,
  markerColor,
  size = 280,
  children,
}: GaugeProps) => {
  const labelFont = useFont(
    require("@/assets/fonts/GeneralSans-Medium.otf"),
    11,
  );

  const center = size / 2;
  const radius = center - STROKE_WIDTH / 2 - MARKER_GAP - MARKER_SIZE;
  const fraction = value === null ? 0 : valueToFraction(scale, value);

  // Sweep the arc (and the marker riding its tip) in on mount / value change.
  const progress = useSharedValue(0);
  useEffect(() => {
    progress.value = withTiming(fraction, { duration: 700 });
  }, [fraction, progress]);

  const trackPath = useMemo(() => {
    const path = Skia.Path.Make();
    path.addArc(
      Skia.XYWHRect(center - radius, center - radius, radius * 2, radius * 2),
      START_ANGLE,
      SWEEP_ANGLE,
    );
    return path;
  }, [center, radius]);

  const ticks = useMemo(() => {
    const innerEdge = radius - STROKE_WIDTH / 2;
    const path = Skia.Path.Make();
    scale.stops.forEach((_, index) => {
      const angle = toRadians(
        START_ANGLE + (SWEEP_ANGLE * index) / (scale.stops.length - 1),
      );
      const from = innerEdge - 4;
      const to = innerEdge - 9;
      path.moveTo(
        center + from * Math.cos(angle),
        center + from * Math.sin(angle),
      );
      path.lineTo(center + to * Math.cos(angle), center + to * Math.sin(angle));
    });
    return path;
  }, [center, radius, scale]);

  const labels = useMemo(() => {
    if (!labelFont) return [];
    const labelRadius = radius - STROKE_WIDTH / 2 - 16;
    return scale.stops.map((stop, index) => {
      const text = scale.formatStop(stop, index);
      const angle = toRadians(
        START_ANGLE + (SWEEP_ANGLE * index) / (scale.stops.length - 1),
      );
      const width = labelFont.getTextWidth(text);
      // The first/last labels sit at the arc's bottom corners, level with the
      // center content's badge; drop them toward the (empty) arc gap so a wide
      // badge can't reach them.
      const isCorner = index === 0 || index === scale.stops.length - 1;
      return {
        text,
        x: center + labelRadius * Math.cos(angle) - width / 2,
        y: center + labelRadius * Math.sin(angle) + 4 + (isCorner ? 6 : 0),
      };
    });
  }, [labelFont, center, radius, scale]);

  // Triangle marker just outside the ring; rotated around the center so it
  // tracks the animated arc tip.
  const markerPath = useMemo(() => {
    const tip = center + radius + STROKE_WIDTH / 2 + MARKER_GAP;
    const path = Skia.Path.Make();
    path.moveTo(tip, center);
    path.lineTo(tip + MARKER_SIZE, center - MARKER_SIZE / 2);
    path.lineTo(tip + MARKER_SIZE, center + MARKER_SIZE / 2);
    path.close();
    return path;
  }, [center, radius]);

  const markerTransform = useDerivedValue(() => [
    { rotate: toRadians(SWEEP_ANGLE * progress.value - (360 - START_ANGLE)) },
  ]);

  return (
    <Box width={size} height={size} alignSelf="center">
      <Canvas style={{ width: size, height: size }}>
        <Path
          path={trackPath}
          style="stroke"
          strokeWidth={STROKE_WIDTH}
          strokeCap="round"
          color={trackColor}
        />
        <Path
          path={trackPath}
          style="stroke"
          strokeWidth={STROKE_WIDTH}
          strokeCap="round"
          color={color}
          start={0}
          end={progress}
        />
        <Path path={ticks} style="stroke" strokeWidth={1.5} color={tickColor} />
        {labels.map((label) => (
          <SkiaText
            key={label.text}
            x={label.x}
            y={label.y}
            text={label.text}
            font={labelFont}
            color={labelColor}
          />
        ))}
        {value !== null && (
          <Group origin={vec(center, center)} transform={markerTransform}>
            <Path path={markerPath} color={markerColor} />
          </Group>
        )}
      </Canvas>
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        alignItems="center"
        justifyContent="center">
        {children}
      </Box>
    </Box>
  );
};
