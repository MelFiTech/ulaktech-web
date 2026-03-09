"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useProfilePrefs } from "@/contexts/ProfilePrefsContext";
import { TransactionTimeline, type TransactionTimelineItem } from "@/components/dashboard/TransactionTimeline";
import { formatAmount } from "../data";
import { getTransaction, type WalletTransaction } from "@/lib/api/wallet";
import { formatTransactionDateDetail } from "@/lib/formatTransactionDate";
import { useToast } from "@/components/ui/Toast";

const AMOUNT_MASK = "••••••";

/** Build "To" / "From" value for transaction details (aligns with ulatech/backend display). */
function getTransactionRecipientTo(t: WalletTransaction | null): string {
  if (!t) return "";
  const r = t.repeat as Record<string, unknown> | undefined;
  const type = (r?.transactionType as string) ?? "";
  const title = t.title ?? "";

  if (type === "airtime" || type === "data" || type === "airtimeToCash") {
    const phone = (r?.phone as string)?.trim();
    if (phone) return phone;
    return title;
  }
  if (type === "withdraw") {
    const account = (r?.accountNumber as string)?.trim();
    const bank = (r?.bankName as string)?.trim();
    if (account && bank) return `${account} • ${bank}`;
    if (account) return account;
    if (bank) return bank;
    return title;
  }
  if (type === "transfer") {
    const username = (r?.recipientUsername as string)?.trim();
    if (username) return username.startsWith("@") ? username : `@${username}`;
    return title;
  }
  if (t.category === "deposit") {
    const meta = t.metadata as Record<string, unknown> | undefined;
    const originator = (meta?.originatorname as string)?.trim();
    const bank = (meta?.bankname as string)?.trim();
    if (originator && bank) return `${originator} • ${bank}`;
    if (originator) return originator;
    if (bank) return bank;
    const desc = (t.description ?? "").trim();
    return desc || "Bank transfer";
  }
  if (type === "electricity") {
    const meter = (r?.meterNumber as string)?.trim();
    if (meter) return meter;
    return title;
  }
  if (type === "tv") {
    const smartCard = (r?.smartCardNumber as string)?.trim();
    if (smartCard) return smartCard;
    const account = (r?.accountNumber as string)?.trim();
    if (account) return account;
    return title;
  }
  if (type === "betting") {
    const customerId = (r?.customerId as string)?.trim();
    if (customerId) return customerId;
    const account = (r?.accountNumber as string)?.trim();
    if (account) return account;
    return title;
  }
  return title;
}

