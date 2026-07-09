import { useEffect, useRef, useState } from "react";
import { ActivityIndicator } from "react-native";
import * as Linking from "expo-linking";
import { useLocalSearchParams, useRouter } from "expo-router";
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

const parseParamString = (paramString: string): Record<string, string> => {
  const params: Record<string, string> = {};
  for (const pair of paramString.split("&")) {
    if (!pair) continue;
    const [key, ...rest] = pair.split("=");
    params[decodeURIComponent(key)] = decodeURIComponent(rest.join("="));
  }
  return params;
};

// Collects params from both the query string and the hash fragment. Supabase
// recovery links redirect with tokens in the fragment (implicit flow) or a
// `code` query param (PKCE).
const extractUrlParams = (url: string): Record<string, string> =>
  parseParamString(url.split(/[?#]/).slice(1).join("&"));

// Opened via the deep link in the password-reset email. Lives outside the
// (auth) group: exchanging the recovery tokens signs the user in, which would
// unmount any screen behind the !isLoggedIn route guard.
export default function ResetPasswordScreen() {
  const { updatePassword, signOut, loading } = useAuthStore();
  const router = useRouter();

  const url = Linking.useURL();
  // Natively tracks the most recent URL that opened the app — immune to the
  // warm-start race where the "url" event fires before this screen mounts.
  const linkingUrl = Linking.useLinkingURL();
  // Expo Router also received the URL (it navigated here) and exposes the
  // hash fragment — where Supabase puts the tokens — as a special "#" param.
  const { "#": hash } = useLocalSearchParams<{ "#": string }>();
  const handled = useRef(false);
  const [status, setStatus] = useState<Status>("pending");

  useEffect(() => {
    if (handled.current) return;

    const params = {
      ...(url ? extractUrlParams(url) : {}),
      ...(linkingUrl ? extractUrlParams(linkingUrl) : {}),
      ...(typeof hash === "string" ? parseParamString(hash) : {}),
    };

    console.log("[reset-password] link", {
      url,
      linkingUrl,
      hash,
      paramKeys: Object.keys(params),
      error: params.error ?? params.error_code ?? null,
    });

    const hasError = !!(
      params.error ||
      params.error_code ||
      params.error_description
    );
    const hasCredentials =
      !!(params.access_token && params.refresh_token) || !!params.code;

    if (!hasError && !hasCredentials) {
      // Nothing usable in the link (yet) — fall back to an existing session
      // (e.g. the tokens were already exchanged and this screen re-mounted),
      // then give the URL a moment to be delivered before declaring the link
      // dead. A late-arriving URL re-runs this effect and recovers.
      supabase.auth.getSession().then(({ data }) => {
        if (handled.current || !data.session) return;
        handled.current = true;
        setStatus("ready");
      });
      const timer = setTimeout(() => {
        if (!handled.current) setStatus("invalid");
      }, 3000);
      return () => clearTimeout(timer);
    }

    handled.current = true;
    const establishSession = async () => {
      try {
        if (hasError) {
          throw new Error(
            params.error_description ?? params.error_code ?? params.error,
          );
        }
        if (params.access_token && params.refresh_token) {
          const { error } = await supabase.auth.setSession({
            access_token: params.access_token,
            refresh_token: params.refresh_token,
          });
          if (error) throw error;
        } else {
          const { error } = await supabase.auth.exchangeCodeForSession(
            params.code,
          );
          if (error) throw error;
        }
        setStatus("ready");
      } catch (error) {
        console.log(error);
        setStatus("invalid");
      }
    };
    establishSession();
  }, [url, linkingUrl, hash]);

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
