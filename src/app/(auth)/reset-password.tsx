import { Button } from "@/components/button";
import { useAuthStore } from "@/hooks/use-auth-store";
import { Controller, useForm } from "react-hook-form";
import { TextInput } from "react-native";
import { Stack, useLocalSearchParams, Link, useRouter } from "expo-router";
import { Box, Text } from "@/components/primitives";

type FormData = {
  password1: string;
  password2: string;
};

// WILL BE PENED THROUGH DEEPLINK
export default function ResetPasswordScreen() {
  const { login, register, signInWithGoogle, signInWithApple } = useAuthStore();
  const router = useRouter();

  //   const isLoginMode = mode !== "register";
  const title = "Reset password";

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      password1: "",
      password2: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    console.log("RESET CTA");
  };

  return (
    <>
      <Stack.Screen options={{ title }} />
      <Box flex={1} padding="m">
        <Text>Create a new strong password.</Text>

        <Text>New password</Text>
        <Controller
          control={control}
          rules={{
            required: true,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              //   secureTextEntry
              placeholder="**********"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              autoCapitalize="none"
              autoCorrect={false}
            />
          )}
          name="password1"
        />
        {errors.password1 && <Text>Password is required.</Text>}
        <Text>Password</Text>
        <Controller
          control={control}
          rules={{
            required: true,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              //   secureTextEntry
              placeholder="**********"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              autoCapitalize="none"
              autoCorrect={false}
            />
          )}
          name="password2"
        />
        {errors.password2 && <Text>Password is required.</Text>}
        <Button title="Save" onPress={handleSubmit(onSubmit)} />
        {/* <Link href="/terms">Terms</Link>
        <Link href="/policy">Policy</Link>
        <Link href="/modal">Policy</Link> */}
      </Box>
    </>
  );
}
