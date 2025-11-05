import { Text, View } from "@/components/Themed";
import { Link, useLocalSearchParams, useNavigation } from "expo-router";
import { PressableOpacity } from "pressto";
import { useEffect } from "react";
import { StyleSheet } from "react-native";

export default function AuthCTAScreen() {
  const { type } = useLocalSearchParams();
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      title:
        type === "create" ? "Create your account" : "Login to your account",
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <PressableOpacity>
        <Text>Continue with Google</Text>
      </PressableOpacity>
      <PressableOpacity>
        <Text>Continue with Apple</Text>
      </PressableOpacity>
      <Text>or</Text>
      <Link href="/sign-in" asChild>
        <PressableOpacity>
          <Text>Continue with Email</Text>
        </PressableOpacity>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
