import { Box, Text } from "@/components/primitives";

export default function HelpScreen() {
  return (
    <Box
      flex={1}
      backgroundColor="background"
      padding="m"
      justifyContent="center"
      alignItems="center">
      <Text fontSize={24}>Help tab</Text>
    </Box>
  );
}
