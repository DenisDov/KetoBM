import { Button } from "@/components/button";
import { Text, View } from "@/components/Themed";
import { useAuthStore } from "@/hooks/use-auth-store";
import { Controller, useForm } from "react-hook-form";
import { StyleSheet, TextInput } from "react-native";

type FormData = {
  email: string;
  password: string;
};

export default function SignInScreen() {
  const {
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogle,
    signInWithApple,
  } = useAuthStore();

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
  const onSubmit = (data: FormData) => {
    signInWithEmail(data.email, data.password);
  };

  return (
    <View style={styles.container}>
      <Text>Welcome back.</Text>
      <Text>Enter your credentials to track your ketone journey.</Text>
      {/* <Button title="create account with Email" onPress={() => signUpWithEmail('test@test.com', 'test123')} />
      <Button title="login with Email" onPress={() => signInWithEmail('test@test.com', 'test123')} />
      <Button title="Sign In with Google" onPress={signInWithGoogle} />
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
      {errors.email && <Text>This is required.</Text>}
      <Text>Password</Text>
      <Controller
        control={control}
        rules={{
          required: true,
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
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
      {errors.email && <Text>This is required.</Text>}
      <Text>Forgot password?</Text>
      {/* <Button
        title="login with Email"
        onPress={() => signInWithEmail("test@test.com", "test123")}
      /> */}
      <Button title="login with Email" onPress={handleSubmit(onSubmit)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: "center",
    // justifyContent: "center",
  },
});
