import { PressableOpacity } from "pressto";
import { StyleSheet, Text } from "react-native";

type ButtonVariant = "primary" | "secondary";

export const Button = ({
  title,
  onPress,
  variant = "primary",
}: {
  title: string;
  onPress?: () => void;
  variant?: ButtonVariant;
}) => {
  return (
    <PressableOpacity
      style={[
        styles.button,
        variant === "primary" ? styles.buttonPrimary : styles.buttonSecondary,
      ]}
      onPress={onPress}>
      <Text
        style={[styles.text, variant === "secondary" && styles.textSecondary]}>
        {title}
      </Text>
    </PressableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  buttonPrimary: {
    borderColor: "#25336D",
    backgroundColor: "#25336D",
    boxShadow: "0px 4px 6px 0px rgba(37, 51, 109, .21)",
  },
  buttonSecondary: {
    backgroundColor: "#fff",
  },
  text: {
    fontSize: 16,
    color: "#fff",
  },
  textSecondary: {
    color: "#000",
  },
});
