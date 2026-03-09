"use client";

import { useState } from "react";
import { SecuritySettingsContent } from "./SecuritySettingsContent";
import { TransactionLimitsContent } from "./TransactionLimitsContent";
import { AccountVerificationContent } from "./AccountVerificationContent";
import { NotificationsContent } from "./NotificationsContent";
import { DevelopersContent } from "./DevelopersContent";

export type SettingsSectionId = "security" | "limits" | "verification" | "notifications" | "developers";

const SETTINGS_SECTIONS: { id: SettingsSectionId; label: string }[] = [
  { id: "security", label: "Security" },
  { id: "limits", label: "Transaction Limits" },
  { id: "verification", label: "Account Verification" },
  { id: "notifications", label: "Notifications" },
  { id: "developers", label: "Developers" },
];

export function AccountSettingsTab() {
  const [section, setSection] = useState<SettingsSectionId>("security");

  return (
    <div className="pt-6">
      {/* Inner tabs for settings sections */}
      <div
        className="flex flex-wrap gap-0 border-b border-[var(--border)]"
        role="tablist"
        aria-label="Settings sections"
      >
        {SETTINGS_SECTIONS.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={section === id}
            onClick={() => setSection(id)}
            className={`rounded-t-lg px-4 py-3 text-sm font-medium transition ${
              section === id
                ? "border-b-2 border-[var(--tint)] bg-[var(--background)] text-[var(--text)]"
                : "text-[var(--textSecondary)] hover:bg-[var(--text)]/5 hover:text-[var(--text)]"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {section === "security" && <SecuritySettingsContent />}
        {section === "limits" && <TransactionLimitsContent />}
        {section === "verification" && <AccountVerificationContent />}
        {section === "notifications" && <NotificationsContent />}
        {section === "developers" && <DevelopersContent />}
      </div>
    </div>
  );
}
