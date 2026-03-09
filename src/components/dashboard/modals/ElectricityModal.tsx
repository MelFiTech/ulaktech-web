"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { ProcessingIndicator } from "@/components/ui/ProcessingIndicator";
import { AuthorizeModal } from "@/components/ui/AuthorizeModal";
import { DISCOS, type DiscoId } from "./constants";

interface ElectricityModalProps {
  open: boolean;
  onClose: () => void;
}

export function ElectricityModal({ open, onClose }: ElectricityModalProps) {
  const [step, setStep] = useState(1);
  const [disco, setDisco] = useState<DiscoId | null>(null);
  const [meterNumber, setMeterNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [authorizeOpen, setAuthorizeOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const reset = () => {
    setStep(1);
    setDisco(null);
    setMeterNumber("");
    setAmount("");
    setAuthorizeOpen(false);
    setIsProcessing(false);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const sanitizeMeter = (v: string) => v.replace(/\D/g, "").slice(0, 20);
  const sanitizeAmount = (v: string) => v.replace(/\D/g, "").slice(0, 8);

  return (
    <Modal open={open} onClose={handleClose} title="Pay Electricity">
      {!isProcessing && step === 1 && (
        <div className="space-y-5">
          <p className="text-sm text-[var(--textSecondary)]">
            Select your distribution company
          </p>
          <div className="grid grid-cols-2 gap-3">
            {DISCOS.map(({ id, name }) => (
              <button
                key={id}
                type="button"
                onClick={() => {
                  setDisco(id);
                  setStep(2);
                }}
                className="rounded-xl border-2 border-[var(--border)] bg-[var(--background)] px-4 py-3 text-left font-medium text-[var(--text)] transition hover:border-[var(--tint)]/50 hover:bg-[var(--tint)]/5 focus:outline-none focus:ring-2 focus:ring-[var(--border)]"
              >
                {name}
              </button>
            ))}
          </div>
        </div>
      )}

      {!isProcessing && step === 2 && disco && (
        <form
          className="space-y-5"
          onSubmit={(e) => {
            e.preventDefault();
            if (meterNumber.length >= 10 && amount.trim()) setStep(3);
          }}
        >
          <p className="text-sm text-[var(--textSecondary)]">
            Enter meter number and amount
          </p>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[var(--text)]">
              Meter number
            </label>
            <input
              type="text"
              inputMode="numeric"
              value={meterNumber}
              onChange={(e) => setMeterNumber(sanitizeMeter(e.target.value))}
              placeholder="e.g. 12345678901"
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-[var(--text)] placeholder:text-[var(--textSecondary)]/50 focus:border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--border)]"
            />
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
              placeholder="e.g. 5000"
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-[var(--text)] placeholder:text-[var(--textSecondary)]/50 focus:border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--border)]"
            />
          </div>
          <div className="flex justify-center">
            <Button
              type="submit"
              variant="primary"
              disabled={meterNumber.length < 10 || !amount.trim()}
            >
              Continue
            </Button>
          </div>
        </form>
      )}

      {!isProcessing && step === 3 && disco && (
        <div className="space-y-5">
          <p className="text-sm text-[var(--textSecondary)]">
            Confirm and pay
          </p>
          <div className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-4">
            <p className="text-sm text-[var(--textSecondary)]">
              {DISCOS.find((d) => d.id === disco)?.name} • {meterNumber}
            </p>
            <p className="mt-1 text-lg font-semibold text-[var(--text)]">
              ₦{amount ? Number(amount).toLocaleString() : "0"}
            </p>
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
        onSuccess={() => {
          setAuthorizeOpen(false);
          setIsProcessing(true);
          setTimeout(() => {
            setIsProcessing(false);
            setStep(4);
          }, 1800);
        }}
        subtitle="Enter your transaction PIN"
      />

      {isProcessing && (
        <ProcessingIndicator message="Confirming payment..." />
      )}

      {!isProcessing && step === 4 && disco && (
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
              Electricity payment successful
            </h3>
            <p className="mt-1 text-sm text-[var(--textSecondary)]">
              ₦{Number(amount).toLocaleString()} has been sent to meter{" "}
              {meterNumber}
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
