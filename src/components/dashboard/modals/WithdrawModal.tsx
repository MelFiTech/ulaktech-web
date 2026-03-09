"use client";

import { useState, useEffect, useCallback } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { AuthorizeModal } from "@/components/ui/AuthorizeModal";
import { getWallet, getBankAccounts, withdraw, type BankAccount } from "@/lib/api/wallet";
import { useToast } from "@/components/ui/Toast";
import { AddBankAccountModal } from "./AddBankAccountModal";

const QUICK_AMOUNTS = ["1000", "5000", "10000"];
const MIN_AMOUNT = 100;

function formatAmount(value: string): string {
  const num = parseFloat(value.replace(/,/g, ""));
  if (isNaN(num)) return value;
  return num.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatBalance(balance: number): string {
  return balance.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

interface WithdrawModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function WithdrawModal({ open, onClose, onSuccess }: WithdrawModalProps) {
  const { toast } = useToast();
  const [step, setStep] = useState<"accounts" | "amount" | "confirm">("accounts");
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [accountsLoading, setAccountsLoading] = useState(true);
  const [selectedAccount, setSelectedAccount] = useState<BankAccount | null>(null);
  const [balance, setBalance] = useState<number | null>(null);
  const [balanceLoading, setBalanceLoading] = useState(true);
  const [amountRaw, setAmountRaw] = useState("");
  const [displayAmount, setDisplayAmount] = useState("");
  const [amountError, setAmountError] = useState<string | null>(null);
  const [authorizeOpen, setAuthorizeOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [addBankOpen, setAddBankOpen] = useState(false);

  const fetchAccounts = useCallback(async () => {
    if (!open) return;
    setAccountsLoading(true);
    try {
      const list = await getBankAccounts();
      setAccounts(list ?? []);
    } catch {
      setAccounts([]);
    } finally {
      setAccountsLoading(false);
    }
  }, [open]);

  const fetchBalance = useCallback(async () => {
    if (!open) return;
    setBalanceLoading(true);
    try {
      const w = await getWallet();
      const num = parseFloat((w?.balance ?? "0").replace(/,/g, ""));
      setBalance(isNaN(num) ? 0 : num);
    } catch {
      setBalance(0);
    } finally {
      setBalanceLoading(false);
    }
  }, [open]);

  useEffect(() => {
    if (open) {
      fetchAccounts();
      fetchBalance();
    }
  }, [open, fetchAccounts, fetchBalance]);

  const validateAmount = (raw: string, bal: number): string | null => {
    const cleaned = raw.replace(/,/g, "").trim();
    if (!cleaned) return "Amount is required";
    const num = parseFloat(cleaned);
    if (isNaN(num) || num <= 0) return "Enter a valid amount";
    if (num < MIN_AMOUNT) return `Minimum is ₦${MIN_AMOUNT}`;
    if (num > bal) return "Amount exceeds balance";
    return null;
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

  const handleProceedToAmount = (account: BankAccount) => {
    setSelectedAccount(account);
    setAmountRaw("");
    setDisplayAmount("");
    setStep("amount");
  };

  const handleProceedToConfirm = () => {
    const bal = balance ?? 0;
    const err = validateAmount(amountRaw, bal);
    setAmountError(err);
    if (err) return;
    setStep("confirm");
  };

  const handleConfirmWithdraw = () => {
    setAuthorizeOpen(true);
  };

  const handleAuthorizeSuccess = async (pin: string) => {
    if (!selectedAccount) return;
    const amount = amountRaw.replace(/,/g, "");
    setSubmitting(true);
    try {
      await withdraw({ bankAccountId: selectedAccount.id, amount, pin });
      toast("Withdrawal successful", "success");
      onSuccess?.();
      resetAndClose();
    } catch {
      toast("Something went wrong. Try again later.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const resetAndClose = () => {
    setStep("accounts");
    setSelectedAccount(null);
    setAmountRaw("");
    setDisplayAmount("");
    setAmountError(null);
    setAuthorizeOpen(false);
    onClose();
  };

  const handleClose = () => {
    if (step === "confirm") setStep("amount");
    else if (step === "amount") {
      setStep("accounts");
      setSelectedAccount(null);
    } else resetAndClose();
  };

  const isAmountValid = !validateAmount(amountRaw, balance ?? 0);

  const title =
    step === "accounts"
      ? "Withdraw to bank"
      : step === "amount"
        ? "Enter amount"
        : "Confirm withdrawal";

  return (
    <>
      <Modal open={open} onClose={handleClose} title={title}>
        {step === "accounts" && (
          <div className="space-y-5">
            <p className="text-sm text-[var(--textSecondary)]">Select a bank account</p>
            {accountsLoading ? (
              <p className="text-sm text-[var(--textSecondary)]">Loading...</p>
            ) : accounts.length === 0 ? (
              <div className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-6 text-center">
                <p className="text-sm text-[var(--textSecondary)]">No bank accounts yet.</p>
                <p className="mt-1 text-sm text-[var(--textSecondary)]">
                  Add a bank account to withdraw funds.
                </p>
                <Button
                  type="button"
                  variant="primary"
                  className="mt-4"
                  onClick={() => setAddBankOpen(true)}
                >
                  Add bank account
                </Button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {accounts.map((acc) => (
                  <button
                    key={acc.id}
                    type="button"
                    onClick={() => handleProceedToAmount(acc)}
                    className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--background)] p-4 text-left transition hover:border-[var(--tint)]/30 hover:bg-[var(--tint)]/5"
                  >
                    <div>
                      <p className="font-semibold text-[var(--text)]">{acc.accountName}</p>
                      <p className="mt-0.5 text-sm text-[var(--textSecondary)]">
                        {acc.accountNumber} • {acc.bankName}
                      </p>
                    </div>
                    <span className="text-[var(--textSecondary)]" aria-hidden>
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="m9 18 6-6-6-6" />
                      </svg>
                    </span>
                  </button>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  className="mt-2"
                  onClick={() => setAddBankOpen(true)}
                >
                  + Add bank account
                </Button>
              </div>
            )}
          </div>
        )}

        {step === "amount" && selectedAccount && (
          <div className="space-y-5">
            <div className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-3">
              <p className="text-xs text-[var(--textSecondary)]">Withdraw to</p>
              <p className="font-semibold text-[var(--text)]">{selectedAccount.accountName}</p>
              <p className="text-sm text-[var(--textSecondary)]">
                {selectedAccount.accountNumber} • {selectedAccount.bankName}
              </p>
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
              {amountError && <p className="mt-1 text-xs text-[var(--error)]">{amountError}</p>}
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
                    className="flex-1 rounded-full border border-[var(--border)] bg-[var(--background)] py-2.5 text-sm font-semibold text-[var(--text)] hover:border-[var(--tint)]/50 transition"
                  >
                    ₦{formatAmount(s)}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-3">
              <Button type="button" variant="outline" className="flex-1" onClick={() => setStep("accounts")}>
                Back
              </Button>
              <Button
                type="button"
                variant="primary"
                className="flex-1"
                onClick={handleProceedToConfirm}
                disabled={!isAmountValid}
              >
                Proceed
              </Button>
            </div>
          </div>
        )}

        {step === "confirm" && selectedAccount && (
          <div className="space-y-5">
            <div className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-[var(--textSecondary)]">To</span>
                <span className="font-semibold text-[var(--text)]">
                  {selectedAccount.accountName} • {selectedAccount.bankName}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[var(--textSecondary)]">Amount</span>
                <span className="font-semibold text-[var(--text)]">₦{formatAmount(amountRaw)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[var(--textSecondary)]">Fee</span>
                <span className="font-medium text-[var(--text)]">Free</span>
              </div>
            </div>
            <div className="flex gap-3">
              <Button type="button" variant="outline" className="flex-1" onClick={() => setStep("amount")}>
                Back
              </Button>
              <Button
                type="button"
                variant="primary"
                className="flex-1"
                onClick={handleConfirmWithdraw}
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

      <AddBankAccountModal
        open={addBankOpen}
        onClose={() => setAddBankOpen(false)}
        onSuccess={() => { setAddBankOpen(false); fetchAccounts(); }}
      />
    </>
  );
}
