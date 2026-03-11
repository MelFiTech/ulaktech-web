/**
 * Storage keys for profile/session. Clear all on logout.
 */
export const STORAGE_KEYS = {
  THEME: "ulaktech-theme",
  AVATAR_URI: "ulaktech-avatar-uri",
  BALANCE_VISIBLE: "ulaktech-balance-visible",
  NOTIFICATIONS: "ulaktech-notifications",
  BIOMETRIC: "ulaktech-biometric",
  PASSCODE: "ulaktech-passcode",
  TRANSACTION_PIN: "ulaktech-transaction-pin",
  USER_NAME: "ulaktech-user-name",
  USER_EMAIL: "ulaktech-user-email",
  USER_PHONE: "ulaktech-user-phone",
  USER_USERNAME: "ulaktech-user-username",
  /** Session only: show verification modal on dashboard (set when user has PIN but not verified). */
  SHOW_VERIFICATION_MODAL: "ulaktech_show_verification_modal",
  /** Session only: access token for set-pin step after OTP (cleared after use). */
  PIN_SET_TOKEN: "ulaktech_pin_set_token",
  /** Session only: JWT access token for API auth when cross-origin cookies are not sent. */
  ACCESS_TOKEN: "ulaktech_access_token",
} as const;

/** In-memory token so the very next request after login has the token (avoids race with sessionStorage on nav). */
let _accessTokenMemory: string | null = null;

const LOGOUT_CLEAR_KEYS = [
  STORAGE_KEYS.AVATAR_URI,
  STORAGE_KEYS.BALANCE_VISIBLE,
  STORAGE_KEYS.NOTIFICATIONS,
  STORAGE_KEYS.BIOMETRIC,
  STORAGE_KEYS.PASSCODE,
  STORAGE_KEYS.TRANSACTION_PIN,
  STORAGE_KEYS.USER_NAME,
  STORAGE_KEYS.USER_EMAIL,
  STORAGE_KEYS.USER_PHONE,
  STORAGE_KEYS.USER_USERNAME,
] as const;

export function clearSessionStorage() {
  if (typeof window === "undefined") return;
  LOGOUT_CLEAR_KEYS.forEach((key) => localStorage.removeItem(key));
  _accessTokenMemory = null;
  sessionStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
}

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return _accessTokenMemory ?? sessionStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
}

export function setAccessToken(token: string | null) {
  if (typeof window === "undefined") return;
  _accessTokenMemory = token;
  if (token) sessionStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token);
  else sessionStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
}

export function getStoredAvatarUri(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(STORAGE_KEYS.AVATAR_URI);
}

export function setStoredAvatarUri(uri: string | null) {
  if (typeof window === "undefined") return;
  if (uri) localStorage.setItem(STORAGE_KEYS.AVATAR_URI, uri);
  else localStorage.removeItem(STORAGE_KEYS.AVATAR_URI);
}

export function getBalanceVisible(): boolean {
  if (typeof window === "undefined") return true;
  const v = localStorage.getItem(STORAGE_KEYS.BALANCE_VISIBLE);
  return v === null || v === "true";
}

export function setBalanceVisible(value: boolean) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.BALANCE_VISIBLE, String(value));
}

export function getNotificationsEnabled(): boolean {
  if (typeof window === "undefined") return true;
  const v = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
  return v === null || v === "true";
}

export function setNotificationsEnabled(value: boolean) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, String(value));
}

export function getBiometricEnabled(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(STORAGE_KEYS.BIOMETRIC) === "true";
}

export function setBiometricEnabled(value: boolean) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.BIOMETRIC, String(value));
}
