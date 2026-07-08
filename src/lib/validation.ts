export const isValidEmail = (email: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

export type PasswordRule = {
  key: string;
  label: string;
  test: (password: string) => boolean;
};

export const passwordRules: PasswordRule[] = [
  {
    key: "length",
    label: "Minimum 8 characters",
    test: (p) => p.length >= 8,
  },
  {
    key: "case",
    label: "One uppercase & one lowercase character",
    test: (p) => /[a-z]/.test(p) && /[A-Z]/.test(p),
  },
  {
    key: "number",
    label: "One number",
    test: (p) => /[0-9]/.test(p),
  },
  {
    key: "special",
    label: "One special character",
    test: (p) => /[^A-Za-z0-9]/.test(p),
  },
];

export const isValidPassword = (password: string): boolean =>
  passwordRules.every((rule) => rule.test(password));
