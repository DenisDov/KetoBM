import { Button } from "@/components/button";
import { useAuthStore } from "@/hooks/use-auth-store";
import { useRef, useState } from "react";
import {
  NativeSyntheticEvent,
  TextInput,
  TextInputKeyPressEvent,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Box, Text } from "@/components/primitives";

const OTP_LENGTH = 6;

export default function VerifyEmailScreen() {
  const { email } = useLocalSearchParams<{ email: string }>();
  const { verifyEmailOtp } = useAuthStore();

  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const inputs = useRef<(TextInput | null)[]>([]);

  const submit = async (code: string) => {
    setError(null);
    setSubmitting(true);
    try {
      await verifyEmailOtp(email, code);
    } catch {
      setError("That code didn't work. Please try again.");
      setDigits(Array(OTP_LENGTH).fill(""));
      inputs.current[0]?.focus();
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (text: string, index: number) => {
    const value = text.replace(/[^0-9]/g, "").slice(-1);
    const next = [...digits];
    next[index] = value;
    setDigits(next);

    if (value && index < OTP_LENGTH - 1) {
      inputs.current[index + 1]?.focus();
    }

    if (value && index === OTP_LENGTH - 1 && next.every((digit) => digit)) {
      submit(next.join(""));
    }
  };

  const handleKeyPress = (
    e: NativeSyntheticEvent<TextInputKeyPressEvent>,
    index: number,
  ) => {
    if (e.nativeEvent.key === "Backspace" && !digits[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  return (
    <Box flex={1} padding="m" gap="m">
      <Text variant="title">Verify your email</Text>
      <Text>We have sent you a 6-digit code to {email}, enter it below:</Text>

      <Box flexDirection="row" gap="s" marginVertical="m">
        {digits.map((digit, index) => (
          <TextInput
            key={index}
            ref={(ref) => {
              inputs.current[index] = ref;
            }}
            value={digit}
            onChangeText={(text) => handleChange(text, index)}
            onKeyPress={(e) => handleKeyPress(e, index)}
            keyboardType="number-pad"
            maxLength={1}
            editable={!submitting}
            style={{
              width: 44,
              height: 52,
              borderWidth: 1,
              borderColor: "#999",
              borderRadius: 8,
              textAlign: "center",
              fontSize: 20,
            }}
          />
        ))}
      </Box>

      {error && <Text color="error">{error}</Text>}

      <Button
        title="Continue"
        disabled={submitting || digits.some((digit) => !digit)}
        onPress={() => submit(digits.join(""))}
      />
    </Box>
  );
}
