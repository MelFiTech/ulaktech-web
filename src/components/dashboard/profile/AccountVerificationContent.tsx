"use client";

export function AccountVerificationContent() {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
      <h3 className="font-bold text-[var(--text)]">Account Verification</h3>
      <p className="mt-2 text-sm text-[var(--textSecondary)]">
        Your account verification status and documents. Higher verification levels unlock
        higher limits and more features.
      </p>
      <p className="mt-4 text-sm text-[var(--textSecondary)]">
        Verification is managed from the app. Open the Ulaktech app to complete or update
        your verification.
      </p>
    </div>
  );
}
