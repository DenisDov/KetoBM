import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Tables } from "@/lib/database.types";
import { useAuthStore } from "@/hooks/use-auth-store";

export type Note = Tables<"notes">;
export type NotePreset = Tables<"note_presets">;

/** Active dropdown presets in display order (global lookup, like ketosis stages). */
export const useNotePresets = () =>
  useQuery({
    queryKey: ["note_presets"],
    staleTime: Infinity,
    queryFn: async (): Promise<NotePreset[]> => {
      const { data, error } = await supabase
        .from("note_presets")
        .select("*")
        .eq("is_active", true)
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

/** The reading's note, if any (at most one per reading). */
export const useNote = (readingId: string | undefined) => {
  const userId = useAuthStore((state) => state.user?.id);

  return useQuery({
    queryKey: ["notes", "by-reading", readingId],
    enabled: !!userId && !!readingId,
    queryFn: async (): Promise<Note | null> => {
      const { data, error } = await supabase
        .from("notes")
        .select("*")
        .eq("reading_id", readingId!)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });
};

/**
 * Create or replace the reading's note. Always writes both content columns,
 * nulling the unused one, so switching between a preset and a custom note
 * leaves no stale data behind.
 */
export const useUpsertNote = () => {
  const userId = useAuthStore((state) => state.user?.id);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (vars: {
      readingId: string;
      presetId: string | null;
      body: string | null;
    }): Promise<Note> => {
      if (!userId) throw new Error("Not authenticated");
      const { data, error } = await supabase
        .from("notes")
        .upsert(
          {
            reading_id: vars.readingId,
            user_id: userId,
            preset_id: vars.presetId,
            body: vars.body,
          },
          { onConflict: "reading_id" },
        )
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      // The readings list embeds each reading's note.
      queryClient.invalidateQueries({ queryKey: ["readings"] });
    },
  });
};

export const useDeleteNote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (readingId: string): Promise<void> => {
      const { error } = await supabase
        .from("notes")
        .delete()
        .eq("reading_id", readingId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      queryClient.invalidateQueries({ queryKey: ["readings"] });
    },
  });
};
