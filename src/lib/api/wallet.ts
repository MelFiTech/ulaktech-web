/**
 * Wallet API – matches ulaktech-backend wallet controller.
 * Base path: /api/wallet. All routes require auth (cookies).
 * Uses in-memory cache (see walletCache) for getWallet, listTransactions, getTransaction.
 * Call invalidateWalletCache() after transfer or other writes so next read refetches.
 */

import { apiFetch } from "./client";
import {
  getCachedWallet,
  setCachedWallet,
  setLastKnownBalance,
  getCachedTransactions,
  setCachedTransactions,
  getCachedTransaction,
  setCachedTransaction,
  invalidateWalletCache,
} from "./walletCache";

export { invalidateWalletCache, getLastKnownBalance } from "./walletCache";

export interface WalletResponse {
  balance: string;
  currency: string;
  accountNumber?: string;
  accountName?: string;
  bankName?: string;
  bankCode?: string;
  username?: string;
}

export async function getWallet(): Promise<WalletResponse> {
  const cached = getCachedWallet() as WalletResponse | null;
  if (cached) {
    if (cached.balance != null) setLastKnownBalance(String(cached.balance));
    return cached;
  }
  const data = await apiFetch<WalletResponse>("api/wallet");
  setCachedWallet(data);
  if (data.balance != null) setLastKnownBalance(String(data.balance));
  return data;
}

/** PATCH /api/wallet – set wallet username (backend: SetUsernameDto, 3–30 chars, alphanumeric + . _). */
export async function setWalletUsername(username: string): Promise<WalletResponse> {
  const data = await apiFetch<WalletResponse>("api/wallet", {
    method: "PATCH",
    body: { username: username.trim() } as unknown as BodyInit,
  });
  invalidateWalletCache();
  if (data.balance != null) setLastKnownBalance(String(data.balance));
  return data;
}

/** GET /api/wallet/networks – airtime/data networks. Backend returns { id, name }[] with id "1".."4" (MTN, Airtel, 9Mobile, Glo). */
export interface NetworkOption {
  id: string;
  name: string;
}

export function getNetworks(): Promise<NetworkOption[]> {
  return apiFetch<NetworkOption[]>("api/wallet/networks");
}

/** GET /api/wallet/data/plans?network=... – data plans for network (id "1".."4" or key mtn, airtel, glo, 9mobile). */
export interface DataPlanOption {
  id: string;
  name: string;
  price: string;
  telco_price: string;
}

export function getDataPlans(network: string): Promise<DataPlanOption[]> {
  const q = network ? `?network=${encodeURIComponent(network)}` : "";
  return apiFetch<DataPlanOption[]>(`api/wallet/data/plans${q}`);
}

/** GET /api/wallet/electricity/resolve?meterNumber=...&billerId=... – validate meter, returns { meterName }. */
export function resolveElectricityMeter(
  meterNumber: string,
  billerId: string
): Promise<{ meterName: string }> {
  const params = new URLSearchParams({
    meterNumber: meterNumber.trim(),
    billerId: billerId.trim(),
  });
  return apiFetch<{ meterName: string }>(`api/wallet/electricity/resolve?${params}`);
}

/** POST /api/wallet/transactions/execute – airtime, data, electricity, tv, betting, etc. */
export type ExecuteTransactionType =
  | "airtime"
  | "data"
  | "tv"
  | "electricity"
  | "betting"
  | "airtimeToCash"
  | "transfer"
  | "withdraw";

export interface ExecuteTransactionBody {
  pin: string;
  transactionType: ExecuteTransactionType;
  amount: string;
  accountNumber?: string;
  accountName?: string;
  bankName?: string;
  network_id?: string;
  bankAccountId?: string;
  bundleId?: string;
  packageId?: string;
  tvBillerId?: string;
  customerName?: string;
  meterNumber?: string;
  billerId?: string;
  description?: string;
  metadata?: Record<string, unknown>;
  [key: string]: string | Record<string, unknown> | undefined;
}

export interface ExecuteTransactionResponse {
  transactionId: string;
  status: "success" | "pending";
  balance?: string;
  token?: string;
  meterName?: string;
  otpRequired?: boolean;
  requestId?: string;
  trackingId?: string;
}

export async function executeTransaction(
  body: ExecuteTransactionBody
): Promise<ExecuteTransactionResponse> {
  const data = await apiFetch<ExecuteTransactionResponse>("api/wallet/transactions/execute", {
    method: "POST",
    body: body as unknown as BodyInit,
  });
  invalidateWalletCache();
  return data;
}

