"use client";

import Link from "next/link";

interface ProfileSubPageHeaderProps {
  title: string;
  backHref?: string;
}

export function ProfileSubPageHeader({
  title,
  backHref = "/dashboard/profile",
}: ProfileSubPageHeaderProps) {
  return (
    <header className="flex items-center gap-3">
      <Link
        href={backHref}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[var(--textSecondary)] transition hover:bg-[var(--background)] hover:text-[var(--text)]"
        aria-label="Back"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m15 18-6-6 6-6" />
        </svg>
      </Link>
      <h1 className="text-xl font-bold text-[var(--text)] sm:text-2xl">
        {title}
      </h1>
    </header>
  );
}
