import { Link, Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Platform, TextInput } from "react-native";
import * as Linking from "expo-linking";
import { Box, Text } from "@/components/primitives";
import { ButtonAuth } from "@/components/button-auth";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/button";
import { supabase } from "@/lib/supabase";

type FormData = {
  email: string;
};

export default function RequestNewPasswordScreen() {
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
    console.log("REQ PASS");
    const { data: sdata, error } = supabase.auth.resetPasswordForEmail(
      data.email,
      {
        redirectTo: "ketobm-dev://reset-password",
      },
    );
    console.log("sdata", sdata);
    console.log("error", error);
  };

  return (
    <>
      {/* <Stack.Screen options={{ title }} /> */}
      <Box flex={1} padding="m" gap="m">
        <Text>RequestNewPasswordScreen</Text>

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

        <Text>OR USE PHONE NUMBER</Text>

        <Button title="Send" onPress={handleSubmit(onSubmit)} />
      </Box>
    </>
  );
}
