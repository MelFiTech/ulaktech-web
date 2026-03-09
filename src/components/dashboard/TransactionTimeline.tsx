"use client";

export type TimelineStatus = "initiated" | "pending" | "paid" | "completed";

export interface TransactionTimelineItem {
  status: TimelineStatus;
  icon: "arrow-up" | "time" | "checkmark";
  title: string;
  date: string;
  description: string;
}

const STATUS_STYLES: Record<TimelineStatus, { bg: string; icon: string }> = {
  initiated: { bg: "bg-[var(--tint)]", icon: "text-white" },
  pending: { bg: "bg-[var(--warning)]", icon: "text-white" },
  paid: { bg: "bg-[var(--warning)]", icon: "text-white" },
  completed: { bg: "bg-[var(--success)]", icon: "text-white" },
};

const ICON_SVG: Record<string, React.ReactNode> = {
  "arrow-up": (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m5 12 7-7 7 7" /><path d="M12 19V5" />
    </svg>
  ),
  time: (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
    </svg>
  ),
  checkmark: (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  ),
};

interface TransactionTimelineProps {
  items: TransactionTimelineItem[];
}

export function TransactionTimeline({ items }: TransactionTimelineProps) {
  return (
    <div className="mb-8">
      {items.map((item, index) => {
        const style = STATUS_STYLES[item.status];
        const iconSvg = ICON_SVG[item.icon] ?? ICON_SVG.checkmark;
        const isLast = index === items.length - 1;
        const lineColor = !isLast ? style.bg : undefined;
        return (
          <div key={`${item.status}-${index}`} className="mb-2">
            <div className="flex items-start gap-3">
              <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${style.bg} ${style.icon}`}>
                {iconSvg}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-[var(--text)]">
                  {item.title} {item.date}
                </p>
                <p className="mt-0.5 text-xs text-[var(--textSecondary)]">
                  {item.description}
                </p>
              </div>
            </div>
            {lineColor != null && (
              <div className={`ml-[15px] mt-1 h-6 w-0.5 ${lineColor}`} aria-hidden />
            )}
          </div>
        );
      })}
    </div>
  );
}
