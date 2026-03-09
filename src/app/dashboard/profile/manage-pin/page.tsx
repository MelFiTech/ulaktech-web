"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ProfileSubPageHeader } from "@/components/dashboard/profile/ProfileSubPageHeader";
import { WalletPinInput } from "@/components/ui/WalletPinInput";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { STORAGE_KEYS } from "@/lib/profileStorage";

const PIN_LENGTH = 4;

export default function ManagePinPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [currentPin, setCurrentPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [confirmNewPin, setConfirmNewPin] = useState("");
  const [error, setError] = useState("");
  const [storedPin, setStoredPin] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setStoredPin(localStorage.getItem(STORAGE_KEYS.TRANSACTION_PIN));
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (storedPin) {
      if (currentPin.length !== PIN_LENGTH) {
        setError("Enter your current 4-digit PIN.");
        return;
      }
      if (currentPin !== storedPin) {
        setError("Current PIN is incorrect.");
        return;
      }
    }
    if (newPin.length !== PIN_LENGTH) {
      setError("Enter a new 4-digit PIN.");
      return;
    }
    if (newPin !== confirmNewPin) {
      setError("New PIN and confirmation do not match.");
      return;
    }
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.TRANSACTION_PIN, newPin);
    }
    toast("PIN updated.", "success");
    router.push("/dashboard/profile");
  };

  return (
    <div className="mx-auto max-w-md space-y-8">
      <ProfileSubPageHeader title="Manage PIN" />

      <form onSubmit={handleSubmit} className="space-y-6">
        <WalletPinInput
          label="Current PIN"
          value={currentPin}
          onChange={setCurrentPin}
          error={error}
        />
        <WalletPinInput
          label="New PIN"
          value={newPin}
          onChange={setNewPin}
        />
        <div>
          <label className="mb-1.5 block text-sm font-medium text-[var(--text)]">
            Confirm new PIN
          </label>
          <input
            type="password"
            inputMode="numeric"
            maxLength={PIN_LENGTH}
            value={confirmNewPin}
            onChange={(e) => setConfirmNewPin(e.target.value.replace(/\D/g, "").slice(0, PIN_LENGTH))}
            placeholder="••••"
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-center text-lg tracking-[0.5em] text-[var(--text)]"
          />
        </div>
        <p className="text-sm text-[var(--textSecondary)]">
          <Link
            href="/dashboard/profile/forgot-otp?type=pin"
            className="font-medium text-[var(--tint)] hover:underline"
          >
            Forgot PIN?
          </Link>
        </p>
        <Button type="submit" fullWidth>Change PIN</Button>
      </form>
    </div>
  );
}
