/** Format ISO date for list: "Mar 03, 2026 18:58" */
export function formatTransactionDateList(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleString("en-NG", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

/** Format for detail: { date: "Today" | "Mar 03, 2026", time: "10:30 AM" } */
export function formatTransactionDateDetail(iso: string): { date: string; time: string } {
  try {
    const d = new Date(iso);
    const now = new Date();
    const isToday = d.toDateString() === now.toDateString();
    const date = isToday
      ? "Today"
      : d.toLocaleDateString("en-NG", {
          day: "numeric",
          month: "short",
          year: d.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
        });
    const time = d.toLocaleTimeString("en-NG", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
    return { date, time };
  } catch {
    return { date: "Today", time: "12:00 PM" };
  }
}
