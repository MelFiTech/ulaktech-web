"use client";

import { Modal } from "@/components/ui/Modal";

interface MoreModalProps {
  open: boolean;
  onClose: () => void;
  onElectricityClick?: () => void;
  onTvClick?: () => void;
  onBettingClick?: () => void;
}

const OPTIONS = [
  {
    id: "electricity",
    label: "Electricity",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    ),
    color: "#F59E0B",
    comingSoon: false,
  },
  {
    id: "tv",
    label: "TV",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
        <path d="M16 21 12 17 8 21" />
        <path d="M12 17v4" />
      </svg>
    ),
    color: "#8B5CF6",
    comingSoon: false,
  },
  {
    id: "betting",
    label: "Betting",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
        <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
        <path d="M4 22h16" />
        <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20 7 22" />
        <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20 17 22" />
        <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
      </svg>
    ),
    color: "#10B981",
    comingSoon: false,
  },
  {
    id: "exam-pin",
    label: "Exam PIN",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
      </svg>
    ),
    color: "#7D53F7",
    comingSoon: true,
  },
] as const;

export function MoreModal({
  open,
  onClose,
  onElectricityClick,
  onTvClick,
  onBettingClick,
}: MoreModalProps) {
  const handleSelect = (id: string, comingSoon: boolean) => {
    if (comingSoon) return;
    onClose();
    if (id === "electricity" && onElectricityClick) onElectricityClick();
    else if (id === "tv" && onTvClick) onTvClick();
    else if (id === "betting" && onBettingClick) onBettingClick();
  };

  return (
    <Modal open={open} onClose={onClose} title="More">
      <div className="space-y-2">
        {OPTIONS.map(({ id, label, icon, color, comingSoon }) => (
          <button
            key={id}
            type="button"
            onClick={() => handleSelect(id, comingSoon)}
            disabled={comingSoon}
            className="relative flex w-full items-center gap-4 rounded-xl bg-[var(--background)] px-4 py-4 text-left transition focus:outline-none focus:ring-2 focus:ring-[var(--border)] disabled:cursor-not-allowed disabled:opacity-60 hover:bg-[var(--text)]/5 disabled:hover:bg-[var(--background)]"
          >
            <span
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--surface)]"
              style={{ color }}
            >
              {icon}
            </span>
            <span className="flex-1 font-medium text-[var(--text)]">
              {label}
            </span>
            {comingSoon && (
              <span className="rounded-full bg-[var(--textSecondary)]/20 px-3 py-1 text-xs font-medium text-[var(--textSecondary)]">
                Coming soon
              </span>
            )}
          </button>
        ))}
      </div>
    </Modal>
  );
}
