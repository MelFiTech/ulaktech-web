"use client";

interface ManageCardSectionProps {
  onWithdraw?: () => void;
  onStatement?: () => void;
  onDelete?: () => void;
}

export function ManageCardSection({
  onWithdraw,
  onStatement,
  onDelete,
}: ManageCardSectionProps) {
  return (
    <div className="rounded-2xl bg-[var(--surface)] p-5">
      <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--textSecondary)]">
        Manage card
      </h2>
      <ul className="mt-4 flex flex-col gap-0" role="list">
        <li>
          <button
            type="button"
            onClick={onWithdraw}
            className="flex w-full items-center gap-4 rounded-xl px-2 py-3 text-left transition hover:bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-[var(--border)] focus:ring-inset"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--background)] text-[var(--text)]">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2v14" />
                <path d="M17 8H7a5 5 0 0 0 0 10h10a5 5 0 0 0 0-10" />
                <path d="m7 13 3 3 3-3" />
              </svg>
            </span>
            <span className="flex-1 font-medium text-[var(--text)]">
              Withdraw funds
            </span>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 text-[var(--textSecondary)]">
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
        </li>
        <li>
          <button
            type="button"
            onClick={onStatement}
            className="flex w-full items-center gap-4 rounded-xl px-2 py-3 text-left transition hover:bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-[var(--border)] focus:ring-inset"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--background)] text-[var(--text)]">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" x2="8" y1="13" y2="13" />
                <line x1="16" x2="8" y1="17" y2="17" />
                <line x1="10" x2="8" y1="9" y2="9" />
              </svg>
            </span>
            <span className="flex-1 font-medium text-[var(--text)]">
              Card statement
            </span>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 text-[var(--textSecondary)]">
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
        </li>
        <li>
          <button
            type="button"
            onClick={onDelete}
            className="flex w-full items-center gap-4 rounded-xl px-2 py-3 text-left transition hover:bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-[var(--border)] focus:ring-inset"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--background)] text-[var(--error)]">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 6h18" />
                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                <line x1="10" x2="10" y1="11" y2="17" />
                <line x1="14" x2="14" y1="11" y2="17" />
              </svg>
            </span>
            <span className="flex-1 font-medium text-[var(--error)]">
              Delete this card
            </span>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 text-[var(--textSecondary)]">
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
        </li>
      </ul>
    </div>
  );
}
