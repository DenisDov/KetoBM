export const BOX_SHADOWS: Record<string, string> = {
  default: "0px 0px 6px 0px rgba(107, 107, 107, 0.18)",
  card: "0px 0px 8px 0px rgba(107, 107, 107, 0.18)",
  button: "0px 4px 6px 0px rgba(37, 51, 109, .21)",
};

// Utility function for easy usage
export const getBoxShadow = (variant = "default") => ({
  boxShadow: BOX_SHADOWS[variant],
});
