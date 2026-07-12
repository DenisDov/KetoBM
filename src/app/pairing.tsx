import { Ionicons } from "@react-native-vector-icons/ionicons";
import { useTheme } from "@shopify/restyle";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "@/components/button";
import { Box, PressableBox, Text } from "@/components/primitives";
import { useBLEStore } from "@/hooks/use-ble-store";
import { usePairDevice } from "@/hooks/use-readings";
import { boxShadows, Theme } from "@/theme";
import { Fonts } from "@/theme/fonts";

type Step = "intro" | "bluetooth" | "poweron" | "search" | "connected";

const STEPS: Step[] = ["intro", "bluetooth", "poweron", "search", "connected"];

export default function PairingScreen() {
  const theme = useTheme<Theme>();
  const router = useRouter();

  const connecting = useBLEStore((state) => state.connecting);
  const connected = useBLEStore((state) => state.connected);
  const discoveredDevices = useBLEStore((state) => state.discoveredDevices);
  const device = useBLEStore((state) => state.device);
  const error = useBLEStore((state) => state.error);
  const scan = useBLEStore((state) => state.scan);
  const stopScan = useBLEStore((state) => state.stopScan);
  const connect = useBLEStore((state) => state.connect);
  const clearError = useBLEStore((state) => state.clearError);

  const pairDevice = usePairDevice();

  const [step, setStep] = useState<Step>("intro");
  const paired = useRef(false);

  // Kick off discovery when the search step mounts; stop it on leave.
  useEffect(() => {
    if (step !== "search") return;
    scan();
    return () => stopScan();
  }, [step, scan, stopScan]);

  // Persist the meter and advance the moment the BLE link comes up.
  useEffect(() => {
    if (!connected || !device || paired.current) return;
    paired.current = true;
    pairDevice.mutate({ id: device.id, name: device.name });
    setStep("connected");
  }, [connected, device, pairDevice]);

  const goBack = () => {
    clearError();
    const index = STEPS.indexOf(step);
    if (index <= 0) {
      router.back();
      return;
    }
    setStep(STEPS[index - 1]);
  };

  const retryScan = () => {
    clearError();
    scan();
  };

  const progress = (STEPS.indexOf(step) + 1) / STEPS.length;
  const showChrome = step !== "connected";

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {showChrome && (
        <>
          <Box
            flexDirection="row"
            alignItems="center"
            paddingHorizontal="m"
            paddingVertical="sm">
            <PressableBox hitSlop={8} onPress={goBack} width={24}>
              <Ionicons
                name={step === "intro" ? "close" : "arrow-back"}
                size={24}
                color={theme.colors.text}
              />
            </PressableBox>
            <Box flex={1} />
            <Box width={24} />
          </Box>
          <Box height={3} backgroundColor="neutral100">
            <Box
              height={3}
              backgroundColor="primary"
              width={`${progress * 100}%`}
            />
          </Box>
        </>
      )}

      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          padding: theme.spacing.m,
          gap: theme.spacing.m,
        }}>
        {step === "intro" && (
          <Box flex={1} gap="m">
            <Box alignItems="center" paddingVertical="l">
              <Ionicons
                name="bluetooth"
                size={72}
                color={theme.colors.primary}
              />
            </Box>
            <Text variant="title">
              Let&apos;s set up your device and get your first reading
            </Text>
            <Text color="textSecondary">
              We&apos;ll connect your KetoBM meter over Bluetooth. It only takes
              a minute.
            </Text>
          </Box>
        )}

        {step === "bluetooth" && (
          <Box flex={1} gap="m">
            <Box alignItems="center" paddingVertical="l">
              <Ionicons
                name="bluetooth"
                size={72}
                color={theme.colors.primary}
              />
            </Box>
            <Text variant="title">Turn on Bluetooth on your phone</Text>
            <Text color="textSecondary">
              We need Bluetooth to connect your KetoBM meter with the app.
              Please turn on Bluetooth in your phone settings if it&apos;s off.
            </Text>
            {error && <Text color="error">{error}</Text>}
          </Box>
        )}

        {step === "poweron" && (
          <Box flex={1} gap="m">
            <Box alignItems="center" paddingVertical="l">
              <Ionicons name="power" size={72} color={theme.colors.primary} />
            </Box>
            <Text variant="title">Power on your KetoBM Meter</Text>
            <Text color="textSecondary">
              Make sure your KetoBM device is turned on and ready to pair. Most
              meters activate automatically when a test strip is inserted.
            </Text>
          </Box>
        )}

        {step === "search" && (
          <Box flex={1} gap="m">
            {error ? (
              <Box flex={1} alignItems="center" justifyContent="center" gap="m">
                <Ionicons
                  name="alert-circle-outline"
                  size={48}
                  color={theme.colors.error}
                />
                <Text variant="title" textAlign="center">
                  {error}
                </Text>
                <Text color="textSecondary" textAlign="center">
                  Make sure your meter is powered on and nearby, then try again.
                </Text>
              </Box>
            ) : discoveredDevices.length === 0 ? (
              <Box flex={1} alignItems="center" justifyContent="center" gap="m">
                <ActivityIndicator size="large" color={theme.colors.primary} />
                <Text variant="title" textAlign="center">
                  Searching for your KetoBM Meter…
                </Text>
                <Text color="textSecondary" textAlign="center">
                  Taking too long? Try turning the device on again.
                </Text>
              </Box>
            ) : (
              <Box gap="m">
                <Text variant="title">We have found your device(s)</Text>
                <Text color="textSecondary">
                  Select the device and hit &quot;Connect&quot;.
                </Text>
                <Box gap="sm">
                  {discoveredDevices.map((d) => (
                    <Box
                      key={d.id}
                      flexDirection="row"
                      alignItems="center"
                      gap="s"
                      padding="m"
                      borderRadius="s"
                      backgroundColor="background"
                      style={{ boxShadow: boxShadows.card }}>
                      <Ionicons
                        name="bluetooth"
                        size={20}
                        color={theme.colors.primary}
                      />
                      <Box flex={1}>
                        <Text fontFamily={Fonts.medium}>
                          {d.name ?? "KetoBM Meter"}
                        </Text>
                        <Text fontSize={12} color="textSecondary">
                          {d.id}
                        </Text>
                      </Box>
                      <Button
                        title={connecting ? "Connecting…" : "Connect"}
                        variant="secondary"
                        disabled={connecting}
                        onPress={() => connect(d)}
                      />
                    </Box>
                  ))}
                </Box>
              </Box>
            )}
          </Box>
        )}

        {step === "connected" && (
          <Box flex={1} alignItems="center" justifyContent="center" gap="m">
            <Ionicons
              name="checkmark-circle"
              size={72}
              color={theme.colors.success}
            />
            <Text variant="title" textAlign="center">
              Your device is connected!
            </Text>
            {device?.name && (
              <Text color="textSecondary" textAlign="center">
                {device.name}
              </Text>
            )}
          </Box>
        )}
      </ScrollView>

      <Box padding="m">
        {step === "intro" && (
          <Button title="Get started" onPress={() => setStep("bluetooth")} />
        )}
        {step === "bluetooth" && (
          <Button
            title="Turn on Bluetooth"
            onPress={() => setStep("poweron")}
          />
        )}
        {step === "poweron" && (
          <Button title="Next" onPress={() => setStep("search")} />
        )}
        {step === "search" && error && (
          <Button title="Try again" onPress={retryScan} />
        )}
        {step === "connected" && (
          <Button title="Continue" onPress={() => router.back()} />
        )}
      </Box>
    </SafeAreaView>
  );
}
