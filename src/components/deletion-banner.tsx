import { Ionicons } from "@react-native-vector-icons/ionicons";
import { useTheme } from "@shopify/restyle";
import { addDays } from "date-fns/addDays";
import { parseISO } from "date-fns/parseISO";
import { useState } from "react";

import { Box, Text, PressableBox } from "@/components/primitives";
import { useAuthStore } from "@/hooks/use-auth-store";
import { Theme } from "@/theme";
import { Fonts } from "@/theme/fonts";

const GRACE_PERIOD_DAYS = 7;
const MS_PER_DAY = 24 * 60 * 60 * 1000;

/**
 * Persistent reminder shown while the account is scheduled for deletion
 * (profiles.deleted_at is set). Lets the user undo any time during the 7-day
 * grace period. Renders nothing when no deletion is pending.
 */
export function DeletionBanner() {
  const { colors } = useTheme<Theme>();
  const { profile, cancelAccountDeletion } = useAuthStore();
  const [undoing, setUndoing] = useState(false);
  // Captured once at mount; a day's granularity doesn't need live updates.
  const [now] = useState(() => Date.now());

  const deletedAt = profile?.deleted_at;
  if (!deletedAt) return null;

  // Ceil so a partial day still counts as a day left (differenceInDays truncates).
  const msLeft =
    addDays(parseISO(deletedAt), GRACE_PERIOD_DAYS).getTime() - now;
  const daysLeft = Math.max(0, Math.ceil(msLeft / MS_PER_DAY));
  const daysLabel = daysLeft === 1 ? "1 day" : `${daysLeft} days`;

  const handleUndo = async () => {
    setUndoing(true);
    try {
      await cancelAccountDeletion();
    } catch {
      // cancelAccountDeletion already surfaces the error to the user.
    } finally {
      setUndoing(false);
    }
  };

  return (
    <Box
      flexDirection="row"
      alignItems="center"
      gap="s"
      padding="m"
      margin="m"
      borderRadius="l"
      borderWidth={1}
      borderColor="error"
      backgroundColor="background">
      <Ionicons name="trash-outline" size={20} color={colors.error} />
      <Box flex={1}>
        <Text
          variant="body"
          fontFamily={Fonts.semiBold}
          style={{ color: colors.error }}>
          Account deletion scheduled
        </Text>
        <Text variant="body" color="textSecondary" fontFamily={Fonts.regular}>
          {daysLabel} left to undo
        </Text>
      </Box>
      <PressableBox
        onPress={handleUndo}
        disabled={undoing}
        paddingHorizontal="s">
        <Text variant="body" fontFamily={Fonts.semiBold} color="primary">
          Undo
        </Text>
      </PressableBox>
    </Box>
  );
}
