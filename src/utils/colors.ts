/** Perceived luminance — picks readable text for a stage-colored background. */
export const isDarkColor = (hex: string): boolean => {
  const rgb = hex.replace("#", "");
  const r = parseInt(rgb.slice(0, 2), 16);
  const g = parseInt(rgb.slice(2, 4), 16);
  const b = parseInt(rgb.slice(4, 6), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 < 0.55;
};
