/**
 * Verification API – BVN, selfie, status.
 * Matches ulaktech-backend verification controller.
 */

import { getApiUrl } from "./client";
import { apiFetch } from "./client";

const VERIFICATION_PREFIX = "api/verification";

export interface VerificationBvnBody {
  bvn: string;
  dateOfBirth: string;
}

export interface VerificationStatusResponse {
  bvnSubmitted: boolean;
  bvnVerified: boolean;
  selfieSubmitted: boolean;
  selfieVerified: boolean;
  overallStatus: string;
  verificationStepRequired: "bvn" | "selfie" | null;
}

export function verificationBvn(body: VerificationBvnBody): Promise<{ status: string; message: string }> {
  return apiFetch(`${VERIFICATION_PREFIX}/bvn`, { method: "POST", body: body as unknown as BodyInit });
}

export function verificationStatus(): Promise<VerificationStatusResponse> {
  return apiFetch(`${VERIFICATION_PREFIX}/status`, { method: "GET" });
}

/** Submit selfie (multipart/form-data). Uses fetch with credentials. */
export async function verificationSelfie(file: File): Promise<{ status: string; message: string }> {
  const url = getApiUrl(VERIFICATION_PREFIX + "/selfie");
  const form = new FormData();
  form.append("file", file, file.name || "selfie.jpg");
  const res = await fetch(url, {
    method: "POST",
    body: form,
    credentials: "include",
  });
  if (!res.ok) {
    let message = res.statusText;
    try {
      const data = (await res.json()) as { message?: string | string[] };
      message = Array.isArray(data.message) ? data.message[0] : (data.message ?? message);
    } catch {
      // ignore
    }
    const err = new Error(message) as Error & { statusCode?: number };
    err.statusCode = res.status;
    throw err;
  }
  return res.json();
}
