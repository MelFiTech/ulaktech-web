"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ProfileSubPageHeader } from "@/components/dashboard/profile/ProfileSubPageHeader";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { STORAGE_KEYS } from "@/lib/profileStorage";

const PASSCODE_LENGTH = 6;

function PasscodeField({
  label,
  value,
  onChange,
  error,
  showToggle = true,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  showToggle?: boolean;
}) {
  const [show, setShow] = useState(false);
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-[var(--text)]">{label}</label>
      <div className="flex gap-2">
        <input
          type={show ? "text" : "password"}
          inputMode="numeric"
          maxLength={PASSCODE_LENGTH}
          value={value}
          onChange={(e) => onChange(e.target.value.replace(/\D/g, "").slice(0, PASSCODE_LENGTH))}
          placeholder="6 digits"
          className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-[var(--text)] placeholder:text-[var(--textSecondary)]/50"
        />
        {showToggle && (
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            className="shrink-0 rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm font-medium text-[var(--textSecondary)]"
          >
            {show ? "Hide" : "Show"}
          </button>
        )}
      </div>
      {error && <p className="mt-1.5 text-sm text-[var(--error)]">{error}</p>}
    </div>
  );
}

export default function ManagePasscodePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [currentPasscode, setCurrentPasscode] = useState("");
  const [newPasscode, setNewPasscode] = useState("");
  const [confirmNewPasscode, setConfirmNewPasscode] = useState("");
  const [error, setError] = useState("");
  const [storedPasscode, setStoredPasscode] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setStoredPasscode(localStorage.getItem(STORAGE_KEYS.PASSCODE));
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (storedPasscode) {
      if (currentPasscode.length !== PASSCODE_LENGTH) {
        setError("Enter your current 6-digit passcode.");
        return;
      }
      if (currentPasscode !== storedPasscode) {
        setError("Current passcode is incorrect.");
        return;
      }
    }
    if (newPasscode.length !== PASSCODE_LENGTH) {
      setError("Enter a new 6-digit passcode.");
      return;
    }
    if (newPasscode !== confirmNewPasscode) {
      setError("New passcode and confirmation do not match.");
      return;
    }
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.PASSCODE, newPasscode);
    }
    toast("Passcode updated.", "success");
    router.push("/dashboard/profile");
  };

  return (
    <div className="mx-auto max-w-md space-y-8">
      <ProfileSubPageHeader title="Manage Passcode" />

      <form onSubmit={handleSubmit} className="space-y-6">
        <PasscodeField
          label="Current passcode"
          value={currentPasscode}
          onChange={setCurrentPasscode}
          error={error}
        />
        <PasscodeField label="New passcode" value={newPasscode} onChange={setNewPasscode} />
        <PasscodeField
          label="Confirm new passcode"
          value={confirmNewPasscode}
          onChange={setConfirmNewPasscode}
          showToggle={false}
        />
        <p className="text-sm text-[var(--textSecondary)]">
          <Link
            href="/dashboard/profile/forgot-otp?type=passcode"
            className="font-medium text-[var(--tint)] hover:underline"
          >
            Forgot passcode?
          </Link>
        </p>
        <Button type="submit" fullWidth>Change passcode</Button>
      </form>
    </div>
  );
}
