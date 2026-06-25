import { Button } from "@/components/button";
import { Text, View } from "@/components/Themed";
import { Image } from "expo-image";
import { Link } from "expo-router";
import { StyleSheet, useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Path } from "react-native-svg";

export default function LandingScreen() {
  const { bottom } = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  return (
    <View style={styles.container}>
      <Image
        style={styles.image}
        source={require("../../assets/images/landing.jpg")}
      />

      <View style={[styles.content, { paddingBottom: bottom }]}>
        <Svg
          height={50}
          width={width}
          viewBox={`0 0 ${width} 50`}
          style={styles.svg}>
          <Path
            d={`M 0 50 L 0 0 Q ${width / 2} 50 ${width} 0 L ${width} 50 Z`}
            fill="white"
          />
        </Svg>
        <Text style={styles.title}>
          {"Track your ketones and \n glucose. Own your health"}
        </Text>
        <Text style={styles.description}>
          {
            "Connect your KetoBM meter and see real- \n time readings on your phone."
          }
        </Text>
        <View style={styles.buttons}>
          <Link href="/auth-cta?mode=register" asChild>
            <Button title="Create account" />
          </Link>
          <Link href="/auth-cta?mode=login" asChild>
            <Button title="Login" variant="secondary" />
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
  svg: {
    position: "absolute",
    top: -50,
    // bottom: 0,
    left: 0,
    right: 0,
  },
});
