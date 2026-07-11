import { requestBluetoothPermissions } from "@/utils/ble/permissions";
import { BleManager, Device, State, Subscription } from "react-native-ble-plx";
import { create } from "zustand";

const manager = new BleManager();

const SERVICE_UUID = "12345678-1234-1234-1234-123456789abc";
const EVENTS_CHAR = "12345678-1234-1234-1234-123456789001";
const CONTROL_CHAR = "12345678-1234-1234-1234-123456789002";

const SCAN_TIMEOUT_MS = 10_000;

export type MeasurementType = "glucose" | "ketone";
export type DeviceState = "idle" | "measuring";

export interface Reading {
  id: number;
  measurement_type: MeasurementType;
  value: number;
  status: string;
  taken_at: string;
}

async function sendCommand(
  device: Device,
  cmd: string,
  extra: Record<string, unknown> = {},
) {
  const payload = JSON.stringify({ cmd, id: Date.now().toString(), ...extra });
  await device.writeCharacteristicWithResponseForService(
    SERVICE_UUID,
    CONTROL_CHAR,
    btoa(payload),
  );
}

interface BLEStore {
  device: Device | null;
  connected: boolean;
  scanning: boolean;
  connecting: boolean;
  discoveredDevices: Device[];
  deviceState: DeviceState;
  measurementType: MeasurementType | null;
  progress: number;
  lastReading: Reading | null;
  error: string | null;
  eventsSubscription: Subscription | null;
  disconnectSubscription: Subscription | null;
  isDisconnectExpected: boolean;

  initializeBLE: () => Promise<void>;
  scan: () => Promise<void>;
  stopScan: () => void;
  connect: (device: Device) => Promise<void>;
  disconnect: () => Promise<void>;
  clearError: () => void;
  startMeasurement: (type: MeasurementType) => Promise<void>;
  cancelMeasurement: () => Promise<void>;
}

// Module-level so connect()/stopScan() can cancel a pending scan timeout
let scanTimeout: ReturnType<typeof setTimeout> | null = null;

