/**
 * Theme color palette. CSS variables in globals.css mirror these.
 * Use CSS variables (var(--tint), var(--surface), etc.) in components when possible.
 */
export const light = {
  background: "#FCFCFC",
  surface: "#FFFFFF",
  text: "#1A1A1A",
  textSecondary: "#6B6B6B",
  border: "#E0E0E0",
  error: "#DC2626",
  success: "#16A34A",
  warning: "#F59E0B",
  tint: "#DC5746",
  tabIconDefault: "#9CA3AF",
  tabIconSelected: "#DC5746",
} as const;

export const dark = {
  background: "#0B0B0B",
  surface: "#1F1F24",
  text: "#FFFFFF",
  textSecondary: "#A1A1AA",
  border: "#2F2F35",
  error: "#EF4444",
  success: "#22C55E",
  warning: "#FBBF24",
  tint: "#E56B5A",
  tabIconDefault: "#6B7280",
  tabIconSelected: "#E56B5A",
} as const;

export const colors = { light, dark } as const;
