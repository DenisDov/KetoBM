import { Box, Text } from "@/components/primitives";
import { Link } from "expo-router";
import { ScrollView } from "react-native";
import { PressableOpacity } from "pressto";

const HELP_ITEMS = [
  { slug: "best-time-to-test", label: "When is best time to test?" },
  { slug: "ketone-readings", label: "What do my ketone readings mean?" },
  { slug: "glucose-readings", label: "What do my glucose readings mean?" },
  { slug: "readings-vary", label: "Why do my readings vary back to back?" },
  { slug: "how-to-use-meter", label: "How to use a meter?" },
] as const;

export type HelpSlug = (typeof HELP_ITEMS)[number]["slug"];

export default function HelpScreen() {
  return (
    <ScrollView>
      <Box gap="m" padding="m">
        {HELP_ITEMS.map(({ slug, label }) => (
          <Link
            href={{ pathname: "/help/content", params: { slug } }}
            asChild
            key={slug}>
            <PressableOpacity
              style={{
                flex: 1,
                padding: 16,
                backgroundColor: "gray",
                borderRadius: 8,
              }}>
              <Text fontSize={16}>{label}</Text>
            </PressableOpacity>
          </Link>
        ))}
      </Box>
    </ScrollView>
  );
}
