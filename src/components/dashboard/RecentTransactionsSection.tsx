"use client";

import Link from "next/link";
import type { WalletTransaction } from "@/lib/api/wallet";
import { formatTransactionDateList } from "@/lib/formatTransactionDate";
import { inferNetworkFromDescription } from "@/components/dashboard/modals/constants";
import { TransactionItem, type TransactionItemProps } from "@/components/dashboard/TransactionItem";

const RECENT_LIMIT = 3;
const AMOUNT_MASK = "••••••";

function toItemProps(tx: WalletTransaction, balanceVisible: boolean): TransactionItemProps {
  const dateStr = tx.createdAt ? formatTransactionDateList(tx.createdAt) : formatTransactionDateList(tx.date);
  const network =
    tx.network ??
    (["airtime", "data", "airtime to cash"].some((k) => tx.title?.toLowerCase().includes(k))
      ? inferNetworkFromDescription(tx.description)
      : null);
  return {
    id: tx.id,
    type: tx.type,
    title: tx.title,
    description: tx.description ?? undefined,
    date: dateStr,
    amountDisplay: balanceVisible ? tx.amount : AMOUNT_MASK,
    balanceVisible,
    network: network ?? undefined,
    detailHref: `/dashboard/history/${tx.id}`,
  };
}

export function RecentTransactionsSection({
  transactions = [],
  balanceVisible = true,
}: {
  transactions?: WalletTransaction[];
  balanceVisible?: boolean;
}) {
  const displayList = (transactions ?? []).slice(0, RECENT_LIMIT);

  return (
    <section>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-[var(--text)]">Recent transactions</h2>
        <Link
          href="/dashboard/history"
          className="text-sm font-medium text-[var(--tint)] hover:underline"
        >
          See all
        </Link>
      </div>
      <div className="mt-4 flex flex-col gap-3">
        {displayList.length === 0 ? (
          <p className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-6 text-center text-sm text-[var(--textSecondary)]">
            No recent transactions
          </p>
        ) : (
          displayList.map((tx) => (
            <TransactionItem
              key={tx.id}
              tx={toItemProps(tx, balanceVisible)}
              detailHref={`/dashboard/history/${tx.id}`}
            />
          ))
        )}
      </div>
    </section>
  );
}