export const useBLEStore = create<BLEStore>((set, get) => ({
  device: null,
  connected: false,
  scanning: false,
  connecting: false,
  discoveredDevices: [],
  deviceState: "idle",
  measurementType: null,
  progress: 0,
  lastReading: null,
  error: null,
  eventsSubscription: null,
  disconnectSubscription: null,
  isDisconnectExpected: false,

  clearError: () => set({ error: null }),

  // Wait for the adapter to be ready before scanning
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

  // Discovery only — found devices land in discoveredDevices;
  // the user picks one and connect() takes over
  scan: async () => {
    const { connected, scanning } = get();
    if (connected || scanning) return;

    await get().initializeBLE();

    const granted = await requestBluetoothPermissions();
    if (!granted) return;

    set({ scanning: true, error: null, discoveredDevices: [] });

    scanTimeout = setTimeout(() => {
      manager.stopDeviceScan();
      set((state) => ({
        scanning: false,
        error: state.discoveredDevices.length === 0 ? "No devices found" : null,
      }));
    }, SCAN_TIMEOUT_MS);

    // Filtering by service UUID beats matching on the advertised name:
    // faster, and iOS sometimes serves a stale cached name
    manager.startDeviceScan([SERVICE_UUID], null, (error, scanned) => {
      if (error) {
        get().stopScan();
        set({ error: error.message });
        return;
      }
      if (!scanned) return;

      set((state) => {
        if (state.discoveredDevices.some((d) => d.id === scanned.id)) {
          return state;
        }
        return { discoveredDevices: [...state.discoveredDevices, scanned] };
      });
    });
  },

  stopScan: () => {
    if (scanTimeout) {
      clearTimeout(scanTimeout);
      scanTimeout = null;
    }
    manager.stopDeviceScan();
    set({ scanning: false });
  },

  connect: async (scanned) => {
    const { connected, connecting } = get();
    if (connected || connecting) return;

    get().stopScan();
    set({ connecting: true, error: null });

    try {
      // requestMTU here is Android-only; iOS negotiates its own (~185)
      const device = await scanned.connect({ requestMTU: 512 });
      await device.discoverAllServicesAndCharacteristics();

      const disconnectSub = manager.onDeviceDisconnected(device.id, () => {
        const {
          isDisconnectExpected,
          eventsSubscription,
          disconnectSubscription,
        } = get();
        if (isDisconnectExpected) return;
        // Unexpected drop — clean up and surface error
        eventsSubscription?.remove();
        disconnectSubscription?.remove();
        set({
          connected: false,
          device: null,
          deviceState: "idle",
          measurementType: null,
          progress: 0,
          eventsSubscription: null,
          disconnectSubscription: null,
          error: "Device disconnected unexpectedly",
        });
      });

      const eventsSub = device.monitorCharacteristicForService(
        SERVICE_UUID,
        EVENTS_CHAR,
        (error, char) => {
          if (error) {
            if (get().isDisconnectExpected) return; // expected disconnect noise
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
              // Benign: fresh device with nothing to report yet
              if (msg.data.reason === "no_reading_yet") return;
              set({ error: msg.data.reason });
              return;
            }

            if (msg.type === "event") {
              switch (msg.name) {
                case "measurement_started":
                  set({
                    deviceState: "measuring",
                    measurementType: msg.data.measurement_type,
                    progress: 0,
                  });
                  break;
                case "measurement_progress":
                  set({
                    deviceState: "measuring",
                    measurementType: msg.data.measurement_type,
                    progress: msg.data.progress,
                  });
                  break;
                case "measurement_result": {
                  const reading: Reading = {
                    id: msg.data.id,
                    measurement_type: msg.data.measurement_type,
                    value: msg.data.value,
                    status: msg.data.status,
                    taken_at: new Date().toISOString(),
                  };
                  set({
                    deviceState: "idle",
                    measurementType: null,
                    progress: 0,
                    lastReading: reading,
                  });
                  // await supabase.from('readings').insert(reading)
                  break;
                }
                case "measurement_cancelled":
                  set({
                    deviceState: "idle",
                    measurementType: null,
                    progress: 0,
                  });
                  break;
                case "device_state":
                  // Resync after (re)connect — device may be mid-measurement
                  if (msg.data.state === "measuring") {
                    set({
                      deviceState: "measuring",
                      measurementType: msg.data.measurement_type,
                      progress: msg.data.progress,
                    });
                  } else {
                    set({
                      deviceState: "idle",
                      measurementType: null,
                      progress: 0,
                    });
                  }
                  break;
              }
            }
          } catch (e) {
            console.warn("[BLE] parse error", e);
          }
        },
      );

      set({
        device,
        connected: true,
        connecting: false,
        discoveredDevices: [],
        eventsSubscription: eventsSub,
        disconnectSubscription: disconnectSub,
      });

      // Resync: device may be mid-measurement (hardware button) or hold
      // a reading taken while we were away
      await sendCommand(device, "get_state");
      await sendCommand(device, "get_last_reading");
    } catch (e: any) {
      set({ connecting: false, error: e.message });
    }
  },

  startMeasurement: async (type) => {
    const { device, deviceState } = get();
    if (!device || deviceState === "measuring") return;
    try {
      await sendCommand(device, "start_measurement", {
        measurement_type: type,
      });
    } catch (e: any) {
      set({ error: e.message });
    }
  },

  cancelMeasurement: async () => {
    const { device, deviceState } = get();
    if (!device || deviceState !== "measuring") return;
    try {
      await sendCommand(device, "cancel_measurement");
    } catch (e: any) {
      set({ error: e.message });
    }
  },

  disconnect: async () => {
    const { device, eventsSubscription, disconnectSubscription } = get();
    // Flag BEFORE cancelling so the disconnect handler stays quiet
    set({ isDisconnectExpected: true });
    eventsSubscription?.remove();
    disconnectSubscription?.remove();
    if (device) {
      try {
        await manager.cancelDeviceConnection(device.id);
      } catch {
        // already disconnected — nothing to do
      }
    }
    set({
      device: null,
      connected: false,
      connecting: false,
      discoveredDevices: [],
      deviceState: "idle",
      measurementType: null,
      progress: 0,
      eventsSubscription: null,
      disconnectSubscription: null,
      isDisconnectExpected: false,
    });
  },
}));
