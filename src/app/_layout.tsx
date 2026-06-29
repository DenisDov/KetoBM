import { ThemeProvider as RestyleThemeProvider } from "@shopify/restyle";
import { useFonts } from "expo-font";
import { ThemeProvider as NavProvider, Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { Platform, useColorScheme } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useAuthStore } from "@/hooks/use-auth-store";
import { theme, darkTheme } from "@/theme/theme";
import "react-native-reanimated";
import { Fonts } from "@/theme/fonts";
import { NavDarkAdapter, NavLightAdapter } from "@/theme/nav-theme";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(tabs)",
};

SplashScreen.setOptions({
  duration: 1000,
  fade: true,
});

const isWeb = Platform.OS === "web";

if (!isWeb) {
  SplashScreen.preventAutoHideAsync();
}

if (__DEV__) {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  require("../../ReactotronConfig");
}

export default function RootLayout() {
  const [fontsLoaded, error] = useFonts({
    [Fonts.regular]: require("../../assets/fonts/GeneralSans-Regular.otf"),
    [Fonts.medium]: require("../../assets/fonts/GeneralSans-Medium.otf"),
    [Fonts.semiBold]: require("../../assets/fonts/GeneralSans-Semibold.otf"),
    [Fonts.bold]: require("../../assets/fonts/GeneralSans-Bold.otf"),
  });

  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";
  const selectedRestyleTheme = isDarkMode ? darkTheme : theme;
  const selectedNavTheme = isDarkMode ? NavDarkAdapter : NavLightAdapter;

  const { restoreSession, initialized, user } = useAuthStore();

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

  if (!fontsLoaded || !initialized) {
    return null;
  }

  const isLoggedIn = !!user;
  const hasCompletedOnboarding = false;
  const shouldCreateAccount = false;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <RestyleThemeProvider theme={selectedRestyleTheme}>
        <NavProvider value={selectedNavTheme}>
          <Stack>
            <Stack.Protected guard={isLoggedIn}>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen
                name="modal"
                options={{ presentation: "modal", title: "lorem" }}
              />
            </Stack.Protected>
            <Stack.Protected guard={!isLoggedIn}>
              <Stack.Screen name="(auth)" options={{ headerShown: false }} />
              {/* <Stack.Protected guard={shouldCreateAccount}>
            <Stack.Screen name="create-account" />
          </Stack.Protected> */}
            </Stack.Protected>
            {/* <Stack.Protected guard={!hasCompletedOnboarding}>
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
      </Stack.Protected> */}
          </Stack>
        </NavProvider>
      </RestyleThemeProvider>
    </GestureHandlerRootView>
  );
}
