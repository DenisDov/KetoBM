import { Box, Text, PressableBox } from "@/components/primitives";
import { useAuthStore } from "@/hooks/use-auth-store";
import { Theme } from "@/theme";
import { Fonts } from "@/theme/fonts";
import { Ionicons } from "@react-native-vector-icons/ionicons";
import { useTheme } from "@shopify/restyle";
import { Href, useRouter } from "expo-router";
import { Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type IconName = React.ComponentProps<typeof Ionicons>["name"];

type MenuItem =
  | { name: string; icon: IconName; href: Href }
  | { name: string; icon: IconName; action: "delete" | "logout" };

const menu: MenuItem[] = [
  {
    name: "Device settings",
    icon: "speedometer-outline",
    href: "/settings/device",
  },
  {
    name: "Reminder settings",
    icon: "notifications-outline",
    href: "/settings/reminder",
  },
  {
    name: "Account settings",
    icon: "person-outline",
    href: "/settings/account",
  },
  { name: "Privacy", icon: "shield-outline", href: "/policy" },
  { name: "Delete my data", icon: "trash-outline", action: "delete" },
  { name: "Logout", icon: "log-out-outline", action: "logout" },
];

export default function SettingsScreen() {
  const { user, signOut } = useAuthStore();
  const router = useRouter();
  const { colors } = useTheme<Theme>();

  const displayName =
    (user?.user_metadata?.full_name as string | undefined) ??
    user?.email?.split("@")[0] ??
    "User";
  const avatarLetter = displayName.charAt(0).toUpperCase();

  const handleDelete = () => {
    Alert.alert(
      "Delete my data",
      "This will permanently delete your account and all of your readings. This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            // TODO: call data/account deletion endpoint, then sign out
          },
        },
      ],
    );
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      { text: "Logout", style: "destructive", onPress: () => signOut() },
    ]);
  };

  const handlePress = (item: MenuItem) => {
    if ("href" in item) {
      router.push(item.href);
      return;
    }

    if (item.action === "logout") {
      handleLogout();
      return;
    }

    if (item.action === "delete") {
      handleDelete();
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Box flexDirection="row" alignItems="center" gap="m" padding="m">
        <Box
          justifyContent="center"
          alignItems="center"
          width={48}
          height={48}
          borderRadius="xl"
          backgroundColor="neutral100">
          <Text variant="body" color="textSecondary" fontFamily={Fonts.bold}>
            {avatarLetter}
          </Text>
        </Box>
        <Box>
          <Text variant="body" fontFamily={Fonts.semiBold}>
            {displayName}
          </Text>
          <Text color="textSecondary">{user?.email}</Text>
        </Box>
      </Box>

      <Box height={1} backgroundColor="neutral100" marginBottom="s" />

      <Box flex={1} paddingHorizontal="m">
        {menu.map((item) => {
          const isLogout = "action" in item && item.action === "logout";
          const tint = isLogout ? colors.red500 : colors.text;

          return (
            <PressableBox
              key={item.name}
              onPress={() => handlePress(item)}
              flexDirection="row"
              alignItems="center"
              gap="s"
              paddingVertical="m">
              <Ionicons name={item.icon} size={20} color={tint} />
              <Text
                variant="body"
                flex={1}
                style={{ color: tint }}
                fontFamily={Fonts.medium}>
                {item.name}
              </Text>
              {"href" in item && <Ionicons name="chevron-forward" size={20} />}
            </PressableBox>
          );
        })}
      </Box>
    </SafeAreaView>
  );
}
