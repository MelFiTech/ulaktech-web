"use client";

import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import type { NetworkId } from "./constants";
import { NETWORKS, SHARE_PIN_DIAL_CODES } from "./constants";

interface SharePinInfoModalProps {
  open: boolean;
  onClose: () => void;
  networkId: NetworkId | null;
}

export function SharePinInfoModal({
  open,
  onClose,
  networkId,
}: SharePinInfoModalProps) {
  const networkName = networkId
    ? NETWORKS.find((n) => n.id === networkId)?.name ?? "your network"
    : "your network";
  const dialCode = networkId ? SHARE_PIN_DIAL_CODES[networkId] : "*321*4#";

  const handleDialCode = () => {
    window.location.href = `tel:${dialCode}`;
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="What is sharepin?">
      <div className="space-y-5">
        <p className="text-sm text-[var(--textSecondary)]">
          Sharepin is a 4 digit pin used to authorize airtime transfer.
        </p>
        <div>
          <h3 className="text-sm font-semibold text-[var(--text)]">
            How to setup {networkName} share pin
          </h3>
          <p className="mt-1.5 text-sm text-[var(--textSecondary)]">
            Dial <strong className="text-[var(--text)]">{dialCode}</strong> and
            follow the prompt to change or create a new sharepin.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-3 pt-2">
          <Button variant="outlineLight" onClick={onClose}>
            Okay, got it
          </Button>
          <Button variant="primary" onClick={handleDialCode}>
            Dial code now
          </Button>
        </div>
      </div>
    </Modal>
  );
}
