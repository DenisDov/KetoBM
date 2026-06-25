import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "expo-router/react-navigation";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { Platform } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";

import { useColorScheme } from "@/components/useColorScheme";
import { useAuthStore } from "@/hooks/use-auth-store";

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
  require("../../ReactotronConfig");
}

const headerOptions = {
  headerLargeTitle: true,
  headerTransparent: false,
  headerBackButtonDisplayMode: "minimal",
  headerBackImageSource: require("../../assets/icons/arrow-left.png"),
  headerTintColor: "#181A1E",
} as const;

export default function RootLayout() {
  const [fontsLoaded, error] = useFonts({
    SpaceMono: require("../../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  const colorScheme = useColorScheme();
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
    <GestureHandlerRootView>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Protected guard={isLoggedIn}>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen
              name="modal"
              options={{ presentation: "modal", title: "lorem" }}
            />
          </Stack.Protected>
          <Stack.Protected guard={!isLoggedIn}>
            <Stack.Screen name="landing" options={{ headerShown: false }} />
            <Stack.Screen name="(auth)/auth-cta" options={headerOptions} />
            <Stack.Screen name="(auth)/auth" options={headerOptions} />
            {/* <Stack.Screen name="register" /> */}
            {/* <Stack.Protected guard={shouldCreateAccount}>
            <Stack.Screen name="create-account" />
          </Stack.Protected> */}
          </Stack.Protected>
          {/* <Stack.Protected guard={!hasCompletedOnboarding}>
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
      </Stack.Protected> */}
        </Stack>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
