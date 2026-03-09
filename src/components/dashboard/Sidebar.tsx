"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useState } from "react";

const PAY_SUB_ITEMS = [
  { href: "/dashboard?pay=data", label: "Data" },
  { href: "/dashboard?pay=airtime", label: "Airtime" },
  { href: "/dashboard?pay=electricity", label: "Electricity" },
  { href: "/dashboard?pay=tv", label: "TV" },
  { href: "/dashboard?pay=betting", label: "Betting" },
  { label: "Exam PIN", comingSoon: true as const },
] as const;

const NAV_ITEMS = [
  { href: "/dashboard", label: "Home", icon: "home" },
  { href: "/dashboard/history", label: "History", icon: "list" },
  { label: "Pay", icon: "pay", hasSub: true },
  { href: "/dashboard/cards", label: "Cards", icon: "credit-card" },
  { href: "/dashboard/profile", label: "Profile", icon: "profile" },
] as const;

const ICONS: Record<string, React.ReactNode> = {
  home: (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  ),
  list: (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="8" x2="21" y1="6" y2="6" />
      <line x1="8" x2="21" y1="12" y2="12" />
      <line x1="8" x2="21" y1="18" y2="18" />
      <line x1="3" x2="3.01" y1="6" y2="6" />
      <line x1="3" x2="3.01" y1="12" y2="12" />
      <line x1="3" x2="3.01" y1="18" y2="18" />
    </svg>
  ),
  pay: (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 512 512" fill="none" stroke="currentColor" strokeWidth="32" strokeLinecap="round" strokeLinejoin="round">
      <path d="M416 221.25V416a48 48 0 0 1-48 48H144a48 48 0 0 1-48-48V96a48 48 0 0 1 48-48h98.75a32 32 0 0 1 22.62 9.37l141.26 141.26a32 32 0 0 1 9.37 22.62Z" />
      <path d="M256 56v120a32 32 0 0 0 32 32h120m-232 80h160m-160 80h160" />
    </svg>
  ),
  "credit-card": (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="14" x="2" y="5" rx="2" />
      <line x1="2" x2="22" y1="10" y2="10" />
    </svg>
  ),
  profile: (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="5" />
      <path d="M20 21a8 8 0 0 0-16 0" />
    </svg>
  ),
};

export function Sidebar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [payOpen, setPayOpen] = useState(false);
  const payParam = searchParams.get("pay");
  const isPayActive = pathname === "/dashboard" && !!payParam && payParam !== "exam-pin";

  return (
    <aside className="hidden h-screen w-[240px] shrink-0 flex-col overflow-hidden border-r border-[var(--border)] bg-[var(--surface)] lg:flex">
      <div className="flex h-16 shrink-0 items-center px-6">
        <Link href="/dashboard" className="text-xl font-bold text-[var(--text)]">
          Ulaktech
        </Link>
      </div>
      <nav className="flex min-h-0 flex-1 flex-col gap-0.5 overflow-y-auto px-3 py-4" aria-label="Dashboard">
        {NAV_ITEMS.map((item) => {
          if ("hasSub" in item && item.hasSub) {
            return (
              <div key={item.label}>
                <button
                  type="button"
                  onClick={() => setPayOpen((o) => !o)}
                  className={`flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition ${
                    isPayActive
                      ? "bg-[var(--tint)]/10 text-[var(--tint)]"
                      : "text-[var(--textSecondary)] hover:bg-[var(--text)]/5 hover:text-[var(--text)]"
                  }`}
                  aria-expanded={payOpen}
                  aria-controls="pay-subnav"
                >
                  <span className="flex items-center gap-3">
                    <span className={`shrink-0 ${isPayActive ? "text-[var(--tint)]" : "text-[var(--textSecondary)]"}`}>
                      {ICONS[item.icon]}
                    </span>
                    {item.label}
                  </span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className={`shrink-0 transition-transform ${payOpen ? "rotate-180" : ""}`}
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </button>
                <div
                  id="pay-subnav"
                  className={`overflow-hidden transition-all ${payOpen ? "max-h-[320px] opacity-100" : "max-h-0 opacity-0"}`}
                >
                  <div className="flex flex-col gap-0.5 py-1 pl-6">
                    {PAY_SUB_ITEMS.map((item) => {
                      if ("comingSoon" in item && item.comingSoon) {
                        return (
                          <div
                            key={item.label}
                            className="flex cursor-not-allowed items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm text-[var(--textSecondary)] opacity-80"
                          >
                            <span>{item.label}</span>
                            <span className="rounded-full bg-[var(--textSecondary)]/20 px-2 py-0.5 text-[10px] font-medium text-[var(--textSecondary)]">
                              Coming soon
                            </span>
                          </div>
                        );
                      }
                      if ("href" in item) {
                        const { href, label } = item;
                        const isSubActive = pathname === "/dashboard" && payParam === href.replace("/dashboard?pay=", "");
                        return (
                          <Link
                            key={href}
                            href={href}
                            className={`rounded-lg px-3 py-2 text-sm transition ${
                              isSubActive
                                ? "font-medium text-[var(--tint)] bg-[var(--tint)]/10"
                                : "text-[var(--textSecondary)] hover:bg-[var(--text)]/5 hover:text-[var(--text)]"
                            }`}
                          >
                            {label}
                          </Link>
                        );
                      }
                      return null;
                    })}
                  </div>
                </div>
              </div>
            );
          }
          if (!("href" in item)) return null;
          const href = item.href;
          const isActive = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                isActive
                  ? "bg-[var(--tint)]/10 text-[var(--tint)]"
                  : "text-[var(--textSecondary)] hover:bg-[var(--text)]/5 hover:text-[var(--text)]"
              }`}
            >
              <span className={`shrink-0 ${isActive ? "text-[var(--tint)]" : "text-[var(--textSecondary)]"}`}>
                {ICONS[item.icon]}
              </span>
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-4">
        <div className="rounded-xl bg-gradient-to-br from-[#0B0B0B] to-[#1a1a1f] p-4 text-white">
          <p className="text-sm font-semibold">Spread the word and earn</p>
          <p className="mt-1 text-xs text-white/80">Refer friends and get rewarded.</p>
          <Link
            href="/dashboard/profile/referrals"
            className="mt-3 inline-block text-xs font-medium text-[#F5BE47] hover:underline"
          >
            Get referral link →
          </Link>
        </div>
      </div>
    </aside>
  );
}
