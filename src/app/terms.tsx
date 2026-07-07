import { Link } from "expo-router";
// import { getDefaultHeaderHeight } from "expo-router/react-navigation";
import { useState } from "react";
// import { useWindowDimensions } from "react-native";
import {
  // useSafeAreaInsets,
  SafeAreaView,
} from "react-native-safe-area-context";
import { Box, Text } from "@/components/primitives";
import { Button } from "@/components/button";
import { Checkbox } from "@/components/form";
import { useAuthStore } from "@/hooks/use-auth-store";

export default function TermsScreen() {
  const { acceptTerms, signOut, loading } = useAuthStore();

  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [agreedToPolicy, setAgreedToPolicy] = useState(false);

  // const layout = useWindowDimensions();
  // const insets = useSafeAreaInsets();
  // const headerHeight = getDefaultHeaderHeight(layout, false, insets.top);

  const onContinue = async () => {
    try {
      await acceptTerms();
    } catch (error) {
      console.error(error);
    }
  };

  const onSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Box flex={1} padding="m" gap="m">
        <Text variant="title">Terms & conditions</Text>
        <Text>
          This app connects to your meter to display your results. To provide
          access to your data across devices, your readings will be securely
          stored in the cloud, accessible only to you. We use industry-standard
          encryption to protect your data. By tapping {"'I Agree,'"} you consent
          to the collection, use, and cloud storage of your data as described in
          our Privacy Policy.
        </Text>

        <Box backgroundColor="neutral50" borderRadius="sm" padding="m">
          <Checkbox
            checked={agreedToTerms}
            onChange={setAgreedToTerms}
            label="I Agree to terms & conditions"
          />
        </Box>

        <Box backgroundColor="neutral50" borderRadius="sm" padding="m">
          <Checkbox
            checked={agreedToPolicy}
            onChange={setAgreedToPolicy}
            label=" I Agree to Privacy Policy"
          />
        </Box>

        <Button
          title="Continue"
          disabled={!agreedToTerms || !agreedToPolicy || loading}
          onPress={onContinue}
        />

        <Box flex={1} />

        <Button
          title="Sign out"
          variant="link"
          disabled={loading}
          onPress={onSignOut}
        />
      </Box>
    </SafeAreaView>
  );
}
