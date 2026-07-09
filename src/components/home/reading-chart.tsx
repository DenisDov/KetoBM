import { useMemo, useState } from "react";
import {
  Canvas,
  Circle,
  LinearGradient,
  Path,
  RoundedRect,
  Skia,
  Text as SkiaText,
  useFont,
  vec,
} from "@shopify/react-native-skia";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { scheduleOnRN } from "react-native-worklets";
import { Box, Text } from "@/components/primitives";
import { formatClock24, formatShortDate } from "@/utils/datetime";
import { ChartRange } from "@/hooks/use-readings";

const CHART_HEIGHT = 240;
const PADDING = { top: 56, right: 12, bottom: 28, left: 34 };

export type ChartPoint = {
  /** Epoch ms of measured_at. */
  timestamp: number;
  value: number;
};

type ReadingChartProps = {
  points: ChartPoint[];
  unit: string;
  range: ChartRange;
  /** Dial/line accent — hex, because Skia doesn't read restyle tokens. */
  lineColor: string;
  gridColor: string;
  labelColor: string;
  tooltipColor: string;
  backgroundColor: string;
};

/** Catmull-Rom spline through the points, as cubic beziers. */
const buildSmoothPath = (points: { x: number; y: number }[]) => {
  const path = Skia.Path.Make();
  if (points.length === 0) return path;
  path.moveTo(points[0].x, points[0].y);
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(i - 1, 0)];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[Math.min(i + 2, points.length - 1)];
    path.cubicTo(
      p1.x + (p2.x - p0.x) / 6,
      p1.y + (p2.y - p0.y) / 6,
      p2.x - (p3.x - p1.x) / 6,
      p2.y - (p3.y - p1.y) / 6,
      p2.x,
      p2.y,
    );
  }
  return path;
};

/** Round a raw step up to a "nice" 1/2/2.5/5 × 10^n value. */
const niceStep = (rawStep: number): number => {
  const power = 10 ** Math.floor(Math.log10(rawStep));
  const fraction = rawStep / power;
  const nice =
    fraction <= 1
      ? 1
      : fraction <= 2
        ? 2
        : fraction <= 2.5
          ? 2.5
          : fraction <= 5
            ? 5
            : 10;
  return nice * power;
};

const X_TICK_TARGET = 6;

