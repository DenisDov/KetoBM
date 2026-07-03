import { TextInput } from "react-native";
import { Box, Text } from "@/components/primitives";
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
    <Box flex={1} padding="m" gap="m">
      <Text variant="title">Request New Password</Text>

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
  );
}