export interface TransferResolveResponse {
  username: string;
  accountName: string;
}

export function transferResolve(username: string): Promise<TransferResolveResponse> {
  return apiFetch<TransferResolveResponse>(
    `api/wallet/transfer/resolve?username=${encodeURIComponent(username)}`
  );
}

export interface TransferBody {
  username: string;
  recipientAccountName: string;
  amount: string;
  pin: string;
}

export interface TransferResponse {
  transactionId?: string;
  amount: string;
  recipientUsername?: string;
  balance?: string;
}

export function transfer(body: TransferBody): Promise<TransferResponse> {
  return apiFetch<TransferResponse>("api/wallet/transfer", {
    method: "POST",
    body: body as unknown as BodyInit,
  });
}

export interface TransferRecentItem {
  id: string;
  username: string;
  accountName?: string;
}

export function transferRecent(): Promise<TransferRecentItem[]> {
  return apiFetch<TransferRecentItem[]>("api/wallet/transfer/recent");
}

/** Banks list for dropdown (add bank account, etc.) */
export interface BankOption {
  id: string;
  name: string;
  code: string;
}

export function getBanks(): Promise<BankOption[]> {
  return apiFetch<BankOption[]>("api/wallet/banks");
}

export interface BankAccount {
  id: string;
  accountName: string;
  accountNumber: string;
  bankName: string;
  bankCode: string;
}

export function getBankAccounts(): Promise<BankAccount[]> {
  return apiFetch<BankAccount[]>("api/wallet/bank-accounts");
}

export function resolveBankAccount(accountNumber: string, bankCode: string): Promise<{ accountName: string }> {
  return apiFetch<{ accountName: string }>(
    `api/wallet/bank-accounts/resolve?accountNumber=${encodeURIComponent(accountNumber)}&bankCode=${encodeURIComponent(bankCode)}`
  );
}

export function addBankAccount(body: { accountNumber: string; bankCode: string; accountName: string }): Promise<BankAccount> {
  return apiFetch<BankAccount>("api/wallet/bank-accounts", { method: "POST", body: body as unknown as BodyInit });
}

export interface WithdrawBody {
  bankAccountId: string;
  amount: string;
  pin: string;
}

export function withdraw(body: WithdrawBody): Promise<{ transactionId?: string; amount: string; accountNumber?: string; status?: string }> {
  return apiFetch("api/wallet/withdraw", { method: "POST", body: body as unknown as BodyInit });
}

/** Single transaction from list or detail. amount is "+₦X" or "-₦X", date is ISO string. */
export interface WalletTransaction {
  id: string;
  type: "credit" | "debit";
  title: string;
  description?: string;
  amount: string;
  amountRaw?: string;
  date: string;
  createdAt?: string;
  category?: string;
  source?: "wallet" | "card";
  reference?: string;
  status?: string;
  network?: string;
  repeat?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
}

export interface TransactionsListResponse {
  transactions: WalletTransaction[];
  total?: number;
  balance?: string;
}

export async function listTransactions(params?: {
  page?: number;
  limit?: number;
  type?: "credit" | "debit";
  category?: string;
  source?: "wallet" | "card";
}): Promise<TransactionsListResponse> {
  const cacheKey = params ? { ...params } : undefined;
  const cached = getCachedTransactions(cacheKey) as TransactionsListResponse | null;
  if (cached) return cached;
  const q = new URLSearchParams();
  if (params?.page != null) q.set("page", String(params.page));
  if (params?.limit != null) q.set("limit", String(params.limit));
  if (params?.type) q.set("type", params.type);
  if (params?.category) q.set("category", params.category);
  if (params?.source) q.set("source", params.source);
  const query = q.toString();
  const data = await apiFetch<TransactionsListResponse>(
    `api/wallet/transactions${query ? `?${query}` : ""}`
  );
  setCachedTransactions(cacheKey, data);
  return data;
}

export async function getTransaction(id: string): Promise<WalletTransaction & { metadata?: Record<string, unknown> }> {
  const cached = getCachedTransaction(id) as (WalletTransaction & { metadata?: Record<string, unknown> }) | null;
  if (cached) return cached;
  const data = await apiFetch<WalletTransaction & { metadata?: Record<string, unknown> }>(
    `api/wallet/transactions/${encodeURIComponent(id)}`
  );
  setCachedTransaction(id, data);
  return data;
}
