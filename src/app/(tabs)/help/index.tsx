import {
  Box,
  Text,
  PressableBox,
  ImageBackgroundBox,
} from "@/components/primitives";
import { Link, useRouter } from "expo-router";
import { ScrollView } from "react-native";
import { Ionicons } from "@react-native-vector-icons/ionicons";

const HELP_ITEMS = [
  { slug: "best-time-to-test", label: "When is best time to test?" },
  { slug: "ketone-readings", label: "What do my ketone readings mean?" },
  { slug: "glucose-readings", label: "What do my glucose readings mean?" },
  { slug: "readings-vary", label: "Why do my readings vary back to back?" },
  { slug: "how-to-use-meter", label: "How to use a meter?" },
] as const;

export type HelpSlug = (typeof HELP_ITEMS)[number]["slug"];

export default function HelpScreen() {
  const router = useRouter();
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <Box gap="sm" padding="m">
        <PressableBox
          backgroundColor="blue500"
          borderRadius="s"
          padding="sm"
          onPress={() => router.push("./help/support")}>
          <Text>Need help or have a question?</Text>
          <Text>1 unread message.</Text>
        </PressableBox>

        <PressableBox onPress={() => router.push("./help/video")}>
          <ImageBackgroundBox
            source={{
              uri: "https://legacy.reactjs.org/logo-og.png",
            }}
            borderRadius="sm"
            padding="sm"
            overflow="hidden"
            height={172}
            justifyContent="space-between">
            <Ionicons name="play" color="white" size={24} />
            <Text color="white" fontSize={16}>
              How to add new meter
            </Text>
          </ImageBackgroundBox>
        </PressableBox>

        <Box flexDirection="row" gap="sm">
          <PressableBox flex={1} onPress={() => router.push("./help/video")}>
            <ImageBackgroundBox
              source={{
                uri: "https://legacy.reactjs.org/logo-og.png",
              }}
              borderRadius="sm"
              padding="sm"
              overflow="hidden"
              height={172}
              justifyContent="space-between">
              <Ionicons name="play" color="white" size={24} />
              <Text color="white" fontSize={16}>
                How to add new meter
              </Text>
            </ImageBackgroundBox>
          </PressableBox>
          <PressableBox flex={1} onPress={() => router.push("./help/video")}>
            <ImageBackgroundBox
              source={{
                uri: "https://legacy.reactjs.org/logo-og.png",
              }}
              borderRadius="sm"
              padding="sm"
              overflow="hidden"
              height={172}
              justifyContent="space-between">
              <Ionicons name="play" color="white" size={24} />
              <Text color="white" fontSize={16}>
                How to add new meter
              </Text>
            </ImageBackgroundBox>
          </PressableBox>
        </Box>
        <PressableBox
          backgroundColor="blue500"
          flexDirection="row"
          alignItems="center"
          gap="m"
          borderRadius="s"
          padding="sm">
          <Ionicons name="flag" size={48} />
          <Text>
            Need help getting started? Take the app tour d df df dfd dg.
          </Text>
        </PressableBox>
        <Text textTransform="uppercase">Commonly asked questions</Text>
        <Box gap="sm">
          {HELP_ITEMS.map(({ slug, label }) => (
            <Link
              href={{ pathname: "/help/content", params: { slug } }}
              asChild
              key={slug}>
              <PressableBox
                flex={1}
                padding="m"
                backgroundColor="neutral50"
                borderRadius="s"
                flexDirection="row"
                alignItems="center">
                <Text fontSize={16} flex={1}>
                  {label}
                </Text>
                <Ionicons name="chevron-forward" size={20} />
              </PressableBox>
            </Link>
          ))}
        </Box>
      </Box>
    </ScrollView>
  );
}
