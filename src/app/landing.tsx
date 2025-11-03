import { Button } from "@/components/button";
import { Text, View } from "@/components/Themed";
import { Image } from "expo-image";
import { Link } from "expo-router";
import { StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function LandingScreen() {
  const { bottom } = useSafeAreaInsets();
  return (
    <View style={styles.container}>
      <Image
        style={styles.image}
        source={require("../assets/app/images/landing.jpg")}
      />
      <View style={[styles.content, { paddingBottom: bottom }]}>
        <Text style={styles.title}>
          {"Track your ketones and \n glucose. Own your health"}
        </Text>
        <Text style={styles.description}>
          {
            "Connect your KetoBM meter and see real- \n time readings on your phone."
          }
        </Text>
        <View style={styles.buttons}>
          <Link href="/create-account" asChild>
            <Button title="Create account" />
          </Link>
          <Link href="/sign-in" asChild>
            <Button title="Login" />
          </Link>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "flex-end",
  },
  image: {
    flex: 1,
    width: "100%",
    backgroundColor: "white",
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 32,
  },
  title: {
    fontSize: 24,
    color: "#181A1E",
    fontWeight: "bold",
    textAlign: "center",
  },
  description: {
    fontSize: 14,
    color: "#5F616C",
    textAlign: "center",
    marginTop: 14,
    marginBottom: 40,
  },
  buttons: {
    gap: 16,
  },
});
