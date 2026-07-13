import { ThemeProvider as RestyleThemeProvider } from "@shopify/restyle";
import { useFonts } from "expo-font";
import { ThemeProvider as NavProvider, Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { Platform, useColorScheme, AppStateStatus } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { useAuthStore } from "@/hooks/use-auth-store";
import { BleSync } from "@/components/ble-sync";
import { lightTheme, darkTheme } from "@/theme/theme";
import "react-native-reanimated";
import { Fonts } from "@/theme/fonts";
import { NavDarkAdapter, NavLightAdapter } from "@/theme/nav-theme";
import { defaultScreenOptions } from "@/theme/screen-options";
import { QueryClientProvider, focusManager } from "@tanstack/react-query";
import { useAppState } from "@/hooks/tanstack-query/use-app-state";
import { useOnlineManager } from "@/hooks/tanstack-query/use-online-manager";
import { queryClient } from "@/lib/query-client";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

SplashScreen.setOptions({
  duration: 1000,
  fade: true,
});

const isWeb = Platform.OS === "web";

function onAppStateChange(status: AppStateStatus) {
  // React Query already supports in web browser refetch on window focus by default
  if (Platform.OS !== "web") {
    focusManager.setFocused(status === "active");
  }
}

if (!isWeb) {
  SplashScreen.preventAutoHideAsync();
}

if (__DEV__) {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  require("@/lib/reactotron");
}

export default function RootLayout() {
  const [fontsLoaded, error] = useFonts({
    [Fonts.regular]: require("@/assets/fonts/GeneralSans-Regular.otf"),
    [Fonts.medium]: require("@/assets/fonts/GeneralSans-Medium.otf"),
    [Fonts.semiBold]: require("@/assets/fonts/GeneralSans-Semibold.otf"),
    [Fonts.bold]: require("@/assets/fonts/GeneralSans-Bold.otf"),
  });

  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";
  const selectedRestyleTheme = isDarkMode ? darkTheme : lightTheme;
  const selectedNavTheme = isDarkMode ? NavDarkAdapter : NavLightAdapter;

  const { restoreSession, initialized, user, profile } = useAuthStore();

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    restoreSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (initialized) {
      SplashScreen.hideAsync();
    }
  }, [initialized]);

  useOnlineManager();

  useAppState(onAppStateChange);

  if (!fontsLoaded || !initialized) {
    return null;
  }

  const isLoggedIn = !!user;
  const hasAcceptedTerms =
    !!profile?.terms_accepted_at && !!profile?.privacy_accepted_at;
  const hasCompletedOnboarding = !!profile?.onboarding_completed_at;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <RestyleThemeProvider theme={selectedRestyleTheme}>
          <NavProvider value={selectedNavTheme}>
            <BottomSheetModalProvider>
              {isLoggedIn && <BleSync />}
              <Stack>
                <Stack.Protected
                  guard={
                    isLoggedIn && hasAcceptedTerms && hasCompletedOnboarding
                  }>
                  <Stack.Screen
                    name="(tabs)"
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name="pairing"
                    options={{ presentation: "modal", headerShown: false }}
                  />
                  {/* Note editor for a reading. Root-level so it covers the
                      tab bar and is reachable from both Home and Readings. */}
                  <Stack.Screen
                    name="note/[readingId]"
                    options={{
                      ...defaultScreenOptions,
                      headerTransparent: false,
                      headerShadowVisible: false,
                    }}
                  />
                </Stack.Protected>
                <Stack.Protected
                  guard={
                    isLoggedIn && hasAcceptedTerms && !hasCompletedOnboarding
                  }>
                  <Stack.Screen
                    name="onboarding"
                    options={{ headerShown: false }}
                  />
                </Stack.Protected>
                <Stack.Protected guard={isLoggedIn && !hasAcceptedTerms}>
                  <Stack.Screen
                    name="terms"
                    options={{
                      headerShown: false,
                    }}
                  />
                </Stack.Protected>
                <Stack.Protected guard={!isLoggedIn}>
                  <Stack.Screen
                    name="(auth)"
                    options={{ headerShown: false }}
                  />
                </Stack.Protected>
                <Stack.Screen
                  name="policy"
                  options={{ presentation: "modal", title: "Privacy Policy" }}
                />
                {/* Password-reset deep-link screens. Deliberately unguarded:
                    the recovery link signs the user in mid-flow, so any
                    auth-state guard would unmount them. */}
                <Stack.Screen
                  name="reset-password"
                  options={{
                    ...defaultScreenOptions,
                    headerTransparent: false,
                    headerShadowVisible: false,
                  }}
                />
                <Stack.Screen
                  name="password-updated"
                  options={{
                    ...defaultScreenOptions,
                    headerTransparent: false,
                    headerShadowVisible: false,
                  }}
                />
              </Stack>
            </BottomSheetModalProvider>
          </NavProvider>
        </RestyleThemeProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
