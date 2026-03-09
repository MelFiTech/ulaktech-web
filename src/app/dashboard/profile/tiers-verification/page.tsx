"use client";

import Link from "next/link";
import { ProfileSubPageHeader } from "@/components/dashboard/profile/ProfileSubPageHeader";
import { Button } from "@/components/ui/Button";

const TIERS = [
  { id: "1", name: "Tier 1", status: "verified" as const, description: "Basic limits" },
  { id: "2", name: "Tier 2", status: "verified" as const, description: "Higher limits" },
  { id: "3", name: "Tier 3", status: "pending" as const, description: "Full access" },
];

export default function TiersVerificationPage() {
  const nextTier = TIERS.find((t) => t.status === "pending");
  const allVerified = !nextTier;

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <ProfileSubPageHeader title="Tiers & Verification" />

      <div className="space-y-4">
        {TIERS.map((tier) => (
          <div
            key={tier.id}
            className="flex items-center justify-between rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4"
          >
            <div>
              <p className="font-semibold text-[var(--text)]">{tier.name}</p>
              <p className="text-sm text-[var(--textSecondary)]">{tier.description}</p>
            </div>
            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                tier.status === "verified"
                  ? "bg-[var(--success)]/20 text-[var(--success)]"
                  : "bg-[var(--warning)]/20 text-[var(--warning)]"
              }`}
            >
              {tier.status === "verified" ? "Verified" : "Pending"}
            </span>
          </div>
        ))}
      </div>

      <div className="flex justify-center pt-4">
        {allVerified ? (
          <Button variant="outline" disabled className="min-w-[200px]">
            Fully upgraded
          </Button>
        ) : (
          <Link href="/dashboard/profile">
            <Button className="min-w-[200px]">
              Upgrade to {nextTier?.name}
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}
