"use client";

import Link from "next/link";
import { useTheme } from "@/contexts/ThemeContext";
import { useDashboardUser } from "@/contexts/DashboardUserContext";
import { BottomNav } from "./BottomNav";
import { Sidebar } from "./Sidebar";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { theme, toggleTheme } = useTheme();
  const { user } = useDashboardUser();
  const initial = user.userName ? user.userName.trim().charAt(0).toUpperCase() : "U";

  return (
    <div className="flex h-screen max-h-screen overflow-hidden bg-[var(--background)]">
      <Sidebar />
      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <header className="z-30 flex h-14 shrink-0 items-center justify-between gap-3 border-b border-[var(--border)] bg-[var(--surface)] px-4 lg:hidden">
          <Link href="/dashboard" className="text-xl font-bold text-[var(--text)] shrink-0">
            Ulaktech
          </Link>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={toggleTheme}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--text)] transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[var(--border)] focus:ring-offset-2 focus:ring-offset-[var(--surface)]"
              aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            >
              {theme === "dark" ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
                </svg>
              )}
            </button>
            <Link
              href="/dashboard/profile"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[var(--border)] focus:ring-offset-2 focus:ring-offset-[var(--surface)]"
              aria-label="Profile"
            >
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt=""
                  className="h-8 w-8 rounded-full object-cover"
                />
              ) : (
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--tint)]/20 text-sm font-semibold text-[var(--tint)]">
                  {initial}
                </span>
              )}
            </Link>
          </div>
        </header>
        <main className="min-h-0 flex-1 overflow-auto p-4 pb-24 md:p-6 lg:p-8 lg:pb-8">
          {children}
        </main>
      </div>
      <BottomNav />
    </div>
  );
}
