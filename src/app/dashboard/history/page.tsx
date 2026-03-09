"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { HistoryPageHeader } from "@/components/dashboard";
import { TransactionItem, type TransactionItemProps } from "@/components/dashboard/TransactionItem";
import { useProfilePrefs } from "@/contexts/ProfilePrefsContext";
import {
  filterTransactions,
  walletOnly,
  sumCredits,
  sumDebits,
  formatAmount,
  mapWalletToHistory,
  type HistoryTransaction,
  type HistoryFilterId,
  HISTORY_FILTERS,
} from "./data";
import { listTransactions, invalidateWalletCache } from "@/lib/api/wallet";

const AMOUNT_MASK = "••••••";

const FILTER_LABELS: Record<HistoryFilterId, string> = {
  all: "All",
  card: "Card",
  credits: "Credits",
  debits: "Debits",
  airtime: "Airtime",
  data: "Data",
  transfer: "Transfer",
};

function historyToItemProps(tx: HistoryTransaction, balanceVisible: boolean): TransactionItemProps {
  return {
    id: tx.id,
    type: tx.type,
    title: tx.title,
    description: tx.description || undefined,
    date: tx.date,
    amountDisplay: balanceVisible ? formatAmount(tx.amount, tx.type) : AMOUNT_MASK,
    balanceVisible,
    network: tx.network ?? undefined,
    detailHref: `/dashboard/history/${tx.id}`,
  };
}

export default function HistoryPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { balanceVisible } = useProfilePrefs();

  const [search, setSearch] = useState("");
  const urlFilter = searchParams.get("filter") ?? "all";
  const initialFilter: HistoryFilterId = HISTORY_FILTERS.includes(urlFilter as HistoryFilterId) ? (urlFilter as HistoryFilterId) : "all";
  const [filter, setFilter] = useState<HistoryFilterId>(initialFilter);

  useEffect(() => {
    const f = searchParams.get("filter") ?? "all";
    if (HISTORY_FILTERS.includes(f as HistoryFilterId)) setFilter(f as HistoryFilterId);
  }, [searchParams]);
  const [transactions, setTransactions] = useState<HistoryTransaction[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    try {
      const res = await listTransactions({ page: 1, limit: 100 });
      const list = (res?.transactions ?? []).map(mapWalletToHistory);
      setTransactions(list);
    } catch {
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const updateFilter = useCallback(
    (next: HistoryFilterId) => {
      setFilter(next);
      const url = new URL(window.location.href);
      url.searchParams.set("filter", next);
      router.replace(url.pathname + url.search, { scroll: false });
    },
    [router]
  );

  const filteredList = useMemo(
    () => filterTransactions(transactions, filter, search),
    [transactions, filter, search]
  );

  const walletTx = useMemo(() => walletOnly(transactions), [transactions]);
  const totalCredits = useMemo(() => sumCredits(walletTx), [walletTx]);
  const totalDebits = useMemo(() => sumDebits(walletTx), [walletTx]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    invalidateWalletCache();
    try {
      const res = await listTransactions({ page: 1, limit: 100 });
      const list = (res?.transactions ?? []).map(mapWalletToHistory);
      setTransactions(list);
    } catch {
      // keep previous
    } finally {
      setRefreshing(false);
    }
  }, []);

  return (
    <div className="flex min-h-full flex-col bg-[var(--background)]">
      <HistoryPageHeader />

      <div className="mt-6 space-y-6">
        {/* Search */}
        <div className="relative">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--textSecondary)]" aria-hidden>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </span>
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search transactions"
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] py-3 pl-10 pr-10 text-[var(--text)] placeholder:text-[var(--textSecondary)]"
            aria-label="Search transactions"
          />
          {search.length > 0 && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-[var(--textSecondary)] transition hover:bg-[var(--border)] hover:text-[var(--text)]"
              aria-label="Clear search"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Metric cards */}
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
            <p className="text-xs font-medium uppercase tracking-wider text-[var(--textSecondary)]">
              Total credits
            </p>
            <p className="mt-1 text-lg font-bold text-[var(--success)]">
              {balanceVisible ? `+₦${totalCredits.toLocaleString("en-NG", { minimumFractionDigits: 2 })}` : AMOUNT_MASK}
            </p>
          </div>
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
            <p className="text-xs font-medium uppercase tracking-wider text-[var(--textSecondary)]">
              Total debits
            </p>
            <p className="mt-1 text-lg font-bold text-[var(--tint)]">
              {balanceVisible ? `-₦${totalDebits.toLocaleString("en-NG", { minimumFractionDigits: 2 })}` : AMOUNT_MASK}
            </p>
          </div>
        </div>

        {/* Filter strip */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {HISTORY_FILTERS.map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => updateFilter(id)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition ${
                filter === id
                  ? "bg-[var(--tint)] text-white"
                  : "bg-[var(--surface)] text-[var(--textSecondary)] border border-[var(--border)] hover:text-[var(--text)]"
              }`}
            >
              {FILTER_LABELS[id]}
            </button>
          ))}
        </div>

        {/* Transaction list + pull-to-refresh */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--textSecondary)]">
              Transactions
            </h2>
            <button
              type="button"
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm font-medium text-[var(--text)] transition hover:opacity-90 disabled:opacity-50"
              aria-label="Refresh"
            >
              {refreshing ? (
                <span className="h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-[var(--border)] border-t-[var(--tint)]" aria-hidden />
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                  <path d="M3 3v5h5" />
                  <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
                  <path d="M16 21h5v-5" />
                </svg>
              )}
              {refreshing ? "Refreshing..." : "Refresh"}
            </button>
          </div>

          {loading ? (
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-6 py-12 text-center">
              <p className="text-[var(--textSecondary)]">Loading transactions...</p>
            </div>
          ) : filteredList.length === 0 ? (
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-6 py-12 text-center">
              <p className="text-[var(--textSecondary)]">
                {search.trim() ? "No transactions match your search." : "No transactions yet."}
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {filteredList.map((tx) => (
                <TransactionItem
                  key={tx.id}
                  tx={historyToItemProps(tx, balanceVisible)}
                  detailHref={`/dashboard/history/${tx.id}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
