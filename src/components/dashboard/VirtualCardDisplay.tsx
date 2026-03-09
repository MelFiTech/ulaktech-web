"use client";

interface VirtualCardDisplayProps {
  /** Masked card number e.g. "**** **** **** 8429" */
  maskedNumber?: string;
  /** Balance to show e.g. "$1.39" or "₦0.00" */
  balance?: string;
  /** Whether to hide balance (show dots) */
  balanceVisible?: boolean;
}

const BALANCE_MASK = "••••••";

export function VirtualCardDisplay({
  maskedNumber = "**** **** **** 8429",
  balance = "$1.39",
  balanceVisible = true,
}: VirtualCardDisplayProps) {
  const displayBalance = balanceVisible ? balance : BALANCE_MASK;

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1a1a1f] via-[#252530] to-[#1a1a1f] p-6 shadow-lg">
      {/* Subtle geometric pattern */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        aria-hidden
        style={{
          backgroundImage: `radial-gradient(circle at 20% 80%, white 1px, transparent 1px),
            radial-gradient(circle at 80% 20%, white 1px, transparent 1px),
            radial-gradient(circle at 40% 40%, white 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
        }}
      />
      <div className="relative flex flex-col justify-between min-h-[180px] sm:min-h-[200px]">
        <div className="flex items-start justify-between">
          <span className="text-lg font-bold text-white">Ulaktech</span>
        </div>
        <p className="mt-4 font-mono text-lg tracking-[0.2em] text-white/90 sm:text-xl">
          {maskedNumber}
        </p>
        <div className="mt-4 flex items-end justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-white/60">
              Balance
            </p>
            <p className="text-xl font-bold text-white sm:text-2xl">
              {displayBalance}
            </p>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-[10px] font-medium text-white/80">Mastercard</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="36"
              height="24"
              viewBox="0 0 36 24"
              fill="none"
              className="text-white"
              aria-hidden
            >
              <circle cx="14" cy="12" r="8" fill="currentColor" opacity="0.8" />
              <circle cx="22" cy="12" r="8" fill="currentColor" opacity="0.6" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
