import type { ComponentProps } from "react";
import { Box, Text } from "@/components/primitives";

type KetoneLevelProps = {
  label: string;
  range: string;
  backgroundColor: ComponentProps<typeof Box>["backgroundColor"];
  description: string;
};

export const KetoneLevel = ({
  label,
  range,
  backgroundColor,
  description,
}: KetoneLevelProps) => {
  return (
    <Box gap="m">
      <Box
        flexDirection="row"
        gap="m"
        alignItems="center"
        padding="sm"
        backgroundColor={backgroundColor}
        borderRadius="xs">
        <Text flex={1}>{label}</Text>
        <Text>{range}</Text>
      </Box>
      <Text variant="body">{description}</Text>
    </Box>
  );
};

export const KETONE_LEVELS: KetoneLevelProps[] = [
  {
    label: "Not in ketosis",
    range: "0 mmol/L",
    backgroundColor: "red300",
    description:
      "Valid reading, meter does not detect ketones. Try reducing your carbs further and make sure to avoid hidden sugars and carbs.",
  },
  {
    label: "Very light",
    range: "0.1 - 0.5 mmol/L",
    backgroundColor: "yellow300",
    description:
      "Your body is starting to produce trace amounts of ketones, but you are not in ketosis quite yet.",
  },
  {
    label: "Light",
    range: "0.6 - 0.9 mmol/L",
    backgroundColor: "green400",
    description:
      "Nutritional ketosis starts. You may start seeing diet benefits and improved energy levels.",
  },
  {
    label: "Optimal",
    range: "1.0 - 2.0 mmol/L",
    backgroundColor: "green300",
    description:
      "This is the ideal target range for most people. Your body is burning fat for energy. Many people also experience optimal mental and physical performance at this level.",
  },
  {
    label: "Deep Ketosis",
    range: "2.1 - 3.0 mmol/L",
    backgroundColor: "green600",
    description:
      "Post Exercise Ketosis. In this range, you will likely not notice any additional benefits or detriments compared to the previous 1.0 - 2.0 range.",
  },
  {
    label: "Fasting Ketosis",
    range: "3.0 - 5.0 mmol/L",
    backgroundColor: "yellow500",
    description:
      "Starvation or Fasting Ketosis. Maintaining these levels consistently should not be a long term goal for nutritional ketosis.",
  },
  {
    label: "Ketoacidosis",
    range: "5.0+ mmol/L",
    backgroundColor: "red500",
    description:
      "It is an unlikely reading to result from the keto diet alone without fasting or supplements. There may be an issue with your test strips. Try a new strip (preferably from a different vial) and contact support. Seek medical attention if you aren't feeling well.",
  },
];
