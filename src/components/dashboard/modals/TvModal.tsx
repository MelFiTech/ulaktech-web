"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { ProcessingIndicator } from "@/components/ui/ProcessingIndicator";
import { AuthorizeModal } from "@/components/ui/AuthorizeModal";
import {
  TV_PROVIDERS,
  TV_BOUQUETS,
  type TvProviderId,
} from "./constants";

interface TvModalProps {
  open: boolean;
  onClose: () => void;
}

export function TvModal({ open, onClose }: TvModalProps) {
  const [step, setStep] = useState(1);
  const [provider, setProvider] = useState<TvProviderId | null>(null);
  const [bouquetId, setBouquetId] = useState<string | null>(null);
  const [smartcardNumber, setSmartcardNumber] = useState("");
  const [authorizeOpen, setAuthorizeOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const reset = () => {
    setStep(1);
    setProvider(null);
    setBouquetId(null);
    setSmartcardNumber("");
    setAuthorizeOpen(false);
    setIsProcessing(false);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const sanitizeSmartcard = (v: string) => v.replace(/\D/g, "").slice(0, 16);
  const bouquets = provider ? TV_BOUQUETS[provider] : [];
  const selectedBouquet = provider && bouquetId
    ? bouquets.find((b) => b.id === bouquetId)
    : null;

  return (
    <Modal open={open} onClose={handleClose} title="Pay TV">
      {!isProcessing && step === 1 && (
        <div className="space-y-5">
          <p className="text-sm text-[var(--textSecondary)]">
            Select your TV provider
          </p>
          <div className="grid grid-cols-2 gap-3">
            {TV_PROVIDERS.map(({ id, name }) => (
              <button
                key={id}
                type="button"
                onClick={() => {
                  setProvider(id);
                  setBouquetId(null);
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

      {!isProcessing && step === 2 && provider && (
        <form
          className="space-y-5"
          onSubmit={(e) => {
            e.preventDefault();
            if (bouquetId && smartcardNumber.length >= 10) setStep(3);
          }}
        >
          <p className="text-sm text-[var(--textSecondary)]">
            Select bouquet and enter smartcard number
          </p>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[var(--text)]">
              Bouquet
            </label>
            <div className="max-h-40 space-y-2 overflow-y-auto rounded-xl border border-[var(--border)] bg-[var(--background)] p-2">
              {bouquets.map((bouquet) => (
                <button
                  key={bouquet.id}
                  type="button"
                  onClick={() => setBouquetId(bouquet.id)}
                  className={`flex w-full items-center justify-between rounded-lg border-2 px-4 py-3 text-left transition focus:outline-none focus:ring-2 focus:ring-[var(--border)] ${
                    bouquetId === bouquet.id
                      ? "border-[var(--tint)] bg-[var(--tint)]/10"
                      : "border-transparent hover:bg-[var(--text)]/5"
                  }`}
                >
                  <span className="font-medium text-[var(--text)]">
                    {bouquet.name}
                  </span>
                  <span className="text-sm text-[var(--textSecondary)]">
                    {bouquet.amount}
                  </span>
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[var(--text)]">
              Smartcard / IUC number
            </label>
            <input
              type="text"
              inputMode="numeric"
              value={smartcardNumber}
              onChange={(e) =>
                setSmartcardNumber(sanitizeSmartcard(e.target.value))
              }
              placeholder="e.g. 1234567890"
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-[var(--text)] placeholder:text-[var(--textSecondary)]/50 focus:border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--border)]"
            />
          </div>
          <div className="flex justify-center">
            <Button
              type="submit"
              variant="primary"
              disabled={!bouquetId || smartcardNumber.length < 10}
            >
              Continue
            </Button>
          </div>
        </form>
      )}

      {!isProcessing && step === 3 && provider && selectedBouquet && (
        <div className="space-y-5">
          <p className="text-sm text-[var(--textSecondary)]">
            Confirm and pay
          </p>
          <div className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-4">
            <p className="text-sm text-[var(--textSecondary)]">
              {TV_PROVIDERS.find((p) => p.id === provider)?.name} •{" "}
              {selectedBouquet.name}
            </p>
            <p className="mt-1 text-sm text-[var(--textSecondary)]">
              Smartcard: {smartcardNumber}
            </p>
            <p className="mt-1 text-lg font-semibold text-[var(--text)]">
              {selectedBouquet.amount}
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

      {!isProcessing && step === 4 && provider && selectedBouquet && (
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
              TV subscription successful
            </h3>
            <p className="mt-1 text-sm text-[var(--textSecondary)]">
              {selectedBouquet.name} has been sent to {smartcardNumber}
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
