"use client";

import { useState, useCallback, useEffect } from "react";
import { Modal } from "./Modal";
import { Button } from "./Button";

const PIN_LENGTH = 4;

interface AuthorizeModalProps {
  open: boolean;
  onClose: () => void;
  /** Called when user enters 4 digits and confirms. PIN is passed so caller can submit it to the API (e.g. transfer). */
  onSuccess: (pin: string) => void;
  /** Optional subtitle below the title */
  subtitle?: string;
}

const KEYPAD_KEYS = [
  ["1", "2", "3"],
  ["4", "5", "6"],
  ["7", "8", "9"],
  ["", "0", "backspace"],
];

export function AuthorizeModal({
  open,
  onClose,
  onSuccess,
  subtitle = "Enter your transaction PIN",
}: AuthorizeModalProps) {
  const [pin, setPin] = useState("");

  const reset = useCallback(() => setPin(""), []);

  useEffect(() => {
    if (open) reset();
  }, [open, reset]);

  const handleKey = useCallback(
    (key: string) => {
      if (key === "backspace") {
        setPin((p) => p.slice(0, -1));
        return;
      }
      if (key === "" || pin.length >= PIN_LENGTH) return;
      setPin((p) => p + key);
    },
    [pin.length]
  );

  const handleConfirm = useCallback(() => {
    if (pin.length !== PIN_LENGTH) return;
    onSuccess(pin);
    onClose();
    reset();
  }, [pin, onSuccess, onClose, reset]);

  return (
    <Modal open={open} onClose={onClose} title="Authorize">
      <div className="space-y-6">
        {subtitle && (
          <p className="text-sm text-[var(--textSecondary)]">{subtitle}</p>
        )}

        {/* PIN display: 4 dots */}
        <div className="flex justify-center gap-3">
          {Array.from({ length: PIN_LENGTH }).map((_, i) => (
            <div
              key={i}
              className="flex h-12 w-12 items-center justify-center rounded-xl border-2 border-[var(--border)] bg-[var(--background)] text-xl font-semibold text-[var(--text)]"
              aria-hidden
            >
              {i < pin.length ? "•" : ""}
            </div>
          ))}
        </div>

        {/* Custom keypad */}
        <div className="grid grid-cols-3 gap-3">
          {KEYPAD_KEYS.flat().map((key, i) => {
            if (key === "") return <div key={`keypad-empty-${i}`} />;
            if (key === "backspace") {
              return (
                <button
                  key="backspace"
                  type="button"
                  onClick={() => handleKey("backspace")}
                  className="flex h-14 items-center justify-center rounded-xl border-2 border-[var(--border)] bg-[var(--background)] text-[var(--textSecondary)] transition hover:bg-[var(--text)]/10 hover:text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--border)]"
                  aria-label="Delete"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 6h18" />
                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                    <line x1="10" x2="10" y1="11" y2="17" />
                    <line x1="14" x2="14" y1="11" y2="17" />
                  </svg>
                </button>
              );
            }
            return (
              <button
                key={key}
                type="button"
                onClick={() => handleKey(key)}
                className="flex h-14 items-center justify-center rounded-xl border-2 border-[var(--border)] bg-[var(--background)] text-xl font-semibold text-[var(--text)] transition hover:border-[var(--tint)]/50 hover:bg-[var(--tint)]/5 focus:outline-none focus:ring-2 focus:ring-[var(--border)]"
              >
                {key}
              </button>
            );
          })}
        </div>

        <div className="flex justify-center">
          <Button
            type="button"
            variant="primary"
            onClick={handleConfirm}
            disabled={pin.length !== PIN_LENGTH}
          >
            Confirm
          </Button>
        </div>
      </div>
    </Modal>
  );
}
