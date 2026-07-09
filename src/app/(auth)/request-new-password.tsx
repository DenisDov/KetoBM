import { Button } from "@/components/button";
import { TextField } from "@/components/form";
import { useAuthStore } from "@/hooks/use-auth-store";
import { isValidEmail } from "@/lib/validation";
import { Controller, useForm } from "react-hook-form";
import { useRouter } from "expo-router";
import { Box, Text } from "@/components/primitives";

type FormData = {
  email: string;
};

export default function RequestNewPasswordScreen() {
  const { requestPasswordReset, loading } = useAuthStore();
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    const email = data.email.trim();
    try {
      await requestPasswordReset(email);
      router.push({ pathname: "/check-email", params: { email } });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Box flex={1} padding="m" gap="m">
      <Text variant="title">Forgot password?</Text>
      <Text>
        Enter the email address associated with your account and we’ll send you
        a link to reset your password.
      </Text>

      <Controller
        control={control}
        rules={{
          required: "Email is required.",
          validate: (value) =>
            isValidEmail(value) || "Enter a valid email address.",
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextField
            label="Email address"
            placeholder="email@example.com"
            error={errors.email?.message}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
          />
        )}
        name="email"
      />

      <Button
        title="Send reset link"
        disabled={loading}
        onPress={handleSubmit(onSubmit)}
      />
    </Box>
  );
}
