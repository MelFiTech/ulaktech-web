"use client";

import { useState } from "react";
import { ProfileSubPageHeader } from "@/components/dashboard/profile/ProfileSubPageHeader";
import { useToast } from "@/components/ui/Toast";

const REFERRAL_CODE = "SDA3NJ";
const REFERRAL_LINK = `https://ulaktech.com/invite/${REFERRAL_CODE}`;
const MOCK_REFERRALS: { id: string; fullName: string; registrationDate: string; amountEarned: string }[] = [];

export default function ReferralsPage() {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(REFERRAL_LINK);
    setCopied(true);
    toast("Link copied.", "success");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareInvite = () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      navigator.share({
        title: "Join Ulaktech",
        text: `Use my referral code ${REFERRAL_CODE} to sign up.`,
        url: REFERRAL_LINK,
      }).then(() => toast("Invite shared.", "success")).catch(() => toast("Share cancelled or failed.", "info"));
    } else {
      navigator.clipboard.writeText(REFERRAL_LINK);
      toast("Link copied. Share it manually.", "success");
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <ProfileSubPageHeader title="Referrals" />

      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <h2 className="text-lg font-bold text-[var(--text)]">Refer a friend and earn ₦500</h2>
        <p className="mt-2 text-sm text-[var(--textSecondary)]">
          Share your referral code and get ₦500 when whoever you refer signs up and receives over ₦500 before their foreign account.
        </p>
        <div className="mt-4 flex items-center gap-2">
          <span className="font-mono text-sm font-medium text-[var(--text)]">{REFERRAL_CODE}</span>
          <span className="text-xs text-[var(--textSecondary)]">(code)</span>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={handleCopyLink}
            className="rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm font-medium text-[var(--text)] transition hover:bg-[var(--text)]/5"
          >
            Copy link
          </button>
          <button
            type="button"
            onClick={handleShareInvite}
            className="rounded-xl border border-[var(--tint)]/50 bg-[var(--tint)]/10 px-4 py-3 text-sm font-medium text-[var(--tint)] transition hover:bg-[var(--tint)]/20"
          >
            Share invite
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-[var(--textSecondary)]">
          Referred friends
        </h3>
        {MOCK_REFERRALS.length === 0 ? (
          <p className="mt-4 text-sm text-[var(--textSecondary)]">No referrals yet.</p>
        ) : (
          <ul className="mt-4 divide-y divide-[var(--border)]">
            {MOCK_REFERRALS.map((row) => (
              <li key={row.id} className="flex items-center justify-between py-3 first:pt-0">
                <div>
                  <p className="font-medium text-[var(--text)]">{row.fullName}</p>
                  <p className="text-xs text-[var(--textSecondary)]">{row.registrationDate}</p>
                </div>
                <span className="font-medium text-[var(--text)]">{row.amountEarned}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
