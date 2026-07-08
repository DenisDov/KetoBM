import { Ionicons } from "@react-native-vector-icons/ionicons";
import { useTheme } from "@shopify/restyle";
import { Button } from "@/components/button";
import { PasswordRules, TextField } from "@/components/form";
import { useAuthStore } from "@/hooks/use-auth-store";
import { Controller, useForm } from "react-hook-form";
import { useRouter } from "expo-router";
import { Box, Text } from "@/components/primitives";
import { isValidEmail, isValidPassword } from "@/lib/validation";
import { Theme } from "@/theme";

type FormData = {
  email: string;
  password: string;
};

export default function CreateAccountcreen() {
  const { register } = useAuthStore();
  const router = useRouter();
  const theme = useTheme<Theme>();

  const title = "Create your account";

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const email = watch("email");
  const password = watch("password");
  const emailValid = isValidEmail(email);

  const onSubmit = async (data: FormData) => {
    const email = data.email.trim();
    const password = data.password.trim();
    try {
      await register(email, password);
      router.push({ pathname: "/(auth)/verify-email", params: { email } });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Box flex={1} padding="m" gap="m">
      <Text variant="title">{title}</Text>
      <Text>It only takes a minute to get started.</Text>

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
            rightElement={
              emailValid ? (
                <Ionicons
                  name="checkmark-circle-outline"
                  size={22}
                  color={theme.colors.success}
                />
              ) : undefined
            }
          />
        )}
        name="email"
      />
      <Controller
        control={control}
        rules={{
          required: "Password is required.",
          validate: (value) =>
            isValidPassword(value) || "Password does not meet requirements.",
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextField
            label="Password"
            secureTextEntry
            placeholder="**********"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            autoCapitalize="none"
            autoCorrect={false}
          />
        )}
        name="password"
      />

      <PasswordRules password={password} />

      <Button title="Continue" onPress={handleSubmit(onSubmit)} />
      {/* <Link href="/terms">Terms</Link>
        <Link href="/policy">Policy</Link> */}
    </Box>
  );
}
