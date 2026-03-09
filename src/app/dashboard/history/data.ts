import type { WalletTransaction } from "@/lib/api/wallet";
import { formatTransactionDateList } from "@/lib/formatTransactionDate";

/**
 * History transaction model for the History screen.
 * type: credit | debit
 * source: wallet (default) | card — metric cards sum wallet only; "Card" filter shows card only; "All" shows both.
 */
export interface HistoryTransaction {
  id: string;
  type: "credit" | "debit";
  title: string;
  description: string;
  amount: number;
  date: string;
  icon?: string;
  iconColor?: string;
  source?: "wallet" | "card";
  network?: string;
}

/** Map API wallet transaction to HistoryTransaction. */
export function mapWalletToHistory(t: WalletTransaction): HistoryTransaction {
  const amountNum = parseFloat(
    (t.amountRaw ?? t.amount.replace(/[^0-9.]/g, "")).trim() || "0"
  );
  const dateStr = t.createdAt
    ? formatTransactionDateList(t.createdAt)
    : formatTransactionDateList(t.date);
  return {
    id: t.id,
    type: t.type,
    title: t.title,
    description: t.description ?? "",
    amount: amountNum,
    date: dateStr,
    source: t.source,
    network: t.network,
  };
}

export const HISTORY_FILTERS = [
  "all",
  "card",
  "credits",
  "debits",
  "airtime",
  "data",
  "transfer",
] as const;

export type HistoryFilterId = (typeof HISTORY_FILTERS)[number];

export const MOCK_HISTORY_TRANSACTIONS: HistoryTransaction[] = [
  { id: "1", type: "debit", title: "Bank transfer", description: "Withdraw to bank", amount: 21894, date: "Mar 03, 2026 18:58", source: "wallet" },
  { id: "2", type: "credit", title: "Card funding", description: "Deposit from card", amount: 24000, date: "Mar 03, 2026 18:55", source: "wallet" },
  { id: "3", type: "debit", title: "Airtime", description: "MTN • 08012345678", amount: 1500, date: "Mar 03, 2026 14:20", source: "wallet", network: "MTN" },
  { id: "4", type: "debit", title: "Data", description: "1GB data bundle", amount: 500, date: "Mar 02, 2026 17:58", source: "wallet", network: "Airtel" },
  { id: "5", type: "credit", title: "Bank transfer", description: "Incoming transfer", amount: 50000, date: "Mar 02, 2026 12:30", source: "wallet" },
  { id: "6", type: "debit", title: "Electricity", description: "EKEDC bill", amount: 2000, date: "Mar 01, 2026 09:15", source: "wallet" },
  { id: "7", type: "debit", title: "TV subscription", description: "DStv package", amount: 3500, date: "Feb 28, 2026 20:00", source: "wallet" },
  { id: "8", type: "debit", title: "Data", description: "2GB data", amount: 800, date: "Feb 28, 2026 11:00", source: "wallet", network: "Glo" },
  { id: "9", type: "credit", title: "Transfer", description: "Received from @user", amount: 10000, date: "Feb 27, 2026 16:00", source: "wallet" },
  { id: "10", type: "debit", title: "Airtime to cash", description: "Converted to wallet", amount: 5000, date: "Feb 27, 2026 10:00", source: "wallet" },
  { id: "11", type: "debit", title: "Card payment", description: "Online purchase", amount: 15000, date: "Feb 26, 2026 14:00", source: "card" },
  { id: "12", type: "credit", title: "Card top-up", description: "Added to card", amount: 25000, date: "Feb 26, 2026 12:00", source: "card" },
];

export function formatAmount(amount: number, type: "credit" | "debit"): string {
  const prefix = type === "credit" ? "+" : "-";
  return `${prefix}₦${amount.toLocaleString("en-NG", { minimumFractionDigits: 2 })}`;
}

function matchesFilter(tx: HistoryTransaction, filter: HistoryFilterId): boolean {
  const titleLower = tx.title.toLowerCase();
  switch (filter) {
    case "all":
      return true;
    case "card":
      return tx.source === "card";
    case "credits":
      return tx.type === "credit";
    case "debits":
      return tx.type === "debit";
    case "airtime":
      return titleLower.includes("airtime");
    case "data":
      return titleLower.includes("data");
    case "transfer":
      return titleLower.includes("transfer");
    default:
      return true;
  }
}

function matchesSearch(tx: HistoryTransaction, query: string): boolean {
  if (!query.trim()) return true;
  const q = query.trim().toLowerCase();
  return tx.title.toLowerCase().includes(q) || tx.description.toLowerCase().includes(q);
}

export function filterTransactions(
  transactions: HistoryTransaction[],
  filter: HistoryFilterId,
  searchQuery: string
): HistoryTransaction[] {
  return transactions.filter((tx) => matchesFilter(tx, filter) && matchesSearch(tx, searchQuery));
}

export function walletOnly(transactions: HistoryTransaction[]): HistoryTransaction[] {
  return transactions.filter((tx) => tx.source !== "card");
}

export function sumCredits(transactions: HistoryTransaction[]): number {
  return transactions.filter((t) => t.type === "credit").reduce((s, t) => s + t.amount, 0);
}

export function sumDebits(transactions: HistoryTransaction[]): number {
  return transactions.filter((t) => t.type === "debit").reduce((s, t) => s + t.amount, 0);
}
