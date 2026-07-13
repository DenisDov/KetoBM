import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useRef } from "react";
import { useAuthStore } from "@/hooks/use-auth-store";
import { MeasurementType, useBLEStore } from "@/hooks/use-ble-store";
import { useAppState } from "@/hooks/tanstack-query/use-app-state";
import { useActiveDevice } from "@/hooks/use-readings";
import { supabase } from "@/lib/supabase";

const UNIT_BY_TYPE: Record<MeasurementType, string> = {
  glucose: "mg/dL",
  ketone: "mmol/L",
};

// Persisted so the last reading the meter replays on every reconnect
// (get_last_reading) is never inserted twice — even across app restarts,
// where the in-memory ref would otherwise reset.
const syncedKey = (userId: string) => `ketobm:lastSyncedReadingId:${userId}`;

/**
 * Invisible bridge between the live BLE store and Supabase. Mounted once while
 * authenticated. It:
 *  - inserts each new physical-meter measurement into `readings` (deduped by
 *    the device-provided reading id) and refreshes the reading queries, so the
 *    home gauge/list/chart — which read from Supabase — reflect the meter;
 *  - mirrors the BLE connection state onto the active device row so the
 *    connection pill stays honest after drops and relaunches;
 *  - silently reconnects to the paired meter on launch and app-foreground so a
 *    physical button-press reaches Supabase without re-running the wizard.
 */
export const BleSync = () => {
  const queryClient = useQueryClient();
  const userId = useAuthStore((state) => state.user?.id);
  const { data: activeDevice } = useActiveDevice();

  const lastReading = useBLEStore((state) => state.lastReading);
  const connected = useBLEStore((state) => state.connected);
  const reconnect = useBLEStore((state) => state.reconnect);

  const syncedReadingId = useRef<number | null>(null);
  const bluetoothId = activeDevice?.bluetooth_id ?? null;

  // Reconnect to the known meter unless we're already connected/connecting or
  // an attempt is already in flight. Store state is read live so the callback
  // stays stable (no re-subscribe churn on the AppState listener).
  const reconnecting = useRef(false);
  const tryReconnect = useCallback(async () => {
    const { connected: isConnected, connecting } = useBLEStore.getState();
    if (!bluetoothId || isConnected || connecting || reconnecting.current) {
      return;
    }
    reconnecting.current = true;
    try {
      await reconnect(bluetoothId);
    } finally {
      reconnecting.current = false;
    }
  }, [bluetoothId, reconnect]);

  // On launch / once a paired meter is known.
  useEffect(() => {
    tryReconnect();
  }, [tryReconnect]);

  // And whenever the app returns to the foreground.
  useAppState(
    useCallback(
      (status) => {
        if (status === "active") tryReconnect();
      },
      [tryReconnect],
    ),
  );

  // Seed the dedup guard from persisted state on mount / user change.
  useEffect(() => {
    if (!userId) return;
    const stored = localStorage.getItem(syncedKey(userId));
    syncedReadingId.current = stored !== null ? Number(stored) : null;
  }, [userId]);

  useEffect(() => {
    if (!userId || !lastReading) return;
    if (syncedReadingId.current === lastReading.id) return;
    syncedReadingId.current = lastReading.id;

    (async () => {
      const { error } = await supabase.from("readings").insert({
        user_id: userId,
        type: lastReading.measurement_type,
        value: lastReading.value,
        unit: UNIT_BY_TYPE[lastReading.measurement_type],
        source: "device",
        measured_at: lastReading.taken_at,
        meter_id: activeDevice?.id ?? null,
      });
      if (error) {
        console.warn("[BleSync] reading insert failed", error.message);
        syncedReadingId.current = null; // let the next emit retry
        return;
      }
      localStorage.setItem(syncedKey(userId), String(lastReading.id));
      queryClient.invalidateQueries({ queryKey: ["readings"] });
    })();
  }, [userId, lastReading, activeDevice?.id, queryClient]);

  // Reflect connect/disconnect in the DB (drives the gauge's connection pill).
  useEffect(() => {
    if (!activeDevice) return;
    const status = connected ? "connected" : "disconnected";
    if (activeDevice.connection_status === status) return;

    (async () => {
      const { error } = await supabase
        .from("devices")
        .update({ connection_status: status })
        .eq("id", activeDevice.id);
      if (!error) {
        queryClient.invalidateQueries({ queryKey: ["devices"] });
      }
    })();
  }, [connected, activeDevice, queryClient]);

  return null;
};
