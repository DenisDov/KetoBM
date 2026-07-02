import { Button } from "@/components/button";
import { TextField } from "@/components/form";
import { useAuthStore } from "@/hooks/use-auth-store";
import { Controller, useForm } from "react-hook-form";
import { Stack, useLocalSearchParams, Link, useRouter } from "expo-router";
import { Box, Text } from "@/components/primitives";

type FormData = {
  email: string;
  password: string;
};

export default function Logincreen() {
  // const { mode } = useLocalSearchParams<{ mode?: "login" | "register" }>();
  const { login, signInWithGoogle, signInWithApple } = useAuthStore();
  const router = useRouter();

  // const isLoginMode = mode !== "register";
  const title = "Welcome back.";

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
      await login(email, password);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Stack.Screen options={{ title }} />
      <Box flex={1} padding="m" gap="m">
        <Text>Enter your credentials to track your ketone journey.</Text>
        {/* <Button title="Sign In with Google" onPress={signInWithGoogle} />
      <Button title="Sign In with Apple" onPress={signInWithApple} /> */}

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

        <Link href="/request-new-password">Forgot password?</Link>

        <Button title="Login" onPress={handleSubmit(onSubmit)} />
        {/* <Link href="/terms">Terms</Link>
        <Link href="/policy">Policy</Link> */}
      </Box>
    </>
  );
}
