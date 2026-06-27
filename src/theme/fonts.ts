export const FONTS = {
  REGULAR: "SpaceMono-Regular",
} as const;

export type FontFamily = (typeof FONTS)[keyof typeof FONTS];
