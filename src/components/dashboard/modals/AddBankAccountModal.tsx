"use client";

import { useState, useEffect, useCallback } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { getBanks, resolveBankAccount, addBankAccount, type BankOption } from "@/lib/api/wallet";
import { useToast } from "@/components/ui/Toast";

interface AddBankAccountModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function AddBankAccountModal({ open, onClose, onSuccess }: AddBankAccountModalProps) {
  const { toast } = useToast();
  const [banks, setBanks] = useState<BankOption[]>([]);
  const [banksLoading, setBanksLoading] = useState(true);
  const [bankCode, setBankCode] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");
  const [resolving, setResolving] = useState(false);
  const [adding, setAdding] = useState(false);

  const fetchBanks = useCallback(async () => {
    if (!open) return;
    setBanksLoading(true);
    try {
      const list = await getBanks();
      setBanks(list ?? []);
      if (!bankCode && (list?.length ?? 0) > 0) setBankCode((list as BankOption[])[0].code);
    } catch {
      setBanks([]);
      toast("Something went wrong. Try again later.", "error");
    } finally {
      setBanksLoading(false);
    }
  }, [open, toast]);

  useEffect(() => {
    if (open) fetchBanks();
  }, [open, fetchBanks]);

  const handleVerify = async () => {
    const num = accountNumber.replace(/\D/g, "").trim();
    if (num.length !== 10 || !bankCode) {
      toast("Enter 10-digit account number and select bank.", "error");
      return;
    }
    setResolving(true);
    try {
      const res = await resolveBankAccount(num, bankCode);
      setAccountName(res?.accountName?.trim() ?? "");
      if (res?.accountName) toast("Account name verified.", "success");
    } catch {
      toast("Something went wrong. Try again later.", "error");
    } finally {
      setResolving(false);
    }
  };

  const handleAdd = async () => {
    const num = accountNumber.replace(/\D/g, "").trim();
    const name = accountName.trim();
    if (num.length !== 10 || !bankCode) {
      toast("Enter 10-digit account number and select bank.", "error");
      return;
    }
    if (!name) {
      toast("Verify account to get account name, then add.", "error");
      return;
    }
    setAdding(true);
    try {
      await addBankAccount({ accountNumber: num, bankCode, accountName: name });
      toast("Bank account added.", "success");
      onSuccess?.();
      setAccountNumber("");
      setAccountName("");
      onClose();
    } catch {
      toast("Something went wrong. Try again later.", "error");
    } finally {
      setAdding(false);
    }
  };

  const accountNumberClean = accountNumber.replace(/\D/g, "");
  const canVerify = accountNumberClean.length === 10 && !!bankCode;
  const canAdd = canVerify && accountName.trim().length > 0;

  return (
    <Modal open={open} onClose={onClose} title="Add bank account">
      <div className="space-y-5">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-[var(--text)]">Bank</label>
          <select
            value={bankCode}
            onChange={(e) => setBankCode(e.target.value)}
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-[var(--text)] focus:border-[var(--tint)] focus:outline-none focus:ring-2 focus:ring-[var(--tint)]/20"
            disabled={banksLoading}
          >
            {!bankCode && <option value="">Select bank</option>}
            {banks.map((b) => (
              <option key={b.id} value={b.code}>
                {b.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-[var(--text)]">Account number</label>
          <input
            type="text"
            inputMode="numeric"
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, "").slice(0, 10))}
            placeholder="10 digits"
            maxLength={10}
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-[var(--text)] placeholder:text-[var(--textSecondary)]/50 focus:border-[var(--tint)] focus:outline-none focus:ring-2 focus:ring-[var(--tint)]/20"
          />
        </div>

        {accountName && (
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[var(--textSecondary)]">Account name</label>
            <p className="text-sm font-semibold text-[var(--text)]">{accountName}</p>
          </div>
        )}

        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={handleVerify}
            disabled={!canVerify || resolving}
            loading={resolving}
          >
            Verify
          </Button>
          <Button
            type="button"
            variant="primary"
            className="flex-1"
            onClick={handleAdd}
            disabled={!canAdd || adding}
            loading={adding}
          >
            Add account
          </Button>
        </div>
      </div>
    </Modal>
  );
}
