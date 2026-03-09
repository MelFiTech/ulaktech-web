"use client";

import { useState, useEffect, useCallback } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { AuthorizeModal } from "@/components/ui/AuthorizeModal";
import {
  getWallet,
  transferResolve,
  transfer,
  transferRecent,
  type TransferRecentItem,
} from "@/lib/api/wallet";
import { useToast } from "@/components/ui/Toast";

const QUICK_AMOUNTS = ["1000", "5000", "10000"];
const MIN_AMOUNT = 100;
const USERNAME_REGEX = /^[a-zA-Z0-9._]{3,30}$/;

function formatAmount(value: string): string {
  const num = parseFloat(value.replace(/,/g, ""));
  if (isNaN(num)) return value;
  return num.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function formatBalance(balance: number): string {
  return balance.toLocaleString("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

interface TransferModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function TransferModal({ open, onClose, onSuccess }: TransferModalProps) {
  const { toast } = useToast();
  const [step, setStep] = useState<"form" | "confirm">("form");
  const [username, setUsername] = useState("");
  const [resolvedName, setResolvedName] = useState<string | null>(null);
  const [resolving, setResolving] = useState(false);
  const [amountRaw, setAmountRaw] = useState("");
  const [displayAmount, setDisplayAmount] = useState("");
  const [balance, setBalance] = useState<number | null>(null);
  const [balanceLoading, setBalanceLoading] = useState(true);
  const [recentList, setRecentList] = useState<TransferRecentItem[]>([]);
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [amountError, setAmountError] = useState<string | null>(null);
  const [authorizeOpen, setAuthorizeOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchBalanceAndRecent = useCallback(async () => {
    if (!open) return;
    setBalanceLoading(true);
    try {
      const [w, recent] = await Promise.all([getWallet(), transferRecent()]);
      const num = parseFloat((w?.balance ?? "0").replace(/,/g, ""));
      setBalance(isNaN(num) ? 0 : num);
      setRecentList(recent ?? []);
    } catch {
      setBalance(0);
      setRecentList([]);
    } finally {
      setBalanceLoading(false);
    }
  }, [open]);

  useEffect(() => {
    if (open) fetchBalanceAndRecent();
  }, [open, fetchBalanceAndRecent]);

  const validateUsername = (value: string): string | null => {
    const t = value.trim().toLowerCase();
    if (!t) return "Username is required";
    if (t.length < 3) return "At least 3 characters";
    if (t.length > 30) return "At most 30 characters";
    if (!USERNAME_REGEX.test(t)) return "Use only letters, numbers, dots or underscores";
    return null;
  };

  const validateAmount = (raw: string, bal: number): string | null => {
    const cleaned = raw.replace(/,/g, "").trim();
    if (!cleaned) return "Amount is required";
    const num = parseFloat(cleaned);
    if (isNaN(num) || num <= 0) return "Enter a valid amount";
    if (num < MIN_AMOUNT) return `Minimum is ₦${MIN_AMOUNT}`;
    if (num > bal) return "Amount exceeds balance";
    return null;
  };

  const resolveRecipient = useCallback(async (uname: string) => {
    const t = uname.trim().toLowerCase();
    if (!t || validateUsername(t)) {
      setResolvedName(null);
      return;
    }
    setResolving(true);
    setUsernameError(null);
    try {
      const res = await transferResolve(t);
      setResolvedName(res?.accountName ?? t);
    } catch {
      setResolvedName(null);
      setUsernameError("Could not find recipient");
    } finally {
      setResolving(false);
    }
  }, []);

  const handleUsernameBlur = () => {
    const t = username.trim().toLowerCase();
    const err = validateUsername(t);
    setUsernameError(err);
    if (!err && t.length >= 3) resolveRecipient(t);
  };

  const handleUsernameChange = (value: string) => {
    const cleaned = value
      .trim()
      .toLowerCase()
      .replace(/\s/g, "")
      .replace(/[^a-zA-Z0-9._]/g, "")
      .slice(0, 30);
    setUsername(cleaned);
    setResolvedName(null);
    setUsernameError(null);
  };

  const handleAmountChange = (text: string) => {
    const cleaned = text.replace(/,/g, "").replace(/[^0-9.]/g, "");
    const parts = cleaned.split(".");
    const final = parts.length > 1 ? `${parts[0] ?? ""}.${parts.slice(1).join("")}` : cleaned;
    setAmountRaw(final);
    if (final === "" || final === ".") {
      setDisplayAmount(final);
    } else {
      const num = parseFloat(final);
      if (!isNaN(num)) {
        const [intPart, decPart] = final.split(".");
        const formatted = parseInt(intPart || "0", 10).toLocaleString("en-US");
        setDisplayAmount(decPart !== undefined ? `${formatted}.${decPart}` : formatted);
      } else {
        setDisplayAmount(final);
      }
    }
    setAmountError(null);
  };

  const handleProceed = () => {
    const uErr = validateUsername(username);
    const bal = balance ?? 0;
    const aErr = validateAmount(amountRaw, bal);
    setUsernameError(uErr ?? (resolvedName ? null : "Enter username and blur to validate"));
    setAmountError(aErr);
    if (uErr || aErr || !resolvedName) return;
    setStep("confirm");
  };

  const handleConfirmProceed = () => {
    setAuthorizeOpen(true);
  };

  const handleAuthorizeSuccess = async (pin: string) => {
    const uname = username.trim().toLowerCase();
    const amount = amountRaw.replace(/,/g, "");
    setSubmitting(true);
    try {
      await transfer({
        username: uname,
        recipientAccountName: resolvedName ?? uname,
        amount,
        pin,
      });
      toast("Transfer successful", "success");
      onSuccess?.();
      resetAndClose();
    } catch {
      toast("Something went wrong. Try again later.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const resetAndClose = () => {
    setStep("form");
    setUsername("");
    setResolvedName(null);
    setAmountRaw("");
    setDisplayAmount("");
    setUsernameError(null);
    setAmountError(null);
    setAuthorizeOpen(false);
    onClose();
  };

  const handleClose = () => {
    if (step === "confirm") setStep("form");
    else resetAndClose();
  };

  const isFormValid =
    !validateUsername(username) &&
    !validateAmount(amountRaw, balance ?? 0) &&
    !!resolvedName &&
    !resolving;

  return (
    <>
      <Modal open={open} onClose={handleClose} title={step === "confirm" ? "Confirm transfer" : "Transfer"}>
        {step === "form" && (
          <div className="space-y-5">
            {recentList.length > 0 && (
              <div>
                <p className="mb-2 text-xs font-medium text-[var(--textSecondary)]">Recent</p>
                <div className="flex flex-wrap gap-2">
                  {recentList.map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => {
                        const u = (r.username ?? "").trim().toLowerCase();
                        setUsername(u);
                        setResolvedName(r.accountName ?? u);
                        setUsernameError(null);
                        resolveRecipient(u);
                      }}
                      className="rounded-full border border-[var(--border)] bg-[var(--background)] px-3 py-1.5 text-sm font-medium text-[var(--text)] hover:bg-[var(--tint)]/10 hover:border-[var(--tint)]/30 transition"
                    >
                      @{r.username}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <label className="mb-1.5 block text-sm font-medium text-[var(--text)]">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => handleUsernameChange(e.target.value)}
                onBlur={handleUsernameBlur}
                placeholder="Enter username"
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-[var(--text)] placeholder:text-[var(--textSecondary)]/50 focus:border-[var(--tint)] focus:outline-none focus:ring-2 focus:ring-[var(--tint)]/20"
                autoComplete="off"
                autoCapitalize="none"
              />
              {usernameError && (
                <p className="mt-1 text-xs text-[var(--error)]">{usernameError}</p>
              )}
              {resolving && (
                <p className="mt-1 text-xs text-[var(--textSecondary)]">Validating...</p>
              )}
              {resolvedName && !resolving && (
                <p className="mt-1 text-sm font-semibold text-[var(--tint)]">{resolvedName}</p>
              )}
            </div>

            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label className="text-sm font-medium text-[var(--text)]">Amount</label>
                <span className="text-xs text-[var(--textSecondary)]">
                  Balance: {balanceLoading ? "..." : `₦${formatBalance(balance ?? 0)}`}
                </span>
              </div>
              <input
                type="text"
                inputMode="decimal"
                value={displayAmount}
                onChange={(e) => handleAmountChange(e.target.value)}
                placeholder="0.00"
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-[var(--text)] placeholder:text-[var(--textSecondary)]/50 focus:border-[var(--tint)] focus:outline-none focus:ring-2 focus:ring-[var(--tint)]/20"
              />
              {amountError && (
                <p className="mt-1 text-xs text-[var(--error)]">{amountError}</p>
              )}
            </div>

            <div>
              <p className="mb-2 text-xs font-medium text-[var(--textSecondary)]">Quick amount</p>
              <div className="flex gap-2">
                {QUICK_AMOUNTS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => {
                      setAmountRaw(s);
                      setDisplayAmount(formatAmount(s));
                      setAmountError(null);
                    }}
                    className="flex-1 rounded-full border border-[var(--border)] bg-[var(--background)] py-2.5 text-sm font-semibold text-[var(--text)] hover:border-[var(--tint)]/50 hover:bg-[var(--tint)]/5 transition"
                  >
                    ₦{formatAmount(s)}
                  </button>
                ))}
              </div>
            </div>

            <Button
              type="button"
              variant="primary"
              fullWidth
              onClick={handleProceed}
              disabled={!isFormValid}
            >
              Proceed
            </Button>
          </div>
        )}

        {step === "confirm" && (
          <div className="space-y-5">
            <div className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-[var(--textSecondary)]">Send to</span>
                <span className="font-semibold text-[var(--text)]">
                  {resolvedName ?? username.trim().toLowerCase()}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[var(--textSecondary)]">Amount</span>
                <span className="font-semibold text-[var(--text)]">
                  ₦{formatAmount(amountRaw)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[var(--textSecondary)]">Fee</span>
                <span className="font-medium text-[var(--text)]">Free</span>
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => setStep("form")}
              >
                Back
              </Button>
              <Button
                type="button"
                variant="primary"
                className="flex-1"
                onClick={handleConfirmProceed}
                loading={submitting}
              >
                Confirm
              </Button>
            </div>
          </div>
        )}
      </Modal>

      <AuthorizeModal
        open={authorizeOpen}
        onClose={() => setAuthorizeOpen(false)}
        onSuccess={handleAuthorizeSuccess}
        subtitle="Enter your 4-digit transaction PIN"
      />
    </>
  );
}
