"use client";

import { useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ProfileSubPageHeader } from "@/components/dashboard/profile/ProfileSubPageHeader";
import { WalletPinInput } from "@/components/ui/WalletPinInput";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { STORAGE_KEYS } from "@/lib/profileStorage";
import { useDashboardUser } from "@/contexts/DashboardUserContext";

const OTP_LENGTH = 6;
const PIN_LENGTH = 4;
const PASSCODE_LENGTH = 6;

type ForgotType = "pin" | "passcode";

export default function ForgotOtpPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const { user } = useDashboardUser();
  const type = useMemo((): ForgotType => {
    const t = searchParams.get("type");
    return t === "pin" ? "pin" : "passcode";
  }, [searchParams]);

  const [step, setStep] = useState<"request" | "otp" | "new">("request");
  const [otp, setOtp] = useState("");
  const [newPin, setNewPin] = useState("");
  const [newPasscode, setNewPasscode] = useState("");
  const [confirmPasscode, setConfirmPasscode] = useState("");
  const [error, setError] = useState("");

  const title = type === "pin" ? "Forgot PIN" : "Forgot passcode";
  const email = user.email || "your email";

  const handleRequestOtp = () => {
    // Mock: OTP sent to email
    toast("Verification code sent to your email.", "success");
    setStep("otp");
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== OTP_LENGTH) {
      setError("Enter the 6-digit code from your email.");
      return;
    }
    setError("");
    setStep("new");
  };

  const handleSetNew = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (type === "pin") {
      if (newPin.length !== PIN_LENGTH) {
        setError("Enter a 4-digit PIN.");
        return;
      }
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEYS.TRANSACTION_PIN, newPin);
      }
      toast("PIN reset successfully.", "success");
    } else {
      if (newPasscode.length !== PASSCODE_LENGTH || confirmPasscode.length !== PASSCODE_LENGTH) {
        setError("Enter and confirm your 6-digit passcode.");
        return;
      }
      if (newPasscode !== confirmPasscode) {
        setError("Passcode and confirmation do not match.");
        return;
      }
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEYS.PASSCODE, newPasscode);
      }
      toast("Passcode reset successfully.", "success");
    }
    router.push("/dashboard/profile");
  };

  return (
    <div className="mx-auto max-w-md space-y-8">
      <ProfileSubPageHeader title={title} backHref="/dashboard/profile" />

      {step === "request" && (
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
          <p className="text-sm text-[var(--text)]">
            We’ll send a verification code to <strong>{email}</strong> to reset your {type === "pin" ? "PIN" : "passcode"}.
          </p>
          <Button
            type="button"
            className="mt-6 w-full"
            onClick={handleRequestOtp}
          >
            Send code
          </Button>
        </div>
      )}

      {step === "otp" && (
        <form onSubmit={handleVerifyOtp} className="space-y-6">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[var(--text)]">
              Enter 6-digit code sent to {email}
            </label>
            <input
              type="text"
              inputMode="numeric"
              maxLength={OTP_LENGTH}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, OTP_LENGTH))}
              placeholder="000000"
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-center text-lg tracking-[0.5em] text-[var(--text)]"
            />
            {error && <p className="mt-1.5 text-sm text-[var(--error)]">{error}</p>}
          </div>
          <Button type="submit" fullWidth>Verify</Button>
          <button
            type="button"
            onClick={handleRequestOtp}
            className="w-full text-sm font-medium text-[var(--tint)] hover:underline"
          >
            Resend code
          </button>
        </form>
      )}

      {step === "new" && (
        <form onSubmit={handleSetNew} className="space-y-6">
          {type === "pin" ? (
            <WalletPinInput
              label="New PIN"
              value={newPin}
              onChange={setNewPin}
              error={error}
            />
          ) : (
            <>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[var(--text)]">New passcode</label>
                <input
                  type="password"
                  inputMode="numeric"
                  maxLength={PASSCODE_LENGTH}
                  value={newPasscode}
                  onChange={(e) => setNewPasscode(e.target.value.replace(/\D/g, "").slice(0, PASSCODE_LENGTH))}
                  placeholder="6 digits"
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-[var(--text)]"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[var(--text)]">Confirm passcode</label>
                <input
                  type="password"
                  inputMode="numeric"
                  maxLength={PASSCODE_LENGTH}
                  value={confirmPasscode}
                  onChange={(e) => setConfirmPasscode(e.target.value.replace(/\D/g, "").slice(0, PASSCODE_LENGTH))}
                  placeholder="6 digits"
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-[var(--text)]"
                />
              </div>
              {error && <p className="text-sm text-[var(--error)]">{error}</p>}
            </>
          )}
          <Button type="submit" fullWidth>
            Set new {type === "pin" ? "PIN" : "passcode"}
          </Button>
        </form>
      )}

      <p className="text-center text-sm text-[var(--textSecondary)]">
        <Link href="/dashboard/profile" className="font-medium text-[var(--tint)] hover:underline">
          Back to Profile
        </Link>
      </p>
    </div>
  );
}
