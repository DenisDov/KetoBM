import { Ionicons } from "@react-native-vector-icons/ionicons";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useTheme } from "@shopify/restyle";
import * as Linking from "expo-linking";
import { Link } from "expo-router";
import { useRef } from "react";
import { Platform, ScrollView, Switch } from "react-native";
import { State } from "react-native-ble-plx";
import { ConfirmSheet } from "@/components/confirm-sheet";
import { SelectField } from "@/components/form/select-field";
import { Box, PressableBox, Text } from "@/components/primitives";
import { useBLEStore } from "@/hooks/use-ble-store";
import {
  KetosisMode,
  useActiveDevice,
  useSetOperatingMode,
  useUnpairDevice,
} from "@/hooks/use-readings";
import { Theme } from "@/theme";
import { Fonts } from "@/theme/fonts";

const MODE_OPTIONS = [
  { label: "Diabetic", value: "diabetic" },
  { label: "Non-diabetic", value: "non_diabetic" },
];

/** A settings row: bold title (+ optional subtitle) on the left, control right. */
const Row = ({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) => (
  <Box
    flexDirection="row"
    justifyContent="space-between"
    alignItems="center"
    gap="m">
    <Box flexShrink={1}>
      <Text fontSize={16} fontFamily={Fonts.medium}>
        {title}
      </Text>
      {subtitle && (
        <Text color="textSecondary" style={{ marginTop: 2 }}>
          {subtitle}
        </Text>
      )}
    </Box>
    {children}
  </Box>
);

export default function DeviceSettingsScreen() {
  const theme = useTheme<Theme>();
  const { data: device } = useActiveDevice();
  const disconnectBle = useBLEStore((state) => state.disconnect);
  const bluetoothState = useBLEStore((state) => state.bluetoothState);
  const setBluetooth = useBLEStore((state) => state.setBluetooth);
  const unpair = useUnpairDevice();
  const setOperatingMode = useSetOperatingMode();

  const sheetRef = useRef<BottomSheetModal>(null);

  const connected = device?.connection_status === "connected";
  const bluetoothOn = bluetoothState === State.PoweredOn;

  const handleDisconnect = () => {
    if (!device) return;
    // Tear down the live link first (flags the disconnect as expected), then
    // forget the row so Home reverts to the CTA and auto-reconnect stops.
    disconnectBle();
    unpair.mutate(device.id);
  };

  const handleBluetoothToggle = (next: boolean) => {
    // Android can flip the adapter directly; iOS can't, so send the user to
    // the OS settings where Bluetooth lives.
    if (Platform.OS === "android") {
      setBluetooth(next);
    } else {
      Linking.openSettings();
    }
  };

  const handleModeChange = (value: string) => {
    if (!device) return;
    setOperatingMode.mutate({
      deviceId: device.id,
      mode: value as KetosisMode,
    });
  };

  return (
    <ScrollView scrollEnabled={false}>
      <Box padding="m" gap="l">
        <Text variant="title" marginBottom="s">
          Device settings
        </Text>

        <Row title="Paired device" subtitle={device?.name ?? "KetoBM"}>
          <Box flexDirection="row" alignItems="center" gap="s">
            <Box
              width={9}
              height={9}
              backgroundColor={connected ? "green300" : "neutral300"}
              borderRadius="xl"
            />
            <Text>{connected ? "Connected" : "Disconnected"}</Text>
          </Box>
        </Row>

        <Row title="Bluetooth" subtitle="Enable to connect to device">
          <Switch
            value={bluetoothOn}
            onValueChange={handleBluetoothToggle}
            trackColor={{ true: theme.colors.primary }}
          />
        </Row>

        {device && (
          <Row title="Operating mode" subtitle="Diabetic or non-diabetic">
            <Box width={150}>
              <SelectField
                value={device.operating_mode}
                options={MODE_OPTIONS}
                onChange={handleModeChange}
              />
            </Box>
          </Row>
        )}

        {device && (
          <PressableBox
            flexDirection="row"
            justifyContent="space-between"
            alignItems="center"
            onPress={() => sheetRef.current?.present()}>
            <Text fontSize={18} fontFamily={Fonts.medium}>
              Disconnect meter
            </Text>
            <Ionicons
              name="chevron-forward"
              size={22}
              color={theme.colors.textSecondary}
            />
          </PressableBox>
        )}

        <Link href="/(tabs)/settings/add-new-meter" asChild>
          <PressableBox
            flexDirection="row"
            justifyContent="space-between"
            alignItems="center">
            <Text fontSize={18} fontFamily={Fonts.medium}>
              Add new meter
            </Text>
            <Ionicons
              name="chevron-forward"
              size={22}
              color={theme.colors.textSecondary}
            />
          </PressableBox>
        </Link>
      </Box>

      <ConfirmSheet
        ref={sheetRef}
        destructive
        icon="bluetooth"
        title="Are you sure?"
        description="This disconnects your meter and removes it from the app. You'll need to pair it again to take readings."
        confirmLabel="Disconnect my meter"
        onConfirm={handleDisconnect}
      />
    </ScrollView>
  );
}
