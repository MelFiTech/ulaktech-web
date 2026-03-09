"use client";

interface CardQuickActionsProps {
  onDetails?: () => void;
  onAddMoney?: () => void;
  onFreeze?: () => void;
}

export function CardQuickActions({
  onDetails,
  onAddMoney,
  onFreeze,
}: CardQuickActionsProps) {
  return (
    <div className="flex flex-wrap gap-6 sm:gap-8">
      <button
        type="button"
        onClick={onDetails}
        className="flex flex-col items-center gap-2 focus:outline-none focus:ring-2 focus:ring-[var(--border)] focus:ring-offset-2 rounded-full"
      >
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1e3a5f] text-white transition hover:opacity-90 sm:h-14 sm:w-14">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16v-4" />
            <path d="M12 8h.01" />
          </svg>
        </span>
        <span className="text-sm font-medium text-[var(--text)]">Details</span>
      </button>
      <button
        type="button"
        onClick={onAddMoney}
        className="flex flex-col items-center gap-2 focus:outline-none focus:ring-2 focus:ring-[var(--border)] focus:ring-offset-2 rounded-full"
      >
        <span className="flex h-12 w-12 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] transition hover:bg-[var(--background)] sm:h-14 sm:w-14">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" x2="12" y1="5" y2="19" />
            <line x1="5" x2="19" y1="12" y2="12" />
          </svg>
        </span>
        <span className="text-sm font-medium text-[var(--text)]">Add Money</span>
      </button>
      <button
        type="button"
        onClick={onFreeze}
        className="flex flex-col items-center gap-2 focus:outline-none focus:ring-2 focus:ring-[var(--border)] focus:ring-offset-2 rounded-full"
      >
        <span className="flex h-12 w-12 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] transition hover:bg-[var(--background)] sm:h-14 sm:w-14">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 3v6" />
            <path d="M12 15v6" />
            <path d="m6 6 4.24 4.24" />
            <path d="m13.76 13.76 4.24 4.24" />
            <path d="M3 12h6" />
            <path d="M15 12h6" />
            <path d="m6 18 4.24-4.24" />
            <path d="m13.76 10.24 4.24-4.24" />
          </svg>
        </span>
        <span className="text-sm font-medium text-[var(--text)]">Freeze</span>
      </button>
    </div>
  );
}
