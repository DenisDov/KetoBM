import { Box, Text } from "@/components/primitives";
import { ScrollView } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { KETONE_LEVELS, KetoneLevel } from "@/components/ketone-levels";
import { HelpSlug } from "./index";

type HelpContent = {
  title: string;
  Component: React.FC;
};

const BestTimeToTest = () => (
  <Text variant="body">
    The best time to test ketones depends on individual health goals and whether
    you&apos;re using blood or urine tests.For monitoring ketosis for weight
    loss, testing a few hours after meals, particularly after dinner, can be
    helpful.If you have diabetes and are monitoring ketones due to high blood
    sugar or illness, testing every 4-6 hours is recommended.
  </Text>
);

const KetoneReadings = () =>
  KETONE_LEVELS.map((level) => <KetoneLevel key={level.label} {...level} />);

const CONTENT_MAP: Record<HelpSlug, HelpContent> = {
  "best-time-to-test": {
    title: "When is best time to test?",
    Component: BestTimeToTest,
  },
  "ketone-readings": {
    title: "What do my ketone readings mean?",
    Component: KetoneReadings,
  },
  "glucose-readings": {
    title: "What do my glucose readings mean?",
    Component: () => <Text>...</Text>,
  },
  "readings-vary": {
    title: "Why do my readings vary?",
    Component: () => <Text>...</Text>,
  },
  "how-to-use-meter": {
    title: "How to use a meter?",
    Component: () => <Text>...</Text>,
  },
};

export default function HelpContentScreen() {
  const { slug } = useLocalSearchParams<{ slug: HelpSlug }>();
  const content = CONTENT_MAP[slug];

  if (!content) return <Text>Not found</Text>;

  const { title, Component } = content;

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <Box padding="m" gap="m">
        <Text variant="title">{title}</Text>
        <Component />
      </Box>
    </ScrollView>
  );
}
