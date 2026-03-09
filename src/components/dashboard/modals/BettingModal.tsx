"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { ProcessingIndicator } from "@/components/ui/ProcessingIndicator";
import { AuthorizeModal } from "@/components/ui/AuthorizeModal";
import { BETTING_OPERATORS, type BettingOperatorId } from "./constants";

const PHONE_PREFIX = "+234";

interface BettingModalProps {
  open: boolean;
  onClose: () => void;
}

export function BettingModal({ open, onClose }: BettingModalProps) {
  const [step, setStep] = useState(1);
  const [operator, setOperator] = useState<BettingOperatorId | null>(null);
  const [userId, setUserId] = useState("");
  const [amount, setAmount] = useState("");
  const [authorizeOpen, setAuthorizeOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const reset = () => {
    setStep(1);
    setOperator(null);
    setUserId("");
    setAmount("");
    setAuthorizeOpen(false);
    setIsProcessing(false);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const sanitizeUserId = (v: string) => v.replace(/\D/g, "").slice(0, 15);
  const sanitizeAmount = (v: string) => v.replace(/\D/g, "").slice(0, 8);

  return (
    <Modal open={open} onClose={handleClose} title="Fund Betting">
      {!isProcessing && step === 1 && (
        <div className="space-y-5">
          <p className="text-sm text-[var(--textSecondary)]">
            Select betting operator
          </p>
          <div className="grid grid-cols-2 gap-3">
            {BETTING_OPERATORS.map(({ id, name }) => (
              <button
                key={id}
                type="button"
                onClick={() => {
                  setOperator(id);
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

      {!isProcessing && step === 2 && operator && (
        <form
          className="space-y-5"
          onSubmit={(e) => {
            e.preventDefault();
            if (userId.length >= 10 && amount.trim()) setStep(3);
          }}
        >
          <p className="text-sm text-[var(--textSecondary)]">
            Enter user ID or phone and amount
          </p>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[var(--text)]">
              User ID / Phone number
            </label>
            <div className="flex rounded-xl border border-[var(--border)] bg-[var(--background)] overflow-hidden focus-within:ring-2 focus-within:ring-[var(--border)]">
              <span className="flex items-center pl-4 text-sm text-[var(--textSecondary)]">
                {PHONE_PREFIX}
              </span>
              <input
                type="tel"
                inputMode="numeric"
                value={userId}
                onChange={(e) => setUserId(sanitizeUserId(e.target.value))}
                placeholder="8012345678 or ID"
                maxLength={15}
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
              placeholder="e.g. 1000"
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-[var(--text)] placeholder:text-[var(--textSecondary)]/50 focus:border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--border)]"
            />
          </div>
          <div className="flex justify-center">
            <Button
              type="submit"
              variant="primary"
              disabled={userId.length < 10 || !amount.trim()}
            >
              Continue
            </Button>
          </div>
        </form>
      )}

      {!isProcessing && step === 3 && operator && (
        <div className="space-y-5">
          <p className="text-sm text-[var(--textSecondary)]">
            Confirm and pay
          </p>
          <div className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-4">
            <p className="text-sm text-[var(--textSecondary)]">
              {BETTING_OPERATORS.find((o) => o.id === operator)?.name} •{" "}
              {PHONE_PREFIX}
              {userId}
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

      {!isProcessing && step === 4 && operator && (
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
              Betting wallet funded
            </h3>
            <p className="mt-1 text-sm text-[var(--textSecondary)]">
              ₦{Number(amount).toLocaleString()} has been sent to your{" "}
              {BETTING_OPERATORS.find((o) => o.id === operator)?.name} account
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
