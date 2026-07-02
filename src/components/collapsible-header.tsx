import React from "react";
import { StyleSheet, Text, View, Platform } from "react-native";
import Animated, {
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  interpolate,
  Extrapolation,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const LARGE_TITLE_HEIGHT = 52;
const COLLAPSE_DISTANCE = 60; // how much scroll it takes to fully collapse
const SMALL_HEADER_HEIGHT = 44;

export function CollapsingHeader({
  children,
  title,
  collapsible = true,
}: {
  children: React.ReactNode;
  title: string;
  // Large titles that wrap to two lines look awkward when they fade/scale
  // away as a block on scroll (like Apple, we only collapse single-line titles).
  collapsible?: boolean;
}) {
  const insets = useSafeAreaInsets();
  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  // Large title: fades out, scales down, moves up as you scroll
  const largeTitleStyle = useAnimatedStyle(() => {
    if (!collapsible) {
      return {};
    }
    const opacity = interpolate(
      scrollY.value,
      [0, COLLAPSE_DISTANCE * 0.6],
      [1, 0],
      Extrapolation.CLAMP,
    );
    const translateY = interpolate(
      scrollY.value,
      [0, COLLAPSE_DISTANCE],
      [0, -20],
      Extrapolation.CLAMP,
    );
    const scale = interpolate(
      scrollY.value,
      [0, COLLAPSE_DISTANCE],
      [1, 0.85],
      Extrapolation.CLAMP,
    );
    return {
      opacity,
      transform: [{ translateY }, { scale }],
    };
  });

  // Small sticky title: fades in as large title fades out
  const smallTitleStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [COLLAPSE_DISTANCE * 0.5, COLLAPSE_DISTANCE],
      [0, 1],
      Extrapolation.CLAMP,
    );
    return { opacity };
  });

  // Optional: header bottom border fades in on scroll (like iOS)
  const headerBorderStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [0, 10],
      [0, 1],
      Extrapolation.CLAMP,
    );
    return { opacity };
  });

  return (
    <View style={styles.container}>
      {/* Sticky small header */}
      <View style={[styles.smallHeader, { paddingTop: insets.top }]}>
        <Animated.View style={[styles.headerBorder, headerBorderStyle]} />
        <Animated.Text
          style={[styles.smallTitle, smallTitleStyle]}
          numberOfLines={1}>
          {title}
        </Animated.Text>
      </View>

      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        contentContainerStyle={{
          paddingTop: insets.top + SMALL_HEADER_HEIGHT,
        }}>
        {/* Large title lives inside the scroll content */}
        <Animated.View style={[styles.largeTitleWrap, largeTitleStyle]}>
          <Text
            style={styles.largeTitle}
            numberOfLines={collapsible ? 1 : undefined}>
            {title}
          </Text>
        </Animated.View>

        {children}
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  smallHeader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: SMALL_HEADER_HEIGHT + (Platform.OS === "ios" ? 47 : 24), // rough, driven by insets.top in practice
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: 10,
    backgroundColor: "white",
    zIndex: 10,
  },
  headerBorder: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: StyleSheet.hairlineWidth,
    backgroundColor: "#ccc",
  },
  smallTitle: {
    fontSize: 17,
    fontWeight: "600",
  },
  largeTitleWrap: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    minHeight: LARGE_TITLE_HEIGHT,
    justifyContent: "flex-start",
  },
  largeTitle: {
    fontSize: 34,
    fontWeight: "700",
  },
});
