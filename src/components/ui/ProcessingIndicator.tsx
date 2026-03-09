"use client";

interface ProcessingIndicatorProps {
  message?: string;
}

export function ProcessingIndicator({
  message = "Confirming...",
}: ProcessingIndicatorProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-8" role="status" aria-live="polite">
      <div
        className="h-10 w-10 animate-spin rounded-full border-2 border-[var(--border)] border-t-[var(--tint)]"
        aria-hidden
      />
      <p className="text-sm font-medium text-[var(--textSecondary)]">{message}</p>
    </div>
  );
}
