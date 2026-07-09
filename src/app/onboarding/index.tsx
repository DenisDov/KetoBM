import { Ionicons } from "@react-native-vector-icons/ionicons";
import { useTheme } from "@shopify/restyle";
import { useState } from "react";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Box, PressableBox, Text } from "@/components/primitives";
import { Button } from "@/components/button";
import { OptionCard, SelectField, TextField } from "@/components/form";
import { useAuthStore, ProfileUpdate } from "@/hooks/use-auth-store";
import { Theme } from "@/theme";

const TOTAL_STEPS = 4;

const GENDER_OPTIONS = [
  { label: "Male", value: "male" },
  { label: "Female", value: "female" },
  { label: "Other", value: "other" },
];

const GOAL_OPTIONS = [
  { label: "Ketogenic diet", value: "ketogenic_diet" },
  { label: "Diabetes management", value: "diabetes_management" },
  { label: "Both", value: "both" },
];

const METER_OPTIONS = [
  { label: "No, I haven't", value: "none" },
  { label: "I have used Glucose meter", value: "glucose" },
  { label: "I have used Ketone meter", value: "ketone" },
  { label: "I have used both Glucose & Ketone meter", value: "both" },
];

const SUPPLEMENT_OPTIONS = [
  { label: "Magnesium", value: "magnesium" },
  { label: "Other Electrolytes (sodium, potassium)", value: "electrolytes" },
  {
    label: "Exogenous Ketones (BHP Salts or Esters)",
    value: "exogenous_ketones",
  },
  { label: "MCT Oil", value: "mct_oil" },
  { label: "Omega 3 (Fish Oil)", value: "omega_3" },
  { label: "Vitamin D", value: "vitamin_d" },
  { label: "Other", value: "other" },
];

const CURRENT_YEAR = new Date().getFullYear();
const YEAR_OPTIONS = Array.from({ length: CURRENT_YEAR - 1900 + 1 }, (_, i) => {
  const year = String(CURRENT_YEAR - i);
  return { label: year, value: year };
});

export default function OnboardingScreen() {
  const theme = useTheme<Theme>();
  const { profile, updateProfile } = useAuthStore();

  // Resume where the user left off (onboarding_step = last completed step).
  const [step, setStep] = useState(() =>
    Math.min((profile?.onboarding_step ?? 0) + 1, TOTAL_STEPS),
  );
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState(profile?.first_name ?? "");
  const [yearOfBirth, setYearOfBirth] = useState<string | null>(
    profile?.year_of_birth ? String(profile.year_of_birth) : null,
  );
  const [gender, setGender] = useState<string | null>(profile?.gender ?? null);
  const [goal, setGoal] = useState<string | null>(
    profile?.primary_goal ?? null,
  );
  const [meterExperience, setMeterExperience] = useState<string | null>(
    profile?.meter_experience ?? null,
  );
  const [supplements, setSupplements] = useState<string[]>(
    profile?.supplements ?? [],
  );

  const toggleSupplement = (value: string) => {
    setSupplements((current) =>
      current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value],
    );
  };

  const saveStep = async (patch: ProfileUpdate) => {
    setSaving(true);
    try {
      await updateProfile({
        ...patch,
        // Only move forward so going back and re-saving never loses progress.
        onboarding_step: Math.max(profile?.onboarding_step ?? 0, step),
      });
      if (step < TOTAL_STEPS) {
        setStep(step + 1);
      }
    } catch {
      // updateProfile already surfaced the error.
    } finally {
      setSaving(false);
    }
  };

  const onNext = () => {
    switch (step) {
      case 1:
        return saveStep({
          first_name: name.trim(),
          year_of_birth: yearOfBirth ? Number(yearOfBirth) : null,
          gender,
        });
      case 2:
        return saveStep({ primary_goal: goal });
      case 3:
        return saveStep({ meter_experience: meterExperience });
      case 4:
        return saveStep({
          supplements,
          onboarding_completed_at: new Date().toISOString(),
        });
    }
  };

  const canContinue = (() => {
    switch (step) {
      case 1:
        return !!name.trim() && !!yearOfBirth && !!gender;
      case 2:
        return !!goal;
      case 3:
        return !!meterExperience;
      default:
        // Supplements are "check all that apply" — none is a valid answer.
        return true;
    }
  })();

  const titles: Record<number, { title: string; subtitle?: string }> = {
    1: {
      title: "Help us personalize your experience",
      subtitle: "It only takes less than a minute.",
    },
    2: { title: "What is your primary goal with this device?" },
    3: { title: "Have you used a blood meter before" },
    4: {
      title: "Do you use any supplements",
      subtitle: "Check all that apply.",
    },
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/* Header: back arrow, step counter, progress bar */}
      <Box
        flexDirection="row"
        alignItems="center"
        paddingHorizontal="m"
        paddingVertical="sm">
        <Box width={24}>
          {step > 1 && (
            <PressableBox hitSlop={8} onPress={() => setStep(step - 1)}>
              <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
            </PressableBox>
          )}
        </Box>
        <Text flex={1} textAlign="center" fontSize={16} color="text">
          {step}/{TOTAL_STEPS}
        </Text>
        <Box width={24} />
      </Box>
      <Box height={3} backgroundColor="neutral100">
        <Box
          height={3}
          backgroundColor="primary"
          width={`${(step / TOTAL_STEPS) * 100}%`}
        />
      </Box>

      <ScrollView
        contentContainerStyle={{
          padding: theme.spacing.m,
          gap: theme.spacing.m,
        }}
        keyboardShouldPersistTaps="handled">
        <Box gap="s">
          <Text variant="title">{titles[step].title}</Text>
          {titles[step].subtitle && (
            <Text color="textSecondary">{titles[step].subtitle}</Text>
          )}
        </Box>

        {step === 1 && (
          <Box gap="m">
            <TextField
              label="Your name"
              placeholder="Enter your name"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
            />
            <SelectField
              label="Year of birth"
              placeholder="Please select"
              value={yearOfBirth}
              options={YEAR_OPTIONS}
              onChange={setYearOfBirth}
            />
            <Box gap="s">
              <Text fontSize={14} color="text">
                Gender
              </Text>
              <Box flexDirection="row" flexWrap="wrap" gap="sm">
                {GENDER_OPTIONS.map((option) => (
                  <Box key={option.value} width="47%">
                    <OptionCard
                      label={option.label}
                      selected={gender === option.value}
                      onPress={() => setGender(option.value)}
                    />
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        )}

        {step === 2 && (
          <Box gap="sm">
            {GOAL_OPTIONS.map((option) => (
              <OptionCard
                key={option.value}
                label={option.label}
                selected={goal === option.value}
                onPress={() => setGoal(option.value)}
              />
            ))}
          </Box>
        )}

        {step === 3 && (
          <Box gap="sm">
            {METER_OPTIONS.map((option) => (
              <OptionCard
                key={option.value}
                label={option.label}
                selected={meterExperience === option.value}
                onPress={() => setMeterExperience(option.value)}
              />
            ))}
          </Box>
        )}

        {step === 4 && (
          <Box gap="sm">
            {SUPPLEMENT_OPTIONS.map((option) => (
              <OptionCard
                key={option.value}
                control="checkbox"
                label={option.label}
                selected={supplements.includes(option.value)}
                onPress={() => toggleSupplement(option.value)}
              />
            ))}
          </Box>
        )}
      </ScrollView>

      <Box padding="m">
        <Button
          title={step === TOTAL_STEPS ? "Done" : "Next"}
          disabled={!canContinue || saving}
          onPress={onNext}
        />
      </Box>
    </SafeAreaView>
  );
}
