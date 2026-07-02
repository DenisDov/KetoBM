import { Button } from "@/components/button";
import { useAuthStore } from "@/hooks/use-auth-store";
import { Controller, useForm } from "react-hook-form";
import { TextInput } from "react-native";
import { Stack, useLocalSearchParams, Link, useRouter } from "expo-router";
import { Box, Text } from "@/components/primitives";

type FormData = {
  email: string;
  password: string;
};

export default function CreateAccountcreen() {
  const { register, signInWithGoogle, signInWithApple } = useAuthStore();
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
    <>
      <Stack.Screen options={{ title }} />
      <Box flex={1} padding="m">
        <Text>Create an account to start tracking your ketone journey.</Text>
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
        <Button title="Continue" onPress={handleSubmit(onSubmit)} />
        {/* <Link href="/terms">Terms</Link>
        <Link href="/policy">Policy</Link> */}
      </Box>
    </>
  );
}
