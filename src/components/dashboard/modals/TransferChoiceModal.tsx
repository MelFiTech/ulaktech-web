"use client";

const BRAND_NAME = "Ulaktech";

export type TransferOptionType = "send" | "withdrawToBank";

interface TransferChoiceModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (option: TransferOptionType) => void;
}

export function TransferChoiceModal({ open, onClose, onSelect }: TransferChoiceModalProps) {
  if (!open) return null;

  const handleSend = () => {
    onSelect("send");
    onClose();
  };

  const handleWithdrawToBank = () => {
    onSelect("withdrawToBank");
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="transfer-choice-title"
    >
      <div
        className="absolute inset-0 bg-black/50"
        aria-hidden
        onClick={onClose}
      />
      <div className="relative w-full max-w-md rounded-t-3xl bg-[var(--surface)] p-6 shadow-xl sm:rounded-2xl">
        <h2 id="transfer-choice-title" className="mb-5 text-center text-lg font-bold text-[var(--text)]">
          Transfer
        </h2>

        {/* Send to another Ulaktech user */}
        <button
          type="button"
          onClick={handleSend}
          className="flex w-full items-center justify-between gap-3 rounded-xl py-3.5 px-1 text-left transition hover:bg-[var(--background)] active:opacity-90"
        >
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--tint)]/20">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--tint)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 2L11 13" />
                <path d="M22 2L15 22L11 13L2 9L22 2Z" />
              </svg>
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-[var(--text)]">Send</p>
              <p className="mt-0.5 text-sm text-[var(--textSecondary)]">
                Send to another {BRAND_NAME} user
              </p>
            </div>
          </div>
          <span className="shrink-0 rounded-full bg-[var(--tint)] px-2.5 py-1 text-xs font-semibold text-white">
            Free
          </span>
        </button>

        <div className="my-1 h-px bg-[var(--border)]" />

        {/* Withdraw to bank */}
        <button
          type="button"
          onClick={handleWithdrawToBank}
          className="flex w-full items-center justify-between gap-3 rounded-xl py-3.5 px-1 text-left transition hover:bg-[var(--background)] active:opacity-90"
        >
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--textSecondary)]/20">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--textSecondary)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" />
                <path d="M3 9l9-7 9 7" />
                <path d="M9 22V12h6v10" />
              </svg>
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-[var(--text)]">Withdraw to bank</p>
              <p className="mt-0.5 text-sm text-[var(--textSecondary)]">
                Withdraw to your bank account
              </p>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}