export default function TransactionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { balanceVisible } = useProfilePrefs();
  const { toast } = useToast();
  const id = typeof params.id === "string" ? params.id : "";
  const [transaction, setTransaction] = useState<WalletTransaction | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const fetchDetail = useCallback(async () => {
    if (!id) {
      setLoading(false);
      setNotFound(true);
      return;
    }
    setLoading(true);
    setNotFound(false);
    try {
      const item = await getTransaction(id);
      setTransaction(item);
    } catch {
      setTransaction(null);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  const isoDate = transaction?.createdAt ?? transaction?.date;
  const { date: dateLabel, time: timeLabel } = isoDate
    ? formatTransactionDateDetail(isoDate)
    : { date: "Today", time: "12:00 PM" };
  const amountNum = transaction?.amountRaw
    ? parseFloat(transaction.amountRaw)
    : parseFloat((transaction?.amount ?? "0").replace(/[^0-9.]/g, "")) || 0;
  const amountFormatted = balanceVisible ? formatAmount(amountNum, transaction?.type ?? "debit") : AMOUNT_MASK;
  const isCredit = transaction?.type === "credit";
  const recipientTo = transaction ? getTransactionRecipientTo(transaction) : "";
  const recipientLabel =
    transaction?.type === "credit"
      ? transaction?.category === "deposit"
        ? "Source"
        : "From"
      : "To";
  const description =
    (transaction?.category === "deposit" &&
      (transaction?.metadata as Record<string, unknown>)?.narration) ||
    transaction?.description ||
    "";
  const reference =
    transaction?.reference || `ULATECH-${(transaction?.id ?? id).toUpperCase()}-${Date.now().toString(36)}`;

  const timelineItems: TransactionTimelineItem[] = useMemo(() => {
    const dateTimeStr = `${dateLabel} • ${timeLabel}`;
    return [
      { status: "initiated", icon: "arrow-up", title: "Initiated", date: dateTimeStr, description: "Transaction was initiated" },
      { status: "pending", icon: "time", title: "Processed", date: dateTimeStr, description: "Transaction was processed" },
      { status: "completed", icon: "checkmark", title: "Completed", date: dateTimeStr, description: "Transaction completed successfully" },
    ];
  }, [dateLabel, timeLabel]);

  const handleCopyReference = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(reference);
      toast("Reference copied", "success");
    } catch {
      toast("Could not copy", "error");
    }
  }, [reference, toast]);

  if (loading) {
    return (
      <div className="mx-auto max-w-lg space-y-8">
        <header className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[var(--textSecondary)] transition hover:bg-[var(--background)] hover:text-[var(--text)]"
            aria-label="Back"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>
          <h1 className="text-xl font-bold text-[var(--text)]">Transaction</h1>
        </header>
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 text-center">
          <p className="text-sm text-[var(--textSecondary)]">Loading...</p>
        </div>
      </div>
    );
  }

  if (notFound || !transaction) {
    return (
      <div className="mx-auto max-w-lg space-y-6">
        <header className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[var(--textSecondary)] transition hover:bg-[var(--background)] hover:text-[var(--text)]"
            aria-label="Back"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>
          <h1 className="text-xl font-bold text-[var(--text)]">Transaction</h1>
        </header>
        <p className="text-[var(--textSecondary)]">Transaction not found.</p>
        <Link href="/dashboard/history" className="text-[var(--tint)] hover:underline">
          Back to History
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg space-y-8">
      <header className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[var(--textSecondary)] transition hover:bg-[var(--background)] hover:text-[var(--text)]"
          aria-label="Back"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>
        <h1 className="text-xl font-bold text-[var(--text)]">Transaction</h1>
      </header>

      {/* Summary – ulatech style: amount, date/time, category */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 text-center">
        <p
          className={`text-2xl font-extrabold ${isCredit ? "text-[var(--success)]" : "text-[var(--tint)]"}`}
        >
          {amountFormatted}
        </p>
        <p className="mt-2 text-sm text-[var(--textSecondary)]">
          On {dateLabel} at {timeLabel}
        </p>
        <div className="mt-3 inline-block rounded-full border border-[var(--border)] bg-[var(--background)] px-4 py-2">
          <span className="text-sm font-medium text-[var(--text)]">
            {transaction.category || transaction.title}
          </span>
        </div>
      </div>

      {/* Transaction Timeline – same as mobile: Initiated → Processed → Completed */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <h2 className="mb-4 text-lg font-bold text-[var(--text)]">Status</h2>
        <TransactionTimeline items={timelineItems} />
      </div>

      {/* Transaction Details – ulatech style: From/To, Description, Payment Method, Fees, Reference */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <h2 className="mb-4 text-lg font-bold text-[var(--text)]">Transaction Details</h2>

        <div className="border-b border-[var(--border)] py-4">
          <p className="text-sm text-[var(--textSecondary)]">{recipientLabel}</p>
          <p className="mt-1 text-sm font-semibold text-[var(--text)]">{recipientTo || transaction.title}</p>
        </div>

        <div className="border-b border-[var(--border)] py-4">
          <p className="text-sm text-[var(--textSecondary)]">Description</p>
          <p className="mt-1 text-sm font-semibold text-[var(--text)]">{(typeof description === "string" ? description : "") || "—"}</p>
        </div>

        <div className="border-b border-[var(--border)] py-4 flex justify-between items-start gap-4">
          <div>
            <p className="text-sm text-[var(--textSecondary)]">Payment Method</p>
            <p className="mt-1 text-sm font-semibold text-[var(--text)]">Wallet</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-[var(--textSecondary)]">Fees</p>
            <p className="mt-1 text-sm font-semibold text-[var(--text)]">Free</p>
          </div>
        </div>

        <div className="pt-4">
          <p className="text-sm text-[var(--textSecondary)]">Transaction Reference</p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className="text-sm font-semibold text-[var(--text)] break-all">{reference}</span>
            <button
              type="button"
              onClick={handleCopyReference}
              className="shrink-0 inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-semibold text-[var(--tint)] hover:bg-[var(--tint)]/10 transition"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
              COPY
            </button>
          </div>
        </div>
      </div>

      <Link
        href="/dashboard/history"
        className="inline-block text-sm font-medium text-[var(--tint)] hover:underline"
      >
        Back to History
      </Link>
    </div>
  );
}
