import { NativeTabs } from "expo-router/unstable-native-tabs";

export default function TabLayout() {
  return (
    <NativeTabs
    // backgroundColor={colors.background}
    // indicatorColor={colors.backgroundElement}
    // labelStyle={{ selected: { color: colors.text } }}
    >
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          src={{
            default: require("@/assets/icons/tab-icons/home.png"),
            selected: require("@/assets/icons/tab-icons/home-filled.png"),
          }}
          renderingMode="template"
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="readings">
        <NativeTabs.Trigger.Label>Readings</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          src={{
            default: require("@/assets/icons/tab-icons/document-analyze.png"),
            selected: require("@/assets/icons/tab-icons/document-analyze-filled.png"),
          }}
          renderingMode="template"
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="help">
        <NativeTabs.Trigger.Label>Help</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          src={{
            default: require("@/assets/icons/tab-icons/question.png"),
            selected: require("@/assets/icons/tab-icons/question-filled.png"),
          }}
          renderingMode="template"
        />
        <NativeTabs.Trigger.Badge />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="settings">
        <NativeTabs.Trigger.Label>Settings</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          src={{
            default: require("@/assets/icons/tab-icons/settings.png"),
            selected: require("@/assets/icons/tab-icons/settings-filled.png"),
          }}
          renderingMode="template"
        />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
