/**
 * In-memory cache for wallet and transactions to avoid calling the backend every time.
 * TTL: wallet & list = 90s, single transaction = 5min.
 * Invalidate after write (e.g. transfer) so next read gets fresh data.
 */

const WALLET_TTL_MS = 90 * 1000;
const TRANSACTIONS_LIST_TTL_MS = 90 * 1000;
const TRANSACTION_DETAIL_TTL_MS = 5 * 60 * 1000;

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

const walletCache = new Map<string, CacheEntry<unknown>>();

/** Last known balance (raw string) for display when returning to home. Not cleared on invalidate. */
let lastKnownBalance: string | null = null;

export function getLastKnownBalance(): string | null {
  return lastKnownBalance;
}

export function setLastKnownBalance(balance: string): void {
  lastKnownBalance = balance;
}

function isExpired(entry: CacheEntry<unknown>): boolean {
  return Date.now() > entry.expiresAt;
}

function transactionsKey(params: Record<string, unknown> | undefined): string {
  if (!params || Object.keys(params).length === 0) return "transactions:{}";
  const normalized = {
    page: params.page ?? 1,
    limit: params.limit,
    type: params.type,
    category: params.category,
    source: params.source,
  };
  return "transactions:" + JSON.stringify(normalized);
}

export function getCachedWallet(): unknown | null {
  const entry = walletCache.get("wallet") as CacheEntry<unknown> | undefined;
  if (!entry || isExpired(entry)) return null;
  return entry.data;
}

export function setCachedWallet(data: unknown): void {
  walletCache.set("wallet", { data, expiresAt: Date.now() + WALLET_TTL_MS });
}

export function getCachedTransactions(params: Record<string, unknown> | undefined): unknown | null {
  const key = transactionsKey(params);
  const entry = walletCache.get(key) as CacheEntry<unknown> | undefined;
  if (!entry || isExpired(entry)) return null;
  return entry.data;
}

export function setCachedTransactions(params: Record<string, unknown> | undefined, data: unknown): void {
  const key = transactionsKey(params);
  walletCache.set(key, { data, expiresAt: Date.now() + TRANSACTIONS_LIST_TTL_MS });
}

export function getCachedTransaction(id: string): unknown | null {
  const key = "transaction:" + id;
  const entry = walletCache.get(key) as CacheEntry<unknown> | undefined;
  if (!entry || isExpired(entry)) return null;
  return entry.data;
}

export function setCachedTransaction(id: string, data: unknown): void {
  const key = "transaction:" + id;
  walletCache.set(key, { data, expiresAt: Date.now() + TRANSACTION_DETAIL_TTL_MS });
}

/** Call after transfer or any write so next read refetches. Keeps lastKnownBalance so UI can show it until refetch. */
export function invalidateWalletCache(): void {
  walletCache.clear();
}
