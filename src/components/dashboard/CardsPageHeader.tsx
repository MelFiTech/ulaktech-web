"use client";

import Link from "next/link";
import { useTheme } from "@/contexts/ThemeContext";

export function CardsPageHeader() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-center gap-3">
        <Link
          href="/dashboard"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[var(--textSecondary)] transition hover:bg-[var(--background)] hover:text-[var(--text)]"
          aria-label="Back to dashboard"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6" />
          </svg>
        </Link>
        <h1 className="text-xl font-bold text-[var(--text)] sm:text-2xl">
          Cards
        </h1>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-2 sm:mt-0 sm:gap-3">
        <button
          type="button"
          className="hidden items-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--textSecondary)] transition hover:border-[var(--border)] hover:text-[var(--text)] sm:flex"
        >
          English (US)
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>
        <button
          type="button"
          onClick={toggleTheme}
          className="hidden rounded-lg border border-[var(--border)] bg-[var(--surface)] p-2 text-[var(--text)] transition hover:opacity-90 lg:block"
          aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
        >
          {theme === "dark" ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2" />
              <path d="M12 20v2" />
              <path d="m4.93 4.93 1.41 1.41" />
              <path d="m17.66 17.66 1.41 1.41" />
              <path d="M2 12h2" />
              <path d="M20 12h2" />
              <path d="m6.34 17.66-1.41 1.41" />
              <path d="m19.07 4.93-1.41 1.41" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
            </svg>
          )}
        </button>
        <Link
          href="/dashboard"
          className="hidden h-[54px] shrink-0 items-center justify-center whitespace-nowrap rounded-[68px] bg-[var(--text)]/10 px-4 text-base font-semibold text-[var(--text)] transition hover:bg-[var(--text)]/15 sm:px-6 lg:inline-flex"
        >
          GO
        </Link>
      </div>
    </header>
  );
}
