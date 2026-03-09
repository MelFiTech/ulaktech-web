"use client";

import { Button } from "@/components/ui/Button";

interface VerificationModalProps {
  open: boolean;
  onClose: () => void;
  onStartVerification: () => void;
}

export function VerificationModal({
  open,
  onClose,
  onStartVerification,
}: VerificationModalProps) {
  if (!open) return null;

  const handleStart = () => {
    onClose();
    onStartVerification();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="verification-modal-title"
    >
      <div
        className="absolute inset-0 bg-black/50"
        aria-hidden
        onClick={onClose}
      />
      <div className="relative w-full max-w-md rounded-t-3xl border-t border-[var(--border)] bg-[var(--surface)] p-6 shadow-xl sm:rounded-2xl sm:border">
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--tint)]/20">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--tint)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <h2
            id="verification-modal-title"
            className="text-xl font-bold text-[var(--text)]"
          >
            Verify your identity
          </h2>
          <p className="mt-2 text-sm text-[var(--textSecondary)]">
            Complete verification to get your account number and full access to your wallet.
          </p>
          <Button
            type="button"
            onClick={handleStart}
            variant="primary"
            className="mt-6 w-full"
          >
            Start verification
          </Button>
        </div>
      </div>
    </div>
  );
}
