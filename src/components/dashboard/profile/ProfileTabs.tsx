"use client";

export type ProfileTabId = "basic" | "referrals" | "settings";

interface ProfileTabsProps {
  activeTab: ProfileTabId;
  onTabChange: (tab: ProfileTabId) => void;
}

const TABS: { id: ProfileTabId; label: string }[] = [
  { id: "basic", label: "Basic Information" },
  { id: "referrals", label: "Referrals" },
  { id: "settings", label: "Account Settings" },
];

export function ProfileTabs({ activeTab, onTabChange }: ProfileTabsProps) {
  return (
    <div
      className="flex gap-0 border-b border-[var(--border)]"
      role="tablist"
      aria-label="Profile sections"
    >
      {TABS.map(({ id, label }) => (
        <button
          key={id}
          type="button"
          role="tab"
          aria-selected={activeTab === id}
          aria-controls={`panel-${id}`}
          id={`tab-${id}`}
          onClick={() => onTabChange(id)}
          className={`rounded-t-lg px-4 py-3 text-sm font-medium transition ${
            activeTab === id
              ? "border-b-2 border-[var(--tint)] bg-[var(--background)] text-[var(--text)]"
              : "text-[var(--textSecondary)] hover:bg-[var(--text)]/5 hover:text-[var(--text)]"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
