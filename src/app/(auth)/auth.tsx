import { Button } from "@/components/button";
import { useAuthStore } from "@/hooks/use-auth-store";
import { Controller, useForm } from "react-hook-form";
import { TextInput } from "react-native";
import { Stack, useLocalSearchParams, Link } from "expo-router";
import { Box, Text } from "@/components/primitives";

type FormData = {
  email: string;
  password: string;
};

export default function SignInScreen() {
  const { mode } = useLocalSearchParams<{ mode?: "login" | "register" }>();
  const { login, register, signInWithGoogle, signInWithApple } = useAuthStore();

  const isLoginMode = mode !== "register";
  const title = isLoginMode ? "Welcome back." : "Create your account";

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
    try {
      if (isLoginMode) {
        await login(data.email, data.password);
      } else {
        await register(data.email, data.password);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Stack.Screen options={{ title }} />
      <Box flex={1} padding="m">
        <Text>
          {isLoginMode
            ? "Enter your credentials to track your ketone journey."
            : "Create an account to start tracking your ketone journey."}
        </Text>
        {/* <Button title="Sign In with Google" onPress={signInWithGoogle} />
      <Button title="Sign In with Apple" onPress={signInWithApple} /> */}

        <Text>Email address</Text>
        <Controller
          control={control}
          rules={{
            required: true,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              placeholder="email@example.com"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              autoCapitalize="none"
              autoCorrect={false}
            />
          )}
          name="email"
        />
        {errors.email && <Text>Email is required.</Text>}
        <Text>Password</Text>
        <Controller
          control={control}
          rules={{
            required: true,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
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
        {errors.password && <Text>Password is required.</Text>}
        {isLoginMode && <Text>Forgot password?</Text>}
        <Button
          title={isLoginMode ? "Login" : "Create Account"}
          onPress={handleSubmit(onSubmit)}
        />
        <Link href="/terms">Terms</Link>
        <Link href="/policy">Policy</Link>
      </Box>
    </>
  );
}
