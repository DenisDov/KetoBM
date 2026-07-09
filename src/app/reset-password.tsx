import { useEffect, useRef, useState } from "react";
import { ActivityIndicator } from "react-native";
import * as Linking from "expo-linking";
import { useRouter } from "expo-router";
import { Controller, useForm, useWatch } from "react-hook-form";
import { Button } from "@/components/button";
import { PasswordRules, TextField } from "@/components/form";
import { Box, Text } from "@/components/primitives";
import { useAuthStore } from "@/hooks/use-auth-store";
import { supabase } from "@/lib/supabase";
import { isValidPassword } from "@/lib/validation";

type FormData = {
  password: string;
  confirmPassword: string;
};

type Status = "pending" | "ready" | "invalid";

// Collects params from both the query string and the hash fragment. Supabase
// recovery links redirect with tokens in the fragment (implicit flow) or a
// `code` query param (PKCE).
const extractUrlParams = (url: string): Record<string, string> => {
  const paramString = url.split(/[?#]/).slice(1).join("&");
  const params: Record<string, string> = {};
  for (const pair of paramString.split("&")) {
    if (!pair) continue;
    const [key, ...rest] = pair.split("=");
    params[decodeURIComponent(key)] = decodeURIComponent(rest.join("="));
  }
  return params;
};

// Opened via the deep link in the password-reset email. Lives outside the
// (auth) group: exchanging the recovery tokens signs the user in, which would
// unmount any screen behind the !isLoggedIn route guard.
export default function ResetPasswordScreen() {
  const { updatePassword, signOut, loading } = useAuthStore();
  const router = useRouter();

  const url = Linking.useURL();
  const handledUrl = useRef<string | null>(null);
  const [status, setStatus] = useState<Status>("pending");

  useEffect(() => {
    if (!url) {
      // No deep link (yet) — fall back to an existing session, e.g. when the
      // link was already exchanged and this screen re-mounted.
      supabase.auth.getSession().then(({ data }) => {
        if (data.session) {
          setStatus((current) => (current === "pending" ? "ready" : current));
        }
      });
      return;
    }
    if (handledUrl.current === url) return;
    handledUrl.current = url;

    const establishSession = async () => {
      const params = extractUrlParams(url);
      if (params.error_code || params.error_description) {
        setStatus("invalid");
        return;
      }
      try {
        if (params.access_token && params.refresh_token) {
          const { error } = await supabase.auth.setSession({
            access_token: params.access_token,
            refresh_token: params.refresh_token,
          });
          if (error) throw error;
          setStatus("ready");
        } else if (params.code) {
          const { error } = await supabase.auth.exchangeCodeForSession(
            params.code,
          );
          if (error) throw error;
          setStatus("ready");
        } else {
          const { data } = await supabase.auth.getSession();
          setStatus(data.session ? "ready" : "invalid");
        }
      } catch (error) {
        console.log(error);
        setStatus("invalid");
      }
    };
    establishSession();
  }, [url]);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    mode: "onChange",
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const password = useWatch({ control, name: "password" });

  const onSubmit = async (data: FormData) => {
    try {
      await updatePassword(data.password.trim());
      // The recovery session has served its purpose — sign out so the user
      // confirms the new password by logging in with it.
      await signOut();
      router.replace("/password-updated");
    } catch (error) {
      console.error(error);
    }
  };

  if (status === "pending") {
    return (
      <Box flex={1} justifyContent="center" alignItems="center">
        <ActivityIndicator />
      </Box>
    );
  }

  if (status === "invalid") {
    return (
      <Box flex={1} padding="m" gap="m" justifyContent="center">
        <Text variant="title">This link has expired</Text>
        <Text>
          Password reset links are only valid for a short time. Request a new
          one to continue.
        </Text>
        <Button
          title="Request a new link"
          onPress={() => router.replace("/request-new-password")}
        />
      </Box>
    );
  }

  return (
    <Box flex={1} padding="m" gap="m">
      <Text variant="title">Reset password</Text>
      <Text>Create a new strong password.</Text>

      <Controller
        control={control}
        rules={{
          required: "Password is required.",
          validate: (value) =>
            isValidPassword(value) || "Password does not meet requirements.",
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextField
            label="New password"
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
      <Controller
        control={control}
        rules={{
          required: "Please confirm your password.",
          validate: (value) => value === password || "Passwords do not match.",
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextField
            label="Confirm new password"
            secureTextEntry
            placeholder="**********"
            error={errors.confirmPassword?.message}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            autoCapitalize="none"
            autoCorrect={false}
          />
        )}
        name="confirmPassword"
      />

      <PasswordRules password={password} />

      <Button
        title="Save"
        disabled={loading}
        onPress={handleSubmit(onSubmit)}
      />
    </Box>
  );
}
