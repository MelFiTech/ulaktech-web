"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { ProcessingIndicator } from "@/components/ui/ProcessingIndicator";
import { AuthorizeModal } from "@/components/ui/AuthorizeModal";
import { useToast } from "@/components/ui/Toast";
import { NETWORKS, getNetworkImageUrl, NETWORK_TO_BACKEND_ID, type NetworkId } from "./constants";
import { executeTransaction, invalidateWalletCache } from "@/lib/api/wallet";

const PHONE_PREFIX = "+234";

interface AirtimeModalProps {
  open: boolean;
  onClose: () => void;
  /** Called after a successful purchase (before closing). Use to refetch balance/transactions. */
  onSuccess?: () => void;
}

export function AirtimeModal({ open, onClose, onSuccess }: AirtimeModalProps) {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [network, setNetwork] = useState<NetworkId | null>(null);
  const [number, setNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [authorizeOpen, setAuthorizeOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const reset = () => {
    setStep(1);
    setNetwork(null);
    setNumber("");
    setAmount("");
    setAuthorizeOpen(false);
    setIsProcessing(false);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const sanitizeNumber = (v: string) => v.replace(/\D/g, "").slice(0, 11);
  const sanitizeAmount = (v: string) => v.replace(/\D/g, "").slice(0, 8);

  return (
    <Modal open={open} onClose={handleClose} title="Buy Airtime">
      {!isProcessing && step === 1 && (
        <div className="space-y-5">
          <p className="text-sm text-[var(--textSecondary)]">
            Select network
          </p>
          <div className="grid grid-cols-2 gap-3">
            {NETWORKS.map(({ id, name }) => (
              <button
                key={id}
                type="button"
                onClick={() => {
                  setNetwork(id);
                  setStep(2);
                }}
                className="flex items-center gap-3 rounded-xl border-2 border-[var(--border)] bg-[var(--background)] px-4 py-3 text-left font-medium text-[var(--text)] transition hover:border-[var(--tint)]/50 hover:bg-[var(--tint)]/5 focus:outline-none focus:ring-2 focus:ring-[var(--border)]"
              >
                <img
                  src={getNetworkImageUrl(id)}
                  alt=""
                  className="h-10 w-10 shrink-0 rounded-full object-contain bg-white"
                />
                {name}
              </button>
            ))}
          </div>
        </div>
      )}

      {!isProcessing && step === 2 && (
        <form
          className="space-y-5"
          onSubmit={(e) => {
            e.preventDefault();
            if (number.length >= 10 && amount.trim()) setStep(3);
          }}
        >
          <p className="text-sm text-[var(--textSecondary)]">
            Enter phone number and amount
          </p>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[var(--text)]">
              Phone number
            </label>
            <div className="flex rounded-xl border border-[var(--border)] bg-[var(--background)] overflow-hidden focus-within:ring-2 focus-within:ring-[var(--border)]">
              <span className="flex items-center pl-4 text-sm text-[var(--textSecondary)]">
                {PHONE_PREFIX}
              </span>
              <input
                type="tel"
                inputMode="numeric"
                value={number}
                onChange={(e) => setNumber(sanitizeNumber(e.target.value))}
                placeholder="8012345678"
                maxLength={11}
                className="w-full border-0 bg-transparent px-3 py-3 text-[var(--text)] placeholder:text-[var(--textSecondary)]/50 focus:outline-none"
              />
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[var(--text)]">
              Amount (₦)
            </label>
            <input
              type="text"
              inputMode="numeric"
              value={amount}
              onChange={(e) => setAmount(sanitizeAmount(e.target.value))}
              placeholder="100"
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-[var(--text)] placeholder:text-[var(--textSecondary)]/50 focus:border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--border)]"
            />
          </div>
          <div className="flex justify-center">
            <Button
              type="submit"
              variant="primary"
              disabled={number.length < 10 || !amount.trim()}
            >
              Continue
            </Button>
          </div>
        </form>
      )}

      {!isProcessing && step === 3 && (
        <div className="space-y-5">
          <p className="text-sm text-[var(--textSecondary)]">
            Confirm and pay
          </p>
          <div className="flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--background)] p-4">
            {network && (
              <img
                src={getNetworkImageUrl(network)}
                alt=""
                className="h-10 w-10 shrink-0 rounded-full object-contain bg-white"
              />
            )}
            <div>
            <p className="text-sm text-[var(--textSecondary)]">
              {NETWORKS.find((n) => n.id === network)?.name} • {PHONE_PREFIX}
              {number}
            </p>
            <p className="mt-1 text-lg font-semibold text-[var(--text)]">
              ₦{amount ? Number(amount).toLocaleString() : "0"}
            </p>
            </div>
          </div>
          <div className="flex justify-center">
            <Button
              type="button"
              variant="primary"
              onClick={() => setAuthorizeOpen(true)}
            >
              Pay
            </Button>
          </div>
        </div>
      )}

      <AuthorizeModal
        open={authorizeOpen}
        onClose={() => setAuthorizeOpen(false)}
        onSuccess={async (pin) => {
    setAuthorizeOpen(false);
    if (!network || !number || !amount.trim()) return;
          setIsProcessing(true);
          try {
            const accountNumber = number.startsWith("0") ? number : `0${number}`;
            await executeTransaction({
              transactionType: "airtime",
              pin,
              amount: amount.replace(/\D/g, "") || "0",
              network_id: NETWORK_TO_BACKEND_ID[network],
              accountNumber,
            });
            invalidateWalletCache();
            onSuccess?.();
            setStep(4);
          } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "Purchase failed. Try again.";
            toast(message, "error");
          } finally {
            setIsProcessing(false);
          }
        }}
        subtitle="Enter your transaction PIN"
      />

      {isProcessing && (
        <ProcessingIndicator message="Confirming purchase..." />
      )}

      {!isProcessing && step === 4 && (
        <div className="space-y-5 py-4 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[var(--success)]/20">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--success)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 6 9 17l-5-5" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-[var(--text)]">
              Airtime purchase successful
            </h3>
            <p className="mt-1 text-sm text-[var(--textSecondary)]">
              ₦{Number(amount).toLocaleString()} airtime has been sent to{" "}
              {PHONE_PREFIX}
              {number}
            </p>
          </div>
          <div className="flex justify-center">
            <Button variant="primary" onClick={handleClose}>
              Done
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}
