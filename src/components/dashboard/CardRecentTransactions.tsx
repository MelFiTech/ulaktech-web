"use client";

import Link from "next/link";

export interface CardTransactionItem {
  id: string;
  date: string;
  merchant: string;
  amount: string;
  status: "Completed" | "Pending" | "Failed";
}

const MOCK_CARD_TRANSACTIONS: CardTransactionItem[] = [];

export function CardRecentTransactions({
  transactions = MOCK_CARD_TRANSACTIONS,
  balanceVisible = true,
}: {
  transactions?: CardTransactionItem[];
  balanceVisible?: boolean;
}) {
  const displayAmount = (amount: string) => (balanceVisible ? amount : "••••••");

  return (
    <section>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-[var(--text)]">
          Recent transactions
        </h2>
        <Link
          href="/dashboard/transactions"
          className="text-sm font-medium text-[var(--tint)] hover:underline"
        >
          See all
        </Link>
      </div>
      <div className="mt-4 overflow-x-auto rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
        <table className="w-full min-w-[400px] text-left text-sm">
          <thead>
            <tr className="border-b border-[var(--border)] bg-[var(--background)]">
              <th className="px-4 py-3 font-medium uppercase tracking-wider text-[var(--textSecondary)]">
                Date
              </th>
              <th className="px-4 py-3 font-medium uppercase tracking-wider text-[var(--textSecondary)]">
                Merchant
              </th>
              <th className="px-4 py-3 font-medium uppercase tracking-wider text-[var(--textSecondary)]">
                Amount
              </th>
              <th className="px-4 py-3 font-medium uppercase tracking-wider text-[var(--textSecondary)]">
                Status
              </th>
              <th className="w-8 px-4 py-3" aria-hidden />
            </tr>
          </thead>
          <tbody>
            {transactions.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-8 text-center text-sm text-[var(--textSecondary)]"
                >
                  No transactions yet
                </td>
              </tr>
            ) : (
              transactions.map((tx) => (
                <tr
                  key={tx.id}
                  className="border-b border-[var(--border)] transition hover:bg-[var(--text)]/[0.02] last:border-0"
                >
                  <td className="px-4 py-3 text-[var(--textSecondary)]">
                    {tx.date}
                  </td>
                  <td className="px-4 py-3 text-[var(--text)]">{tx.merchant}</td>
                  <td className="px-4 py-3 font-medium text-[var(--text)]">
                    {displayAmount(tx.amount)}
                  </td>
                  <td className="px-4 py-3 text-[var(--textSecondary)]">
                    {tx.status}
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/dashboard/transactions/${tx.id}`}
                      className="text-[var(--textSecondary)] hover:text-[var(--tint)]"
                      aria-label={`View transaction ${tx.id}`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="m9 18 6-6-6-6" />
                      </svg>
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
