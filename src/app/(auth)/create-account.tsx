import { Button } from "@/components/button";
import { TextField } from "@/components/form";
import { useAuthStore } from "@/hooks/use-auth-store";
import { Controller, useForm } from "react-hook-form";
import { useRouter } from "expo-router";
import { Box, Text } from "@/components/primitives";

type FormData = {
  email: string;
  password: string;
};

export default function CreateAccountcreen() {
  const { register } = useAuthStore();
  const router = useRouter();

  const title = "Create your account";

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

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
      <Text>Create an account to start tracking your ketone journey.</Text>

      <Controller
        control={control}
        rules={{
          required: true,
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextField
            label="Email address"
            placeholder="email@example.com"
            error={errors.email ? "Email is required." : undefined}
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
      <Controller
        control={control}
        rules={{
          required: true,
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextField
            label="Password"
            secureTextEntry
            placeholder="**********"
            error={errors.password ? "Password is required." : undefined}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            autoCapitalize="none"
            autoCorrect={false}
          />
        )}
        name="password"
      />

      <Button title="Continue" onPress={handleSubmit(onSubmit)} />
      {/* <Link href="/terms">Terms</Link>
        <Link href="/policy">Policy</Link> */}
    </Box>
  );
}
