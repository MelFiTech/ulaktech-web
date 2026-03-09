"use client";

import { useState, useEffect, useCallback } from "react";
import { Modal } from "@/components/ui/Modal";
import { getWallet, type WalletResponse } from "@/lib/api/wallet";
import { useToast } from "@/components/ui/Toast";

interface AddFundsModalProps {
  open: boolean;
  onClose: () => void;
}

export function AddFundsModal({ open, onClose }: AddFundsModalProps) {
  const [loading, setLoading] = useState(true);
  const [wallet, setWallet] = useState<WalletResponse | null>(null);
  const [error, setError] = useState(false);
  const [copiedField, setCopiedField] = useState<"number" | "username" | null>(null);
  const { toast } = useToast();

  const fetchWallet = useCallback(async () => {
    if (!open) return;
    setLoading(true);
    setError(false);
    try {
      const w = await getWallet();
      setWallet(w);
    } catch {
      setError(true);
      toast("Something went wrong. Try again later.", "error");
    } finally {
      setLoading(false);
    }
  }, [open, toast]);

  useEffect(() => {
    if (open) fetchWallet();
  }, [open, fetchWallet]);

  const copyToClipboard = async (text: string, field: "number" | "username") => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      toast("Copied to clipboard", "success");
      setTimeout(() => setCopiedField(null), 2000);
    } catch {
      toast("Could not copy", "error");
    }
  };

  const hasBankDetails = wallet?.accountNumber;
  const hasUsername = wallet?.username;

  return (
    <Modal open={open} onClose={onClose} title="Add funds">
      <div className="space-y-5">
        <p className="text-sm text-[var(--textSecondary)]">
          Fund your account using your dedicated account number or username
        </p>

        {loading && !wallet ? (
          <div className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-6 space-y-4 animate-pulse">
            <div className="h-4 w-24 bg-[var(--border)] rounded" />
            <div className="h-5 w-40 bg-[var(--border)] rounded" />
            <div className="h-4 w-28 bg-[var(--border)] rounded mt-3" />
            <div className="h-5 w-32 bg-[var(--border)] rounded" />
          </div>
        ) : error && !wallet ? (
          <p className="text-sm text-[var(--error)]">Failed to load add money details</p>
        ) : (
          <>
            {hasBankDetails && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-[var(--text)]">Bank transfer</h3>
                <div className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-4">
                  {wallet?.accountName && (
                    <>
                      <p className="text-xs text-[var(--textSecondary)] mb-1">Account name</p>
                      <p className="text-base font-medium text-[var(--text)] mb-3">
                        {wallet.accountName}
                      </p>
                    </>
                  )}
                  <p className="text-xs text-[var(--textSecondary)] mb-1">Account number</p>
                  <div className="flex items-center justify-between gap-2 mt-1">
                    <p className="text-base font-semibold text-[var(--text)] tracking-wide">
                      {wallet?.accountNumber}
                    </p>
                    <button
                      type="button"
                      onClick={() => wallet?.accountNumber && copyToClipboard(wallet.accountNumber!, "number")}
                      className="shrink-0 inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-[var(--tint)] hover:bg-[var(--tint)]/10 transition focus:outline-none focus:ring-2 focus:ring-[var(--border)]"
                    >
                      {copiedField === "number" ? (
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                          Copied
                        </>
                      ) : (
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                          </svg>
                          Copy
                        </>
                      )}
                    </button>
                  </div>
                  {wallet?.bankName && (
                    <>
                      <p className="text-xs text-[var(--textSecondary)] mt-3 mb-1">Bank name</p>
                      <p className="text-base font-medium text-[var(--text)]">
                        {wallet.bankName}
                      </p>
                    </>
                  )}
                </div>
              </div>
            )}

            {hasUsername && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-[var(--text)]">Username</h3>
                <div className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-4">
                  <p className="text-xs text-[var(--textSecondary)] mb-1">Send to this username</p>
                  <div className="flex items-center justify-between gap-2 mt-1">
                    <p className="text-base font-semibold text-[var(--text)]">
                      @{wallet?.username}
                    </p>
                    <button
                      type="button"
                      onClick={() => wallet?.username && copyToClipboard(`@${wallet.username}`, "username")}
                      className="shrink-0 inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-[var(--tint)] hover:bg-[var(--tint)]/10 transition focus:outline-none focus:ring-2 focus:ring-[var(--border)]"
                    >
                      {copiedField === "username" ? "Copied" : "Copy"}
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="pt-2">
              <div className="flex items-center gap-2 mb-3">
                <h3 className="text-sm font-semibold text-[var(--text)]">Or fund with card</h3>
                <span className="rounded-full bg-[var(--border)]/80 px-2.5 py-0.5 text-xs font-medium text-[var(--textSecondary)]">
                  Coming soon
                </span>
              </div>
              <div className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-4 flex items-center gap-3 opacity-75">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--tint)]/20">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--tint)" strokeWidth="2">
                    <rect x="2" y="5" width="20" height="14" rx="2" />
                    <line x1="2" x2="22" y1="10" y2="10" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-[var(--text)]">Debit / Credit Card</p>
                  <p className="text-xs text-[var(--textSecondary)]">Add money instantly with your card</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}
