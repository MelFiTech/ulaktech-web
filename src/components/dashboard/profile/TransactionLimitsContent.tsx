"use client";

export function TransactionLimitsContent() {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
      <h3 className="font-bold text-[var(--text)]">Transaction Limits</h3>
      <p className="mt-2 text-sm text-[var(--textSecondary)]">
        View and manage your daily and per-transaction limits for transfers and bill payments.
      </p>
      <p className="mt-4 text-sm text-[var(--textSecondary)]">
        Configure limits from your app or contact support to update them.
      </p>
    </div>
  );
}