export const ReadingChart = ({
  points,
  unit,
  range,
  lineColor,
  gridColor,
  labelColor,
  tooltipColor,
  backgroundColor,
}: ReadingChartProps) => {
  const [width, setWidth] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  // Captured once at mount: the domain end only needs minute-level accuracy,
  // and calling Date.now() during render trips the purity rule.
  const [now] = useState(() => Date.now());

  const axisFont = useFont(
    require("@/assets/fonts/GeneralSans-Regular.otf"),
    10,
  );
  const tooltipFont = useFont(
    require("@/assets/fonts/GeneralSans-Medium.otf"),
    12,
  );

  const plot = useMemo(() => {
    if (width === 0 || points.length === 0) return null;

    const domainStart =
      now -
      (range === "24h" ? 24 : range === "7d" ? 24 * 7 : 24 * 30) * 3_600_000;

    const plotWidth = width - PADDING.left - PADDING.right;
    const plotHeight = CHART_HEIGHT - PADDING.top - PADDING.bottom;
    const baseY = PADDING.top + plotHeight;

    // Y scale always starts at 0 and covers at least the dial's range so a
    // single low reading doesn't fill the whole chart.
    const floor = unit === "mg/dL" ? 200 : 4;
    const dataMax = Math.max(...points.map((p) => p.value), floor);
    const step = niceStep(dataMax / 5);
    const yMax = Math.ceil(dataMax / step) * step;

    const toX = (timestamp: number) =>
      PADDING.left +
      ((timestamp - domainStart) / (now - domainStart)) * plotWidth;
    const toY = (value: number) => baseY - (value / yMax) * plotHeight;

    const xy = points.map((p) => ({ x: toX(p.timestamp), y: toY(p.value) }));
    const linePath = buildSmoothPath(xy);

    const areaPath = linePath.copy();
    areaPath.lineTo(xy[xy.length - 1].x, baseY);
    areaPath.lineTo(xy[0].x, baseY);
    areaPath.close();

    const yTicks: { y: number; label: string }[] = [];
    for (let v = 0; v <= yMax; v += step) {
      yTicks.push({ y: toY(v), label: String(v) });
    }

    // X labels on round hour/day boundaries within the domain.
    const xTicks: { x: number; label: string }[] = [];
    const hourMs = 3_600_000;
    const tickEvery =
      range === "24h"
        ? 4 * hourMs
        : range === "7d"
          ? 24 * hourMs
          : Math.ceil(30 / X_TICK_TARGET) * 24 * hourMs;
    const firstTick = Math.ceil(domainStart / tickEvery) * tickEvery;
    for (let t = firstTick; t <= now; t += tickEvery) {
      const date = new Date(t);
      xTicks.push({
        x: toX(t),
        label: range === "24h" ? formatClock24(date) : formatShortDate(date),
      });
    }

    return { xy, linePath, areaPath, yTicks, xTicks, baseY, plotWidth };
  }, [width, points, range, unit, now]);

  const selectNearest = (touchX: number) => {
    if (!plot) return;
    let nearest = 0;
    let best = Infinity;
    plot.xy.forEach((p, index) => {
      const distance = Math.abs(p.x - touchX);
      if (distance < best) {
        best = distance;
        nearest = index;
      }
    });
    setSelected(nearest);
  };

  const gesture = useMemo(
    () =>
      Gesture.Pan()
        .minDistance(0)
        .onBegin((event) => {
          scheduleOnRN(selectNearest, event.x);
        })
        .onUpdate((event) => {
          scheduleOnRN(selectNearest, event.x);
        }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [plot],
  );

  if (points.length === 0) {
    return (
      <Box
        height={CHART_HEIGHT}
        alignItems="center"
        justifyContent="center"
        gap="s">
        <Text color="textSecondary">No readings in this period</Text>
      </Box>
    );
  }

  // Default the tooltip to the peak of the series (like the design mock).
  const peakIndex = points.reduce(
    (maxIndex, p, index) =>
      p.value > points[maxIndex].value ? index : maxIndex,
    0,
  );
  const activeIndex =
    selected !== null && selected < points.length ? selected : peakIndex;

  const activeValue = points[activeIndex].value;
  const active = plot && {
    ...plot.xy[activeIndex],
    valueLabel: `${
      unit === "mmol/L" ? activeValue.toFixed(1) : Math.round(activeValue)
    } ${unit}`,
    timeLabel: formatClock24(new Date(points[activeIndex].timestamp)),
  };

  // Keep the tooltip box inside the canvas.
  const tooltipWidth =
    active && tooltipFont
      ? Math.max(tooltipFont.getTextWidth(active.valueLabel) + 20, 64)
      : 0;
  const tooltipX = active
    ? Math.min(
        Math.max(active.x - tooltipWidth / 2, PADDING.left),
        width - PADDING.right - tooltipWidth,
      )
    : 0;

  return (
    <GestureDetector gesture={gesture}>
      <Box
        height={CHART_HEIGHT}
        onLayout={(event) => setWidth(event.nativeEvent.layout.width)}>
        {plot && width > 0 && (
          <Canvas style={{ width, height: CHART_HEIGHT }}>
            {/* Grid + y labels */}
            {plot.yTicks.map((tick) => (
              <Path
                key={`grid-${tick.label}`}
                path={(() => {
                  const p = Skia.Path.Make();
                  p.moveTo(PADDING.left, tick.y);
                  p.lineTo(width - PADDING.right, tick.y);
                  return p;
                })()}
                style="stroke"
                strokeWidth={1}
                color={gridColor}
              />
            ))}
            {axisFont &&
              plot.yTicks.map((tick) => (
                <SkiaText
                  key={`y-${tick.label}`}
                  x={PADDING.left - axisFont.getTextWidth(tick.label) - 6}
                  y={tick.y + 3}
                  text={tick.label}
                  font={axisFont}
                  color={labelColor}
                />
              ))}
            {axisFont &&
              plot.xTicks.map((tick) => (
                <SkiaText
                  key={`x-${tick.label}`}
                  x={tick.x - axisFont.getTextWidth(tick.label) / 2}
                  y={CHART_HEIGHT - 8}
                  text={tick.label}
                  font={axisFont}
                  color={labelColor}
                />
              ))}

            {/* Area fill + line */}
            <Path path={plot.areaPath}>
              <LinearGradient
                start={vec(0, PADDING.top)}
                end={vec(0, plot.baseY)}
                colors={[`${lineColor}33`, `${lineColor}00`]}
              />
            </Path>
            <Path
              path={plot.linePath}
              style="stroke"
              strokeWidth={3}
              strokeJoin="round"
              strokeCap="round"
              color={lineColor}
            />

            {/* Tooltip: vertical line, point marker, label box */}
            {active && tooltipFont && (
              <>
                <Path
                  path={(() => {
                    const p = Skia.Path.Make();
                    p.moveTo(active.x, active.y);
                    p.lineTo(active.x, plot.baseY);
                    return p;
                  })()}
                  style="stroke"
                  strokeWidth={4}
                  color={`${tooltipColor}66`}
                />
                <Circle cx={active.x} cy={active.y} r={9} color={lineColor} />
                <Circle
                  cx={active.x}
                  cy={active.y}
                  r={5}
                  color={backgroundColor}
                />
                <RoundedRect
                  x={tooltipX}
                  y={active.y - 52}
                  width={tooltipWidth}
                  height={40}
                  r={6}
                  color={tooltipColor}
                />
                <SkiaText
                  x={tooltipX + 10}
                  y={active.y - 36}
                  text={active.valueLabel}
                  font={tooltipFont}
                  color={backgroundColor}
                />
                <SkiaText
                  x={tooltipX + 10}
                  y={active.y - 20}
                  text={active.timeLabel}
                  font={tooltipFont}
                  color={backgroundColor}
                />
              </>
            )}
          </Canvas>
        )}
      </Box>
    </GestureDetector>
  );
};
