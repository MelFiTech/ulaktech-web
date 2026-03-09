"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getMe } from "@/lib/api/auth";

interface DashboardAuthGuardProps {
  children: React.ReactNode;
}

export function DashboardAuthGuard({ children }: DashboardAuthGuardProps) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const user = await getMe();
        if (cancelled) return;
        if (user.hasSetPin !== true) {
          router.replace("/login");
          return;
        }
      } catch {
        if (!cancelled) router.replace("/login");
        return;
      }
      if (!cancelled) setReady(true);
    })();
    return () => {
      cancelled = true;
    };
  }, [router]);

  if (!ready) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-[var(--textSecondary)]">Loading…</p>
      </div>
    );
  }

  return <>{children}</>;
}
