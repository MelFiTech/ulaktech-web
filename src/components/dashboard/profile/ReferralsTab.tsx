"use client";

import { useState } from "react";

interface ReferralRow {
  id: string;
  fullName: string;
  registrationDate: string;
  amountEarned: string;
}

interface ReferralsTabProps {
  referralCode?: string;
  numberOfReferrals?: number;
  activeUsers?: number;
  totalEarnings?: string;
  referrals?: ReferralRow[];
}

export function ReferralsTab({
  referralCode = "SDA3NJ",
  numberOfReferrals = 1,
  activeUsers = 1,
  totalEarnings = "₦0.00",
  referrals = [
    {
      id: "1",
      fullName: "Daniel",
      registrationDate: "Aug 28, 2023, 15:12",
      amountEarned: "₦0.00",
    },
  ],
}: ReferralsTabProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 pt-6">
      {/* Refer a friend card */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0 flex-1">
            <h3 className="text-lg font-bold text-[var(--text)] sm:text-xl">
              Refer a friend and earn ₦500
            </h3>
            <p className="mt-2 text-sm text-[var(--textSecondary)]">
              Share your referral code and get ₦500 when whoever you refer signs up
              and receives over ₦500 before their foreign account.
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-2 rounded-xl border-2 border-[var(--success)]/50 bg-[var(--success)]/10 px-4 py-2.5 text-sm font-semibold text-[var(--text)] transition hover:bg-[var(--success)]/20"
              >
                <span className="font-mono">{referralCode}</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                  <path d="M4 16V4a2 2 0 0 1 2-2h12" />
                </svg>
              </button>
              <span className="text-xs text-[var(--textSecondary)]">
                {copied ? "Copied!" : "Copy code"}
              </span>
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-2.5 text-sm font-medium text-[var(--text)] transition hover:bg-[var(--text)]/5"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                Share to Twitter
              </button>
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-2.5 text-sm font-medium text-[var(--text)] transition hover:bg-[var(--text)]/5"
              >
                <span className="flex h-5 w-5 items-center justify-center rounded bg-[#1877F2] text-[10px] font-bold text-white">
                  f
                </span>
                Share to Facebook
              </button>
            </div>
          </div>
          <div
            className="hidden h-24 w-24 shrink-0 rounded-xl bg-gradient-to-br from-[var(--tint)]/20 to-[var(--accent)]/20 sm:block"
            aria-hidden
          />
        </div>
      </div>

      {/* Referral stats and table */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <div className="mb-6 grid grid-cols-3 gap-4">
          <div className="text-center sm:text-left">
            <div className="flex items-center justify-center gap-2 sm:justify-start">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-[var(--textSecondary)]"
              >
                <path d="M22 2 11 13" />
                <path d="M22 2 15 22 11 13 2 9 22 2" />
              </svg>
              <span className="text-xs font-medium uppercase tracking-wider text-[var(--textSecondary)]">
                No. of referrals
              </span>
            </div>
            <p className="mt-1 text-xl font-bold text-[var(--text)]">
              {numberOfReferrals}
            </p>
          </div>
          <div className="text-center sm:text-left">
            <div className="flex items-center justify-center gap-2 sm:justify-start">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-[var(--textSecondary)]"
              >
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <span className="text-xs font-medium uppercase tracking-wider text-[var(--textSecondary)]">
                Active users
              </span>
            </div>
            <p className="mt-1 text-xl font-bold text-[var(--text)]">
              {activeUsers}
            </p>
          </div>
          <div className="text-center sm:text-left">
            <div className="flex items-center justify-center gap-2 sm:justify-start">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-[var(--textSecondary)]"
              >
                <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1" />
                <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4" />
              </svg>
              <span className="text-xs font-medium uppercase tracking-wider text-[var(--textSecondary)]">
                Total earnings
              </span>
            </div>
            <p className="mt-1 text-xl font-bold text-[var(--text)]">
              {totalEarnings}
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[400px] text-left text-sm">
            <thead>
              <tr className="border-b border-[var(--border)]">
                <th className="pb-3 font-medium uppercase tracking-wider text-[var(--textSecondary)]">
                  Full name
                </th>
                <th className="pb-3 font-medium uppercase tracking-wider text-[var(--textSecondary)]">
                  Registration date
                </th>
                <th className="pb-3 font-medium uppercase tracking-wider text-[var(--textSecondary)]">
                  Amount earned
                </th>
              </tr>
            </thead>
            <tbody>
              {referrals.length === 0 ? (
                <tr>
                  <td
                    colSpan={3}
                    className="py-8 text-center text-[var(--textSecondary)]"
                  >
                    No referrals yet
                  </td>
                </tr>
              ) : (
                referrals.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b border-[var(--border)] last:border-0"
                  >
                    <td className="py-3 font-medium text-[var(--text)]">
                      {row.fullName}
                    </td>
                    <td className="py-3 text-[var(--textSecondary)]">
                      {row.registrationDate}
                    </td>
                    <td className="py-3 font-medium text-[var(--text)]">
                      {row.amountEarned}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
