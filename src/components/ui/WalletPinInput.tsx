"use client";

import { useState, useRef, useCallback } from "react";

const PIN_LENGTH = 4;

interface WalletPinInputProps {
  value: string;
  onChange: (pin: string) => void;
  label?: string;
  error?: string;
  disabled?: boolean;
}

export function WalletPinInput({
  value,
  onChange,
  label = "Wallet PIN",
  error,
  disabled,
}: WalletPinInputProps) {
  const [showPin, setShowPin] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const next = e.target.value.replace(/\D/g, "").slice(0, PIN_LENGTH);
      onChange(next);
    },
    [onChange]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Backspace" && value.length > 0 && !(e.target as HTMLInputElement).selectionStart) {
        onChange(value.slice(0, -1));
      }
    },
    [value, onChange]
  );

  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-[var(--text)]">
        {label}
      </label>
      <div className="flex gap-2">
        <input
          ref={inputRef}
          type={showPin ? "text" : "password"}
          inputMode="numeric"
          autoComplete="off"
          maxLength={PIN_LENGTH}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-center text-lg tracking-[0.5em] text-[var(--text)] placeholder:text-[var(--textSecondary)]/50 focus:border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--border)] disabled:opacity-50"
          placeholder="••••"
          aria-label={label}
        />
        <button
          type="button"
          onClick={() => setShowPin((s) => !s)}
          className="shrink-0 rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm font-medium text-[var(--textSecondary)] transition hover:text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--border)]"
          aria-label={showPin ? "Hide PIN" : "Show PIN"}
        >
          {showPin ? "Hide" : "Show"}
        </button>
      </div>
      {error && (
        <p className="mt-1.5 text-sm text-[var(--error)]">{error}</p>
      )}
    </div>
  );
}
