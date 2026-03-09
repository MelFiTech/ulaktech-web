"use client";

import { useState, useEffect } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { ProcessingIndicator } from "@/components/ui/ProcessingIndicator";
import { AuthorizeModal } from "@/components/ui/AuthorizeModal";
import { useToast } from "@/components/ui/Toast";
import { NETWORKS, getNetworkImageUrl, NETWORK_TO_BACKEND_ID, type NetworkId } from "./constants";
import { getDataPlans, executeTransaction, type DataPlanOption } from "@/lib/api/wallet";

const PHONE_PREFIX = "+234";

interface DataModalProps {
  open: boolean;
  onClose: () => void;
  /** Called after a successful purchase. Use to refetch balance/transactions. */
  onSuccess?: () => void;
}

export function DataModal({ open, onClose, onSuccess }: DataModalProps) {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [network, setNetwork] = useState<NetworkId | null>(null);
  const [number, setNumber] = useState("");
  const [planId, setPlanId] = useState<string | null>(null);
  const [authorizeOpen, setAuthorizeOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [apiPlans, setApiPlans] = useState<DataPlanOption[]>([]);
  const [plansLoading, setPlansLoading] = useState(false);

  const reset = () => {
    setStep(1);
    setNetwork(null);
    setNumber("");
    setPlanId(null);
    setAuthorizeOpen(false);
    setIsProcessing(false);
    setApiPlans([]);
  };

  useEffect(() => {
    if (!open || !network) {
      setApiPlans([]);
      return;
    }
    setPlansLoading(true);
    getDataPlans(network)
      .then((list) => setApiPlans(Array.isArray(list) ? list : []))
      .catch(() => setApiPlans([]))
      .finally(() => setPlansLoading(false));
  }, [open, network]);

  const handleClose = () => {
    reset();
    onClose();
  };

  const sanitizeNumber = (v: string) => v.replace(/\D/g, "").slice(0, 11);
  const allPlans = apiPlans;
  const plans = allPlans;

  const selectedPlan = network && planId
    ? allPlans.find((p) => p.id === planId)
    : null;

  return (
    <Modal open={open} onClose={handleClose} title="Buy Data">
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

      {!isProcessing && step === 2 && network && (
        <form
          className="space-y-5"
          onSubmit={(e) => {
            e.preventDefault();
            if (planId) setStep(3);
          }}
        >
          <p className="text-sm text-[var(--textSecondary)]">
            Select data plan
          </p>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[var(--text)]">
              Data plan
            </label>
            <div className="max-h-48 space-y-2 overflow-y-auto rounded-xl border border-[var(--border)] bg-[var(--background)] p-2">
              {plansLoading ? (
                <p className="py-4 text-center text-sm text-[var(--textSecondary)]">
                  Loading plans…
                </p>
              ) : plans.length === 0 ? (
                <p className="py-4 text-center text-sm text-[var(--textSecondary)]">
                  No plans available for this network
                </p>
              ) : (
                plans.map((plan) => (
                  <button
                    key={plan.id}
                    type="button"
                    onClick={() => setPlanId(plan.id)}
                    className={`flex w-full items-center justify-between rounded-lg border-2 px-4 py-3 text-left transition focus:outline-none focus:ring-2 focus:ring-[var(--border)] ${
                      planId === plan.id
                        ? "border-[var(--tint)] bg-[var(--tint)]/10"
                        : "border-transparent hover:bg-[var(--text)]/5"
                    }`}
                  >
                    <span className="font-medium text-[var(--text)]">
                      {plan.name}
                    </span>
                    <span className="text-sm text-[var(--textSecondary)]">
                      {plan.price ? (plan.price.startsWith("₦") ? plan.price : `₦${plan.price}`) : plan.telco_price || ""}
                    </span>
                  </button>
                ))
              )}
            </div>
          </div>
          <div className="flex justify-center">
            <Button
              type="submit"
              variant="primary"
              disabled={!planId || plansLoading}
            >
              Continue
            </Button>
          </div>
        </form>
      )}

      {!isProcessing && step === 3 && network && selectedPlan && (
        <div className="space-y-5">
          <p className="text-sm text-[var(--textSecondary)]">
            Confirm and pay
          </p>
          <div className="flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--background)] p-4">
            <img
              src={getNetworkImageUrl(network)}
              alt=""
              className="h-10 w-10 shrink-0 rounded-full object-contain bg-white"
            />
            <div>
            <p className="text-sm text-[var(--textSecondary)]">
              {NETWORKS.find((n) => n.id === network)?.name} • {PHONE_PREFIX}
              {number}
            </p>
            <p className="mt-1 text-lg font-semibold text-[var(--text)]">
              {selectedPlan.name} — {selectedPlan.price ? (selectedPlan.price.startsWith("₦") ? selectedPlan.price : `₦${selectedPlan.price}`) : selectedPlan.telco_price}
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
          if (!network || !number || !selectedPlan) return;
          setIsProcessing(true);
          try {
            const accountNumber = number.startsWith("0") ? number : `0${number}`;
            const amountStr = (selectedPlan.price || selectedPlan.telco_price || "0").replace(/[^\d.]/g, "") || "0";
            await executeTransaction({
              transactionType: "data",
              pin,
              amount: amountStr,
              network_id: NETWORK_TO_BACKEND_ID[network],
              bundleId: selectedPlan.id,
              accountNumber,
            });
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

      {!isProcessing && step === 4 && selectedPlan && (
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
              Data purchase successful
            </h3>
            <p className="mt-1 text-sm text-[var(--textSecondary)]">
              {selectedPlan.name} has been sent to {PHONE_PREFIX}
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
