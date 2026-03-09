/**
 * Auth API – matches ulaktech-backend auth controller.
 * Base path: /api/auth
 * Cookies: access_token, refresh_token (set by backend; send with credentials: 'include').
 */

import { apiFetch } from "./client";

export interface AuthUser {
  id: string;
  email: string;
  phone: string;
  name: string | null;
  emailVerified: boolean;
  hasSetPin: boolean;
  verified: boolean;
  verificationStepRequired: "bvn" | "selfie" | null;
}

export interface TokensAndUser {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
}

/** POST /api/auth/register – create user, send OTP to email. */
export async function register(body: {
  email: string;
  phone: string;
  passcode: string;
  displayName?: string;
}): Promise<{ message: string; userId: string; requiresOtp: boolean }> {
  return apiFetch("api/auth/register", { method: "POST", body: body as unknown as BodyInit });
}

/** POST /api/auth/otp/send – resend OTP (signup or forgot). */
export async function otpSend(body: {
  email: string;
  purpose?: "signup" | "reset_pin" | "reset_passcode";
  phone?: string;
}): Promise<{ message: string; expiresIn: number }> {
  return apiFetch("api/auth/otp/send", { method: "POST", body: body as unknown as BodyInit });
}

/** POST /api/auth/otp/verify – verify OTP after signup; sets cookies, returns tokens + user. */
export async function otpVerify(body: { email: string; otp: string }): Promise<TokensAndUser> {
  return apiFetch("api/auth/otp/verify", { method: "POST", body: body as unknown as BodyInit });
}

/** POST /api/auth/login – sets cookies, returns tokens + user. */
export async function login(body: { email: string; passcode: string }): Promise<TokensAndUser> {
  return apiFetch("api/auth/login", { method: "POST", body: body as unknown as BodyInit });
}

/** POST /api/auth/refresh – body: { refreshToken }; returns new accessToken, refreshToken. */
export async function refresh(body: { refreshToken: string }): Promise<{
  accessToken: string;
  refreshToken: string;
}> {
  return apiFetch("api/auth/refresh", { method: "POST", body: body as unknown as BodyInit });
}

/** POST /api/auth/logout – invalidate session; optional body: { refreshToken }. */
export async function logout(body?: { refreshToken?: string }): Promise<void> {
  return apiFetch("api/auth/logout", { method: "POST", body: (body ?? {}) as unknown as BodyInit });
}

/** POST /api/auth/forgot/verify-otp – returns short-lived resetToken. */
export async function forgotVerifyOtp(body: {
  email: string;
  otp: string;
  purpose: "reset_pin" | "reset_passcode";
}): Promise<{ resetToken: string; expiresIn: number }> {
  return apiFetch("api/auth/forgot/verify-otp", { method: "POST", body: body as unknown as BodyInit });
}

/** POST /api/auth/forgot/set-pin – requires Authorization: Bearer <resetToken>. */
export async function forgotSetPin(pin: string, resetToken: string): Promise<{ message: string }> {
  return apiFetch("api/auth/forgot/set-pin", {
    method: "POST",
    body: { pin } as unknown as BodyInit,
    headers: { Authorization: `Bearer ${resetToken}` },
  });
}

/** POST /api/auth/forgot/set-passcode – requires Authorization: Bearer <resetToken>. */
export async function forgotSetPasscode(
  passcode: string,
  resetToken: string
): Promise<{ message: string }> {
  return apiFetch("api/auth/forgot/set-passcode", {
    method: "POST",
    body: { passcode } as unknown as BodyInit,
    headers: { Authorization: `Bearer ${resetToken}` },
  });
}

/** POST /api/auth/me/change-passcode – requires cookie (JWT). */
export async function changePasscode(body: {
  currentPasscode: string;
  newPasscode: string;
}): Promise<{ message: string }> {
  return apiFetch("api/auth/me/change-passcode", { method: "POST", body: body as unknown as BodyInit });
}

/** POST /api/auth/me/change-pin – requires cookie (JWT). */
export async function changePin(body: {
  currentPin: string;
  newPin: string;
}): Promise<{ message: string }> {
  return apiFetch("api/auth/me/change-pin", { method: "POST", body: body as unknown as BodyInit });
}

/** GET /api/auth/me – current user; requires cookie (JWT). */
export async function getMe(): Promise<AuthUser> {
  return apiFetch("api/auth/me", { method: "GET" });
}
