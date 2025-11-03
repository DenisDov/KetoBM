import { Text, View } from "@/components/Themed";
import { Link } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import { PressableOpacity } from "pressto";
import { StyleSheet } from "react-native";

export default function AuthCTAScreen() {
  return (
    <View style={styles.container}>
      <View>
        <Link href="/landing" asChild>
          <PressableOpacity>
            <ArrowLeft />
          </PressableOpacity>
        </Link>
      </View>
      <Text>Login to your account</Text>
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
    justifyContent: "center",
  },
});
