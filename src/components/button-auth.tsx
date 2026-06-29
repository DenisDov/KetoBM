import { PressableOpacity } from "pressto";
import { StyleSheet } from "react-native";
import { Text } from "@/components/primitives";
import { Fonts } from "@/theme/fonts";
import { FontAwesome } from "@react-native-vector-icons/fontawesome";

type ButtonVariant = "apple" | "google" | "email";

export const ButtonAuth = ({
  title,
  onPress,
  variant = "email",
}: {
  title: string;
  onPress?: () => void;
  variant?: ButtonVariant;
}) => {
  return (
    <PressableOpacity
      style={[
        styles.button,
        variant === "apple" && styles.buttonApple,
        variant === "google" && styles.buttonGoogle,
      ]}
      onPress={onPress}>
      {variant !== "email" && (
        <FontAwesome name={variant} size={24} color="#fff" />
      )}
      <Text style={[styles.text, variant === "email" && styles.textEmail]}>
        {title}
      </Text>
    </PressableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 16,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EBEBEB",
    gap: 12,
  },
  buttonApple: {
    backgroundColor: "#292929",
  },
  buttonGoogle: {
    backgroundColor: "#4385F5",
  },
  text: {
    fontSize: 16,
    color: "#fff",
    fontFamily: Fonts.medium,
  },
  textEmail: {
    color: "#000",
  },
});
