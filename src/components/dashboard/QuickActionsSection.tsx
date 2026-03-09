"use client";

import Link from "next/link";

interface QuickActionsSectionProps {
  onAirtimeClick?: () => void;
  onDataClick?: () => void;
  onAirtimeToCashClick?: () => void;
  onMoreClick?: () => void;
}

const ICON_SVGS: Record<string, React.ReactNode> = {
  "cellular-outline": (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 20v-6" />
      <path d="M8 20v-12" />
      <path d="M12 20V8" />
      <path d="M16 20V4" />
      <path d="M20 20v-16" />
    </svg>
  ),
  "wifi-outline": (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12.55a11 11 0 0 1 14.08 0" />
      <path d="M1.42 9a16 16 0 0 1 21.16 0" />
      <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
      <line x1="12" x2="12.01" y1="20" y2="20" />
    </svg>
  ),
  "swap-horizontal-outline": (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m16 3 4 4-4 4" />
      <path d="M20 7H4" />
      <path d="m8 21-4-4 4-4" />
      <path d="M4 17h16" />
    </svg>
  ),
  "file-tray-full-outline": (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
      <path d="M8 13h2" />
      <path d="M8 17h2" />
      <path d="M16 13h2" />
      <path d="M16 17h2" />
    </svg>
  ),
};

const ACTIONS = [
  { id: "1", icon: "cellular-outline", label: "Data", color: "#38BFF7", pill: "Hot deals", href: "/dashboard/pay/data", actionKey: "data" as const },
  { id: "2", icon: "wifi-outline", label: "Airtime", color: "#3FC242", href: "/dashboard/pay/airtime", actionKey: "airtime" as const },
  { id: "3", icon: "swap-horizontal-outline", label: "Airtime to cash", color: "#F79F3F", href: "/dashboard/pay/airtime-to-cash", actionKey: "airtimeToCash" as const },
  { id: "4", icon: "file-tray-full-outline", label: "More", color: "#7D53F7", href: "/dashboard/pay", actionKey: "more" as const },
];

export function QuickActionsSection({ onAirtimeClick, onDataClick, onAirtimeToCashClick, onMoreClick }: QuickActionsSectionProps = {}) {
  return (
    <section>
      <h2 className="text-lg font-semibold text-[var(--text)]">Quick Actions</h2>
      <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        {ACTIONS.map(({ id, icon, label, color, pill, href, actionKey }) => {
          const isData = actionKey === "data" && onDataClick;
          const isAirtime = actionKey === "airtime" && onAirtimeClick;
          const isAirtimeToCash = actionKey === "airtimeToCash" && onAirtimeToCashClick;
          const isMore = actionKey === "more" && onMoreClick;
          const useButton = isData || isAirtime || isAirtimeToCash || isMore;
          const content = (
            <>
              {pill && (
                <span className="absolute right-2 top-2 rounded-full bg-[var(--tint)] px-2 py-0.5 text-[10px] font-semibold text-white lg:right-3 lg:top-3 lg:px-2.5 lg:text-xs">
                  {pill}
                </span>
              )}
              <span
                className="flex h-10 w-10 shrink-0 items-center justify-start lg:h-12 lg:w-12"
                style={{ color }}
              >
                {ICON_SVGS[icon]}
              </span>
              <p className="min-w-0 truncate text-sm font-semibold text-[var(--text)] lg:text-base">
                {label}
              </p>
            </>
          );
          return useButton ? (
            <button
              key={id}
              type="button"
              onClick={
                isData
                  ? onDataClick
                  : isAirtime
                    ? onAirtimeClick
                    : isAirtimeToCash
                      ? onAirtimeToCashClick
                      : isMore
                        ? onMoreClick
                        : undefined
              }
              className="relative flex min-w-0 flex-col gap-2 rounded-2xl bg-[var(--surface)] p-3 text-left transition hover:opacity-90 lg:gap-3 lg:p-5 focus:outline-none focus:ring-2 focus:ring-[var(--border)]"
            >
              {content}
            </button>
          ) : (
            <Link
              key={id}
              href={href}
              className="relative flex min-w-0 flex-col gap-2 rounded-2xl bg-[var(--surface)] p-3 text-left transition hover:opacity-90 lg:gap-3 lg:p-5"
            >
              {content}
            </Link>
          );
        })}
      </div>
    </section>
  );
}
