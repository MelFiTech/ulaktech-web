"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { STORAGE_KEYS } from "@/lib/profileStorage";
import { forgotSetPin, getMe } from "@/lib/api/auth";

const PIN_LENGTH = 4;
const KEYPAD = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "⌫"];

function syncUserToStorage(user: { email: string; phone: string; name: string | null }) {
  if (typeof window === "undefined") return;
  const { USER_EMAIL, USER_NAME, USER_PHONE } = STORAGE_KEYS;
  localStorage.setItem(USER_EMAIL, user.email);
  localStorage.setItem(USER_NAME, user.name ?? user.email.split("@")[0] ?? "User");
  localStorage.setItem(USER_PHONE, user.phone);
}

export default function SetPinPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [step, setStep] = useState<1 | 2>(1);
  const [pin, setPin] = useState<string[]>([]);
  const [confirmPin, setConfirmPin] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasToken, setHasToken] = useState<boolean | null>(null);

  const digits = step === 1 ? pin : confirmPin;
  const setDigits = step === 1 ? setPin : setConfirmPin;

  useEffect(() => {
    const token =
      typeof sessionStorage !== "undefined"
        ? sessionStorage.getItem(STORAGE_KEYS.PIN_SET_TOKEN)
        : null;
    setHasToken(!!token);
    if (typeof sessionStorage !== "undefined" && !token) {
      router.replace("/login");
    }
  }, [router]);

  const handleKey = (key: string) => {
    if (key === "⌫") {
      setDigits((prev) => prev.slice(0, -1));
      setError("");
      return;
    }
    if (key === "" || digits.length >= PIN_LENGTH) return;
    setDigits((prev) => [...prev, key]);
    setError("");
  };

  const handleContinue = () => {
    if (pin.length !== PIN_LENGTH) return;
    setStep(2);
    setConfirmPin([]);
    setError("");
  };

  const handleSubmit = async () => {
    if (confirmPin.length !== PIN_LENGTH) return;
    const pinValue = pin.join("");
    const confirmValue = confirmPin.join("");
    if (pinValue !== confirmValue) {
      setError("PINs do not match. Please try again.");
      setConfirmPin([]);
      return;
    }
    const token =
      typeof sessionStorage !== "undefined"
        ? sessionStorage.getItem(STORAGE_KEYS.PIN_SET_TOKEN)
        : null;
    if (!token) {
      toast("Session expired. Please sign in again.", "error");
      router.replace("/login");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await forgotSetPin(pinValue, token);
      if (typeof sessionStorage !== "undefined") {
        sessionStorage.removeItem(STORAGE_KEYS.PIN_SET_TOKEN);
      }
      const user = await getMe();
      syncUserToStorage({
        email: user.email,
        phone: user.phone,
        name: user.name,
      });
      if (user.verified !== true && user.verificationStepRequired) {
        if (typeof sessionStorage !== "undefined") {
          sessionStorage.setItem(STORAGE_KEYS.SHOW_VERIFICATION_MODAL, "true");
        }
      }
      router.replace("/dashboard");
    } catch {
      toast("Something went wrong. Try again later.", "error");
    } finally {
      setLoading(false);
    }
  };

  if (hasToken === null) {
    return (
      <AuthLayout tagline="Set your transaction PIN.">
        <div className="flex min-h-[200px] items-center justify-center">
          <p className="text-[#171717]/60">Loading…</p>
        </div>
      </AuthLayout>
    );
  }

  if (hasToken === false) return null;

  const isPinComplete = pin.length === PIN_LENGTH;
  const isConfirmComplete = confirmPin.length === PIN_LENGTH;

  return (
    <AuthLayout tagline="Secure your wallet with a transaction PIN.">
      <div className="w-full max-w-[420px]">
        <div className="rounded-2xl border border-[#171717]/10 bg-white p-8 shadow-lg shadow-[#171717]/5">
          <div className="mb-6 text-center">
            <h1 className="text-xl font-bold text-[#171717]">
              {step === 1 ? "Create transaction PIN" : "Confirm PIN"}
            </h1>
            <p className="mt-1 text-sm text-[#171717]/60">
              {step === 1
                ? "Enter a 4-digit PIN for transfers and withdrawals."
                : "Re-enter your PIN to confirm."}
            </p>
          </div>

          <div className="mb-6 flex justify-center gap-2">
            {Array.from({ length: PIN_LENGTH }).map((_, i) => (
              <div
                key={i}
                className={`h-4 w-4 rounded-full border-2 ${
                  digits.length > i
                    ? "border-[#DC5746] bg-[#DC5746]"
                    : "border-[#171717]/30 bg-transparent"
                }`}
              />
            ))}
          </div>

          {error && (
            <p className="mb-4 text-center text-sm text-[#DC5746]" role="alert">
              {error}
            </p>
          )}

          <div className="grid grid-cols-3 gap-3">
            {KEYPAD.map((key) => (
              <button
                key={key || "empty"}
                type="button"
                onClick={() => handleKey(key)}
                disabled={key === ""}
                className="flex h-14 items-center justify-center rounded-xl border border-[#171717]/10 bg-[#F5F5F5] text-lg font-semibold text-[#171717] transition hover:bg-[#171717]/5 disabled:opacity-0"
                aria-label={key === "⌫" ? "Backspace" : key || "empty"}
              >
                {key === "⌫" ? (
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l2.83 2.83a4 4 0 005.66 0L12 12m-4.24 4.24L3 20" />
                  </svg>
                ) : (
                  key
                )}
              </button>
            ))}
          </div>

          <div className="mt-6 flex flex-col gap-3">
            {step === 1 ? (
              <Button
                type="button"
                onClick={handleContinue}
                disabled={!isPinComplete}
                variant="primary"
                className="w-full"
              >
                Continue
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleSubmit}
                disabled={!isConfirmComplete || loading}
                variant="primary"
                className="w-full"
              >
                {loading ? "Setting PIN…" : "Done"}
              </Button>
            )}
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-[#171717]/60">
          <Link href="/login" className="text-[#DC5746] hover:underline">
            Back to sign in
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
