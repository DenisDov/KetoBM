export const FONTS = {
  REGULAR: "GeneralSans-Regular",
  SEMI_BOLD: "GeneralSans-SemiBold",
} as const;

export type FontFamily = (typeof FONTS)[keyof typeof FONTS];
