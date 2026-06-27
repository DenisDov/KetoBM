import FontAwesome from "@expo/vector-icons/FontAwesome";
import { ThemeProvider } from "@shopify/restyle";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { Platform, useColorScheme } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useAuthStore } from "@/hooks/use-auth-store";
import { theme, darkTheme } from "@/theme/theme";
import "react-native-reanimated";

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
    Regular: require("../../assets/fonts/GeneralSans-Regular.otf"),
    SemiBold: require("../../assets/fonts/GeneralSans-Semibold.otf"),
    ...FontAwesome.font,
  });

  const colorScheme = useColorScheme();
  const darkMode = colorScheme === "dark";

  const headerOptions = {
    headerLargeTitle: true,
    headerTransparent: false,
    headerBackButtonDisplayMode: "minimal",
    headerBackImageSource: require("../../assets/icons/arrow-left.png"),
    headerTintColor: darkMode ? "#fff" : "#000",
  } as const;

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
      <ThemeProvider theme={darkMode ? darkTheme : theme}>
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
