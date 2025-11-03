import { Button } from "@/components/button";
import { Text, View } from "@/components/Themed";
import { Image } from "expo-image";
import { Link } from "expo-router";
import { Dimensions, StyleSheet } from "react-native";

const { height } = Dimensions.get("window");

export default function LandingScreen() {
  return (
    <View style={styles.container}>
      <Image
        style={styles.image}
        source={require("../assets/app/images/landing.jpg")}
      />
      <View style={styles.content}>
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
  },
  image: {
    width: "100%",
    backgroundColor: "white",
    height: height * 0.6,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  description: {
    fontSize: 14,
    textAlign: "center",
    marginTop: 14,
    marginBottom: 40,
  },
  buttons: {
    gap: 16,
  },
});
