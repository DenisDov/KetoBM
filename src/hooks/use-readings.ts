import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Tables } from "@/lib/database.types";
import { useAuthStore, Profile } from "@/hooks/use-auth-store";

export type Reading = Tables<"readings">;
export type KetosisStage = Tables<"ketosis_stages">;
export type Device = Tables<"devices">;

export type ReadingType = "ketone" | "glucose";

/**
 * Gauge/stage mode. Users who picked "Ketogenic diet" as their goal get the
 * nutritional-ketosis scale; everyone else (diabetes management, both, or not
 * answered yet) gets the conservative DKA-risk scale and the default blue UI.
 */
export type KetosisMode = "non_diabetic" | "diabetic";

export const getKetosisMode = (profile: Profile | null): KetosisMode =>
  profile?.primary_goal === "ketogenic_diet" ? "non_diabetic" : "diabetic";

export const useKetosisMode = (): KetosisMode => {
  const profile = useAuthStore((state) => state.profile);
  return getKetosisMode(profile);
};

/** Full reading history across both types, newest first (readings list screen). */
export const useReadings = () => {
  const userId = useAuthStore((state) => state.user?.id);

  return useQuery({
    queryKey: ["readings", "all", userId],
    enabled: !!userId,
    queryFn: async (): Promise<Reading[]> => {
      const { data, error } = await supabase
        .from("readings")
        .select("*")
        .order("measured_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
};

/** Most recent readings across both types (drives the gauge + latest list). */
export const useLatestReadings = (limit = 3) => {
  const userId = useAuthStore((state) => state.user?.id);

  return useQuery({
    queryKey: ["readings", "latest", userId, limit],
    enabled: !!userId,
    queryFn: async (): Promise<Reading[]> => {
      const { data, error } = await supabase
        .from("readings")
        .select("*")
        .order("measured_at", { ascending: false })
        .limit(limit);
      if (error) throw error;
      return data;
    },
  });
};

export type ChartRange = "24h" | "7d" | "30d";

export const CHART_RANGE_HOURS: Record<ChartRange, number> = {
  "24h": 24,
  "7d": 24 * 7,
  "30d": 24 * 30,
};

/** Readings of one type within the selected window, oldest first (chart data). */
export const useReadingSeries = (type: ReadingType, range: ChartRange) => {
  const userId = useAuthStore((state) => state.user?.id);

  return useQuery({
    queryKey: ["readings", "series", userId, type, range],
    enabled: !!userId,
    queryFn: async (): Promise<Reading[]> => {
      const since = new Date(
        Date.now() - CHART_RANGE_HOURS[range] * 3_600_000,
      ).toISOString();
      const { data, error } = await supabase
        .from("readings")
        .select("*")
        .eq("type", type)
        .gte("measured_at", since)
        .order("measured_at", { ascending: true });
      if (error) throw error;
      return data;
    },
  });
};

/** Reference stages for a mode, ordered by severity/sort_order. */
export const useKetosisStages = (mode: KetosisMode) =>
  useQuery({
    queryKey: ["ketosis_stages", mode],
    staleTime: Infinity,
    queryFn: async (): Promise<KetosisStage[]> => {
      const { data, error } = await supabase
        .from("ketosis_stages")
        .select("*")
        .eq("mode", mode)
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

/** Ranges are half-open [min_mmol, max_mmol); null bounds are open-ended. */
export const findStageForValue = (
  stages: KetosisStage[] | undefined,
  value: number,
): KetosisStage | undefined =>
  stages?.find(
    (stage) =>
      (stage.min_mmol === null || value >= stage.min_mmol) &&
      (stage.max_mmol === null || value < stage.max_mmol),
  );

/** The user's active paired meter, if any (drives the connection pill). */
export const useActiveDevice = () => {
  const userId = useAuthStore((state) => state.user?.id);

  return useQuery({
    queryKey: ["devices", "active", userId],
    enabled: !!userId,
    queryFn: async (): Promise<Device | null> => {
      const { data, error } = await supabase
        .from("devices")
        .select("*")
        .eq("is_active", true)
        .order("last_connected_at", { ascending: false, nullsFirst: false })
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });
};

/** The live BLE peripheral a freshly-paired meter maps to. */
export type PairedMeter = { id: string; name: string | null };

/**
 * Persist a meter after a successful BLE connect so `useActiveDevice` reflects
 * it. Reuses the existing row when re-pairing a meter we've seen before
 * (matched on `bluetooth_id`), otherwise inserts a new one.
 */
export const usePairDevice = () => {
  const userId = useAuthStore((state) => state.user?.id);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (meter: PairedMeter): Promise<Device> => {
      if (!userId) throw new Error("Not authenticated");
      const now = new Date().toISOString();

      const { data: existing, error: lookupError } = await supabase
        .from("devices")
        .select("id")
        .eq("user_id", userId)
        .eq("bluetooth_id", meter.id)
        .maybeSingle();
      if (lookupError) throw lookupError;

      if (existing) {
        const { data, error } = await supabase
          .from("devices")
          .update({
            name: meter.name,
            connection_status: "connected",
            is_active: true,
            last_connected_at: now,
          })
          .eq("id", existing.id)
          .select()
          .single();
        if (error) throw error;
        return data;
      }

      const { data, error } = await supabase
        .from("devices")
        .insert({
          user_id: userId,
          name: meter.name,
          bluetooth_id: meter.id,
          connection_status: "connected",
          is_active: true,
          paired_at: now,
          last_connected_at: now,
        })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["devices"] });
    },
  });
};
