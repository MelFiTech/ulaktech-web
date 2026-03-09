"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { ProcessingIndicator } from "@/components/ui/ProcessingIndicator";
import { NETWORKS, getNetworkImageUrl, type NetworkId } from "./constants";
import { SharePinInfoModal } from "./SharePinInfoModal";

const PHONE_PREFIX = "+234";
const OTP_LENGTH = 6;

/** Mock rate: user receives 80% of amount as cash */
const CASH_RATE = 0.8;

interface AirtimeToCashModalProps {
  open: boolean;
  onClose: () => void;
}

export function AirtimeToCashModal({ open, onClose }: AirtimeToCashModalProps) {
  const [step, setStep] = useState(1);
  const [network, setNetwork] = useState<NetworkId | null>(null);
  const [number, setNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [amount, setAmount] = useState("");
  const [sharePin, setSharePin] = useState("");
  const [showSharePin, setShowSharePin] = useState(false);
  const [sharePinInfoOpen, setSharePinInfoOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const reset = () => {
    setStep(1);
    setNetwork(null);
    setNumber("");
    setOtp("");
    setAmount("");
    setSharePin("");
    setShowSharePin(false);
    setSharePinInfoOpen(false);
    setIsProcessing(false);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const sanitizeNumber = (v: string) => v.replace(/\D/g, "").slice(0, 11);
  const sanitizeAmount = (v: string) => v.replace(/\D/g, "").slice(0, 8);
  const sanitizeOtp = (v: string) => v.replace(/\D/g, "").slice(0, OTP_LENGTH);
  const sanitizeSharePin = (v: string) => v.replace(/\D/g, "").slice(0, 4);

  const amountNum = amount ? Number(amount) : 0;
  const receiveNum = Math.floor(amountNum * CASH_RATE);
  const canProceedAmount = amountNum >= 100 && sharePin.length === 4;

  return (
    <>
      <Modal open={open} onClose={handleClose} title="Airtime to Cash">
        {!isProcessing && step === 1 && (
          <form
            className="space-y-5"
            onSubmit={(e) => {
              e.preventDefault();
              if (network && number.length >= 10) setStep(2);
            }}
          >
            <p className="text-sm text-[var(--textSecondary)]">
              Select network and enter phone number
            </p>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[var(--text)]">
                Network
              </label>
              <div className="grid grid-cols-2 gap-3">
                {NETWORKS.map(({ id, name }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setNetwork(id)}
                    className={`flex items-center gap-3 rounded-xl border-2 px-4 py-3 text-left font-medium transition focus:outline-none focus:ring-2 focus:ring-[var(--border)] ${
                      network === id
                        ? "border-[var(--tint)] bg-[var(--tint)]/10 text-[var(--text)]"
                        : "border-[var(--border)] bg-[var(--background)] text-[var(--text)] hover:border-[var(--tint)]/50 hover:bg-[var(--tint)]/5"
                    }`}
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
            <div className="flex justify-center">
              <Button
                type="submit"
                variant="primary"
                disabled={!network || number.length < 10}
              >
                Continue
              </Button>
            </div>
          </form>
        )}

        {!isProcessing && step === 2 && (
          <form
            className="space-y-5"
            onSubmit={(e) => {
              e.preventDefault();
              if (otp.length === OTP_LENGTH) setStep(3);
            }}
          >
            <p className="text-sm text-[var(--textSecondary)]">
              Enter the code we sent to your phone
            </p>
            <div className="rounded-xl border-2 border-[var(--tint)]/40 bg-[var(--tint)]/10 px-4 py-3">
              <p className="text-xs font-medium uppercase tracking-wider text-[var(--textSecondary)]">
                Verifying
              </p>
              <p className="mt-0.5 font-semibold text-[var(--text)]">
                {PHONE_PREFIX}{number}
              </p>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[var(--text)]">
                Verification code
              </label>
              <input
                type="text"
                inputMode="numeric"
                value={otp}
                onChange={(e) => setOtp(sanitizeOtp(e.target.value))}
                placeholder="000000"
                maxLength={OTP_LENGTH}
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-center text-lg tracking-[0.4em] text-[var(--text)] placeholder:text-[var(--textSecondary)]/50 focus:border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--border)]"
              />
            </div>
            <div className="flex justify-center">
              <Button
                type="submit"
                variant="primary"
                disabled={otp.length !== OTP_LENGTH}
              >
                Verify
              </Button>
            </div>
          </form>
        )}

        {!isProcessing && step === 3 && network && (
          <div className="space-y-5">
            <p className="text-sm text-[var(--textSecondary)]">
              Enter amount and your share pin
            </p>
            <div className="flex items-center justify-between gap-3 rounded-xl border border-[var(--border)] bg-[var(--background)] p-4">
              <div className="flex items-center gap-3">
                {network && (
                  <img
                    src={getNetworkImageUrl(network)}
                    alt=""
                    className="h-10 w-10 shrink-0 rounded-full object-contain bg-white"
                  />
                )}
                <div>
                  <p className="font-medium text-[var(--text)]">
                    {PHONE_PREFIX}{number}
                  </p>
                  <p className="text-xs text-[var(--textSecondary)]">
                    Balance: ₦204.76
                  </p>
                </div>
              </div>
              <Button
                type="button"
                variant="outlineLight"
                className="shrink-0 text-sm"
                onClick={() => setStep(1)}
              >
                Change
              </Button>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[var(--text)]">
                Amount
              </label>
              <input
                type="text"
                inputMode="numeric"
                value={amount}
                onChange={(e) => setAmount(sanitizeAmount(e.target.value))}
                placeholder="0"
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-[var(--text)] placeholder:text-[var(--textSecondary)]/50 focus:border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--border)]"
              />
              {amountNum > 0 && (
                <p className="mt-1.5 text-sm text-[var(--textSecondary)]">
                  You will receive ₦{receiveNum.toLocaleString()}.00
                </p>
              )}
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[var(--text)]">
                Airtime Share Pin
              </label>
              <div className="relative flex rounded-xl border border-[var(--border)] bg-[var(--background)] focus-within:ring-2 focus-within:ring-[var(--border)]">
                <input
                  type={showSharePin ? "text" : "password"}
                  inputMode="numeric"
                  value={sharePin}
                  onChange={(e) =>
                    setSharePin(sanitizeSharePin(e.target.value))
                  }
                  placeholder="Enter share pin for this phone number"
                  maxLength={4}
                  className="w-full rounded-xl border-0 bg-transparent px-4 py-3 pr-12 text-[var(--text)] placeholder:text-[var(--textSecondary)]/50 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowSharePin((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-[var(--tint)] hover:underline"
                >
                  {showSharePin ? "Hide" : "Show"}
                </button>
              </div>
              <p className="mt-1.5 text-right">
                <button
                  type="button"
                  onClick={() => setSharePinInfoOpen(true)}
                  className="text-sm font-medium text-[var(--tint)] hover:underline"
                >
                  What is share pin?
                </button>
              </p>
            </div>
            <div className="flex justify-center">
              <Button
                type="button"
                variant="primary"
                disabled={!canProceedAmount}
                onClick={() => {
                  setIsProcessing(true);
                  setTimeout(() => {
                    setIsProcessing(false);
                    setStep(4);
                  }, 1800);
                }}
              >
                Proceed
              </Button>
            </div>
          </div>
        )}

        {isProcessing && (
          <ProcessingIndicator message="Processing airtime to cash..." />
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
                Airtime to cash successful
              </h3>
              <p className="mt-1 text-sm text-[var(--textSecondary)]">
                ₦{receiveNum.toLocaleString()}.00 has been sent to your wallet.
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

      <SharePinInfoModal
        open={sharePinInfoOpen}
        onClose={() => setSharePinInfoOpen(false)}
        networkId={network}
      />
    </>
  );
}
