import { BleManager, Device, State, Subscription } from "react-native-ble-plx";
import { create } from "zustand";
// import { supabase } from '../lib/supabase'
import { requestBluetoothPermissions } from "@/utils/ble/permissions";

const manager = new BleManager();

const DEVICE_NAME = "GlucoKeto-Monitor";
const SERVICE_UUID = "12345678-1234-1234-1234-123456789abc";
const EVENTS_CHAR = "12345678-1234-1234-1234-123456789001";
const CONTROL_CHAR = "12345678-1234-1234-1234-123456789002";

async function sendCommand(device: Device, cmd: string, id: string) {
  const payload = JSON.stringify({ cmd, id });
  await device.writeCharacteristicWithResponseForService(
    SERVICE_UUID,
    CONTROL_CHAR,
    btoa(payload),
  );
}

export type DeviceState = "idle" | "measuring" | "done";

export interface Reading {
  id: number;
  glucose: number;
  ketone: number;
  glucose_status: string;
  ketone_status: string;
  taken_at: string;
}

interface BLEStore {
  device: Device | null;
  connected: boolean;
  scanning: boolean;
  deviceState: DeviceState;
  progress: number;
  lastReading: Reading | null;
  error: string | null;
  subscription: Subscription | null;
  isDisconnectExpected: boolean;

  initializeBLE: () => Promise<void>;
  scan: () => Promise<void>;
  disconnect: () => Promise<void>;
  clearError: () => void;
  startMeasurement: () => Promise<void>;
  cancelMeasurement: () => Promise<void>;
}

export const useBLEStore = create<BLEStore>((set, get) => ({
  device: null,
  connected: false,
  scanning: false,
  deviceState: "idle",
  progress: 0,
  lastReading: null,
  error: null,
  subscription: null,
  isDisconnectExpected: false,

  clearError: () => set({ error: null }),

  // --- 1. Wait for adapter to be ready before scanning ---
  initializeBLE: () =>
    new Promise<void>((resolve) => {
      const sub = manager.onStateChange((state) => {
        switch (state) {
          case State.PoweredOn:
            resolve();
            sub.remove();
            break;
          case State.PoweredOff:
            set({ error: "Bluetooth is turned off" });
            break;
          case State.Unauthorized:
            requestBluetoothPermissions();
            break;
          case State.Unsupported:
            set({ error: "Bluetooth is not supported on this device" });
            break;
        }
      }, true); // true = emit current state immediately
    }),

  scan: async () => {
    const { connected } = get();
    if (connected) return;

    // --- 1. Wait for adapter ---
    await get().initializeBLE();

    const granted = await requestBluetoothPermissions();
    if (!granted) return;

    set({ scanning: true, error: null });

    manager.startDeviceScan(null, null, async (error, scanned) => {
      if (error) {
        set({ scanning: false, error: error.message });
        return;
      }

      if (scanned?.name !== DEVICE_NAME) return;

      manager.stopDeviceScan();

      try {
        const device = await scanned.connect();
        await device.discoverAllServicesAndCharacteristics();

        // --- 3. Request MTU from RN side too ---
        await manager.requestMTUForDevice(device.id, 512);

        // --- 2. Handle unexpected disconnection ---
        manager.onDeviceDisconnected(device.id, () => {
          const { isDisconnectExpected, subscription } = get();
          if (!isDisconnectExpected) {
            // Unexpected drop — clean up and surface error
            subscription?.remove();
            set({
              connected: false,
              device: null,
              deviceState: "idle",
              progress: 0,
              subscription: null,
              error: "Device disconnected unexpectedly",
            });
          }
        });

        // --- Subscribe to events characteristic ---
        const sub = device.monitorCharacteristicForService(
          SERVICE_UUID,
          EVENTS_CHAR,
          async (error, char) => {
            if (error) {
              // --- 2. Swallow expected disconnect error ---
              if (get().isDisconnectExpected) return;
              console.warn("[BLE] monitor error", error);
              return;
            }
            if (!char?.value) return;

            try {
              const msg = JSON.parse(atob(char.value));
              // msg shape: { v, type, name, id, ts, data }

              if (msg.type === "ack") {
                console.log(`[ACK] ${msg.name} id=${msg.id}`);
                return;
              }

              if (msg.type === "error") {
                set({ error: msg.data.reason });
                return;
              }

              if (msg.type === "event") {
                switch (msg.name) {
                  case "measurement_started":
                    set({ deviceState: "measuring", progress: 0 });
                    break;
                  case "measurement_progress":
                    set({ progress: msg.data.progress });
                    break;
                  case "measurement_result": {
                    const reading: Reading = {
                      id: msg.data.id,
                      glucose: msg.data.glucose,
                      ketone: msg.data.ketone,
                      glucose_status: msg.data.glucose_status,
                      ketone_status: msg.data.ketone_status,
                      taken_at: new Date().toISOString(),
                    };
                    set({ deviceState: "idle", lastReading: reading });
                    // await supabase.from('readings').insert(reading)
                    break;
                  }
                  case "measurement_cancelled":
                    set({ deviceState: "idle", progress: 0 });
                    break;
                }
              }
            } catch (e) {
              console.warn("[BLE] parse error", e);
            }
          },
        );

        set({ device, connected: true, scanning: false, subscription: sub });
      } catch (e: any) {
        set({ scanning: false, error: e.message });
      }
    });

    setTimeout(() => {
      manager.stopDeviceScan();
      const { connected } = get();
      if (!connected) set({ scanning: false, error: "Device not found" });
    }, 10_000);
  },

  startMeasurement: async () => {
    const { device, deviceState } = get();
    if (!device || deviceState === "measuring") return;
    await sendCommand(device, "start_measurement", Date.now().toString());
  },

  cancelMeasurement: async () => {
    const { device, deviceState } = get();
    if (!device || deviceState !== "measuring") return;
    await sendCommand(device, "cancel_measurement", Date.now().toString());
  },

  // --- 2. Set expected flag BEFORE cancelling ---
  disconnect: async () => {
    const { device, subscription } = get();
    set({ isDisconnectExpected: true });
    subscription?.remove();
    if (device) {
      await manager.cancelDeviceConnection(device.id);
    }
    set({
      device: null,
      connected: false,
      deviceState: "idle",
      progress: 0,
      subscription: null,
      isDisconnectExpected: false,
    });
  },
}));
