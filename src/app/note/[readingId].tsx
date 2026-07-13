import { Ionicons } from "@react-native-vector-icons/ionicons";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useTheme } from "@shopify/restyle";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { useRef, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "@/components/button";
import { ConfirmSheet } from "@/components/confirm-sheet";
import { SelectField, SelectFieldOption, TextField } from "@/components/form";
import { Box, PressableBox, Text } from "@/components/primitives";
import { Theme } from "@/theme";
import { Fonts } from "@/theme/fonts";
import {
  useDeleteNote,
  useNote,
  useNotePresets,
  useUpsertNote,
} from "@/hooks/use-notes";
import { useReading } from "@/hooks/use-readings";
import { formatNoteTitle } from "@/utils/datetime";

/** Sentinel select value for the free-form option; preset values are uuids. */
const CUSTOM_NOTE_VALUE = "custom";

export default function NoteScreen() {
  const { readingId } = useLocalSearchParams<{ readingId: string }>();
  const theme = useTheme<Theme>();
  const insets = useSafeAreaInsets();

  const { data: reading, isPending: readingPending } = useReading(readingId);
  const { data: note, isPending: notePending } = useNote(readingId);
  const { data: presets } = useNotePresets();

  const upsertNote = useUpsertNote();
  const deleteNote = useDeleteNote();
  const deleteSheetRef = useRef<BottomSheetModal>(null);

  // Form state: `undefined` means untouched, so the persisted note (which
  // loads async) shows through until the user edits.
  const [selectionInput, setSelectionInput] = useState<
    string | null | undefined
  >(undefined);
  const [bodyInput, setBodyInput] = useState<string | undefined>(undefined);

  const persistedSelection = note
    ? (note.preset_id ?? (note.body !== null ? CUSTOM_NOTE_VALUE : null))
    : null;
  const selection =
    selectionInput !== undefined ? selectionInput : persistedSelection;
  const body = bodyInput !== undefined ? bodyInput : (note?.body ?? "");

  const options: SelectFieldOption[] = [
    ...(presets ?? []).map((preset) => ({
      label: preset.label,
      value: preset.id,
    })),
    { label: "+ Add custom note", value: CUSTOM_NOTE_VALUE, tone: "primary" },
  ];

  const isCustom = selection === CUSTOM_NOTE_VALUE;
  // What a save would persist; the unused column is always nulled.
  const nextPresetId = isCustom ? null : selection;
  const nextBody = isCustom ? body.trim() || null : null;

  const valid = isCustom ? nextBody !== null : selection !== null;
  const dirty =
    nextPresetId !== (note?.preset_id ?? null) ||
    nextBody !== (note?.body ?? null);
  const canSave =
    valid && dirty && !upsertNote.isPending && !deleteNote.isPending;

  const handleSave = () => {
    if (!readingId) return;
    upsertNote.mutate(
      { readingId, presetId: nextPresetId, body: nextBody },
      { onSuccess: () => router.back() },
    );
  };

  const handleDelete = () => {
    if (!readingId) return;
    deleteNote.mutate(readingId, { onSuccess: () => router.back() });
  };

  const loading = readingPending || notePending;

  return (
    <>
      <Stack.Screen
        options={{
          headerRight: note
            ? () => (
                <PressableBox
                  flexDirection="row"
                  alignItems="center"
                  gap="s"
                  hitSlop={8}
                  disabled={deleteNote.isPending}
                  onPress={() => deleteSheetRef.current?.present()}>
                  <Ionicons
                    name="trash-outline"
                    size={16}
                    color={theme.colors.error}
                  />
                </PressableBox>
              )
            : undefined,
        }}
      />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <Box flex={1} backgroundColor="background">
          {loading ? (
            <Box flex={1} alignItems="center" justifyContent="center">
              <ActivityIndicator size="large" />
            </Box>
          ) : !reading ? (
            <Box
              flex={1}
              alignItems="center"
              justifyContent="center"
              padding="m">
              <Text color="textSecondary">Reading not found</Text>
            </Box>
          ) : (
            <>
              <ScrollView
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled">
                <Box padding="m" gap="ml">
                  <Text variant="title">
                    {formatNoteTitle(reading.measured_at)}
                  </Text>

                  <Box gap="s">
                    <Text color="textSecondary">
                      {reading.type === "ketone" ? "Ketones" : "Glucose"}
                    </Text>
                    <Text fontSize={16} fontFamily={Fonts.semiBold}>
                      {reading.value} {reading.unit}
                    </Text>
                  </Box>

                  <SelectField
                    label="Note (Optional)"
                    placeholder="Please select"
                    value={selection}
                    options={options}
                    onChange={setSelectionInput}
                  />

                  {isCustom && (
                    <TextField
                      label="Note"
                      placeholder="Type your note.."
                      multiline
                      value={body}
                      onChangeText={setBodyInput}
                      style={{
                        height: 160,
                        paddingVertical: 14,
                        textAlignVertical: "top",
                      }}
                    />
                  )}
                </Box>
              </ScrollView>

              <Box
                padding="m"
                style={{ paddingBottom: insets.bottom + theme.spacing.s }}>
                <Button title="Save" disabled={!canSave} onPress={handleSave} />
              </Box>
            </>
          )}
        </Box>
      </KeyboardAvoidingView>

      <ConfirmSheet
        ref={deleteSheetRef}
        title="Delete note?"
        description="This removes the note from this reading."
        confirmLabel="Delete"
        icon="trash-outline"
        destructive
        onConfirm={handleDelete}
      />
    </>
  );
}
