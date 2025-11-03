import { ConfigContext, ExpoConfig } from "expo/config";
import { version } from "./package.json";

const EAS_PROJECT_SLUG = "ketobm";
const EAS_PROJECT_ID = "6e76c95a-223d-4d04-8356-6889e4d06ddf";
const EAS_OWNER = "denisdov";

// EAS will inject APP_ENV and secrets into process.env
const APP_ENV = process.env.APP_ENV ?? "development";

const ENV_CONFIG = {
  development: {
    name: "KetoBM (Dev)",
    bundleIdentifier: "com.denisdov.ketobm.dev",
    packageName: "com.denisdov.ketobm.dev",
    icon: "./src/assets/images/icon.png",
    adaptiveIcon: "./src/assets/images/adaptive-icon.png",
    scheme: "ketobm-dev",
  },
  preview: {
    name: "KetoBM (Preview)",
    bundleIdentifier: "com.denisdov.ketobm.preview",
    packageName: "com.denisdov.ketobm.preview",
    icon: "./src/assets/images/icon.png",
    adaptiveIcon: "./src/assets/images/adaptive-icon.png",
    scheme: "ketobm-preview",
  },
  production: {
    name: "KetoBM",
    bundleIdentifier: "com.denisdov.ketobm",
    packageName: "com.denisdov.ketobm",
    icon: "./src/assets/images/icon.png",
    adaptiveIcon: "./src/assets/images/adaptive-icon.png",
    scheme: "ketobm",
  },
};

export default ({ config }: ConfigContext): ExpoConfig => {
  console.log("⚙️ Building app for environment:", APP_ENV);
  const env = APP_ENV as keyof typeof ENV_CONFIG;
  const envConfig = ENV_CONFIG[env]; //

  return {
    ...config,
    ...envConfig,
    slug: EAS_PROJECT_SLUG,
    version,
    orientation: "portrait",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    ios: {
      bundleIdentifier: envConfig.bundleIdentifier,
      supportsTablet: true,
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
      },
    },
    android: {
      package: envConfig.packageName,
      adaptiveIcon: {
        foregroundImage: envConfig.adaptiveIcon,
        backgroundColor: "#ffffff",
      },
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./src/assets/images/favicon.png",
    },
    plugins: [
      "expo-router",
      "expo-secure-store",
      "expo-sqlite",
      "expo-build-properties",
      [
        "expo-splash-screen",
        {
          image: "./src/assets/images/splash-icon.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#ffffff",
        },
      ],
    ],
    experiments: {
      typedRoutes: true,
    },
    owner: EAS_OWNER,
    updates: {
      url: `https://u.expo.dev/${EAS_PROJECT_ID}`,
    },
    runtimeVersion: {
      policy: "appVersion",
    },
    extra: {
      eas: {
        projectId: EAS_PROJECT_ID,
      },
      env: APP_ENV,
    },
  };
};
