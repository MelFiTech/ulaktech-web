"use client";

interface TotalBalanceSectionProps {
  totalBalance?: string;
  balanceVisible?: boolean;
  onToggleBalanceVisibility?: () => void;
  onAddFundsClick?: () => void;
  onTransferClick?: () => void;
}

const BALANCE_MASK = "••••••";

export function TotalBalanceSection({
  totalBalance = "₦0.00",
  balanceVisible = true,
  onToggleBalanceVisibility,
  onAddFundsClick,
  onTransferClick,
}: TotalBalanceSectionProps) {
  const displayBalance = balanceVisible ? totalBalance : BALANCE_MASK;

  return (
    <section className="rounded-2xl bg-gradient-to-br from-[#DC5746] via-[#E56B5A] to-[#F5BE47] p-4 sm:p-6 border border-transparent">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-white/80">Total balance</span>
            <button
              type="button"
              onClick={onToggleBalanceVisibility}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/30 bg-white/20 text-white/90 transition hover:bg-white/30 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/50"
              aria-label={balanceVisible ? "Hide balance" : "Show balance"}
            >
              {balanceVisible ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                  <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                  <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                  <line x1="2" x2="22" y1="2" y2="22" />
                </svg>
              )}
            </button>
          </div>
          <p className="mt-2 text-2xl font-bold text-white sm:text-3xl">{displayBalance}</p>
        </div>
        <div className="flex flex-wrap gap-3 sm:gap-4">
          <button
            type="button"
            onClick={onAddFundsClick}
            className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm font-medium text-black transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-white/50 sm:px-5 sm:py-3"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" x2="12" y1="5" y2="19" />
              <line x1="5" x2="19" y1="12" y2="12" />
            </svg>
            Add funds
          </button>
          <button
            type="button"
            onClick={onTransferClick}
            className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm font-medium text-black transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-white/50 sm:px-5 sm:py-3"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="5" x2="19" y1="12" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
            Transfer
          </button>
        </div>
      </div>
    </section>
  );
}
