import { Box, Text } from "@/components/primitives";
import { ScrollView } from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
import { KETONE_LEVELS, KetoneLevel } from "@/components/ketone-levels";
import { HelpSlug } from "./index";

type HelpContent = {
  title: string;
  Component: React.FC;
};

const BestTimeToTest = () => (
  <Text>Morning fasting readings are most consistent...</Text>
);

const KetoneReadings = () =>
  KETONE_LEVELS.map((level) => <KetoneLevel key={level.label} {...level} />);

const CONTENT_MAP: Record<HelpSlug, HelpContent> = {
  "best-time-to-test": {
    title: "Best Time to Test",
    Component: BestTimeToTest,
  },
  "ketone-readings": {
    title: "What Do My Ketone Readings Mean?",
    Component: KetoneReadings,
  },
  "glucose-readings": {
    title: "What Do My Glucose Readings Mean?",
    Component: () => <Text>...</Text>,
  },
  "readings-vary": {
    title: "Why Do My Readings Vary?",
    Component: () => <Text>...</Text>,
  },
  "how-to-use-meter": {
    title: "How to Use a Meter?",
    Component: () => <Text>...</Text>,
  },
};

export default function HelpContentScreen() {
  const { slug } = useLocalSearchParams<{ slug: HelpSlug }>();
  const content = CONTENT_MAP[slug];

  if (!content) return <Text>Not found</Text>;

  const { title, Component } = content;

  return (
    <>
      <Stack.Screen options={{ title }} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <Box padding="m" gap="ml">
          <Text variant="title">{title}</Text>
          <Component />
        </Box>
      </ScrollView>
    </>
  );
}
