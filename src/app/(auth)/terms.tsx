import { Link } from "expo-router";
import { Box, Text } from "@/components/primitives";
import { Button } from "@/components/button";

export default function TermsScreen() {
  const title = "Terms & conditions";

  return (
    <Box flex={1} padding="m" gap="m">
      <Text variant="title">{title}</Text>
      <Text>
        This app connects to your meter to display your results. To provide
        access to your data across devices, your readings will be securely
        stored in the cloud, accessible only to you. We use industry-standard
        encryption to protect your data. By tapping {"'I Agree,'"} you consent
        to the collection, use, and cloud storage of your data as described in
        our Privacy Policy.
      </Text>
      <Box></Box>
      <Box>
        <Text>I Agree to terms & conditions</Text>
      </Box>
      <Box flexDirection="row" alignItems="center">
        <Text>I Agree to </Text>
        <Link href="/policy" asChild>
          <Text textDecorationLine="underline">Privacy Policy</Text>
        </Link>
      </Box>
      <Button title="Continue" onPress={() => null} />
    </Box>
  );
}
