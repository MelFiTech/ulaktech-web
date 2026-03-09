"use client";

import Link from "next/link";
import { getNetworkImageUrlFromName, inferNetworkFromDescription } from "@/components/dashboard/modals/constants";

const ICON_CLASS = "flex h-10 w-10 shrink-0 items-center justify-center rounded-full";

/** Minimal transaction row data – shared by Recent (home) and History. */
export interface TransactionItemProps {
  id: string;
  type: "credit" | "debit";
  title: string;
  description?: string;
  date: string;
  amountDisplay: string;
  balanceVisible: boolean;
  network?: string;
  detailHref?: string;
}

/** Resolve network for icon when tx is airtime/data/airtime-to-cash (matches mobile: network → image, else arrow). */
function getEffectiveNetwork(title: string, description?: string, network?: string): string | null {
  if (network) return network;
  const titleLower = title?.toLowerCase() ?? "";
  if (["airtime", "data", "airtime to cash"].some((k) => titleLower.includes(k))) {
    return inferNetworkFromDescription(description ?? "") ?? null;
  }
  return null;
}

/** Credit: arrow-down in circle (mobile: arrow-down-circle-outline). */
const IconInbound = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><path d="M12 8v8M8 12l4 4 4-4" />
  </svg>
);

/** Debit: arrow-up in circle (mobile: arrow-up-circle-outline). */
const IconOutbound = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><path d="M12 16V8M8 12l4-4 4 4" />
  </svg>
);

/** Icon for one row: network image when applicable (airtime/data/airtime-to-cash), else credit/debit circle arrow – matches mobile. */
function RowIcon({ tx }: { tx: TransactionItemProps }) {
  const networkName = getEffectiveNetwork(tx.title, tx.description, tx.network);
  const networkImg = networkName ? getNetworkImageUrlFromName(networkName) : null;
  if (networkImg) {
    return (
      <img
        src={networkImg}
        alt=""
        className="h-10 w-10 shrink-0 rounded-full object-contain border border-[var(--border)] bg-white"
      />
    );
  }
  if (networkName) {
    return (
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--background)] text-xs font-semibold text-[var(--text)]">
        {networkName.slice(0, 2)}
      </div>
    );
  }
  const isCredit = tx.type === "credit";
  return (
    <div className={`${ICON_CLASS} ${isCredit ? "bg-[var(--success)]/15 text-[var(--success)]" : "bg-[var(--tint)]/15 text-[var(--tint)]"}`}>
      {isCredit ? <IconInbound /> : <IconOutbound />}
    </div>
  );
}

const ROW_CLASS =
  "flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 transition hover:border-[var(--tint)]/20 active:opacity-90";

/** Single transaction row – same layout as mobile (icon, title, subtitle, amount, chevron). Used on home (recent) and history. */
export function TransactionItem({ tx, detailHref }: { tx: TransactionItemProps; detailHref?: string }) {
  const subtitle = [tx.description, tx.date].filter(Boolean).join(" • ");
  const isCredit = tx.type === "credit";
  const amountColor = isCredit ? "text-[var(--success)]" : "text-[var(--tint)]";

  const content = (
    <>
      <div className="shrink-0">
        <RowIcon tx={tx} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="font-medium text-[var(--text)] truncate">{tx.title}</p>
          <span className={`shrink-0 font-semibold ${amountColor}`}>{tx.amountDisplay}</span>
        </div>
        <p className="mt-0.5 text-xs text-[var(--textSecondary)] truncate">{subtitle}</p>
      </div>
      <span className="shrink-0 text-[var(--textSecondary)]" aria-hidden>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="m9 18 6-6-6-6" />
        </svg>
      </span>
    </>
  );

  if (detailHref) {
    return (
      <Link href={detailHref} className={ROW_CLASS}>
        {content}
      </Link>
    );
  }
  return <div className={ROW_CLASS}>{content}</div>;
}
