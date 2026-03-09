"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { STORAGE_KEYS, getStoredAvatarUri, setStoredAvatarUri } from "@/lib/profileStorage";

interface DashboardUser {
  userName: string;
  email?: string | null;
  avatarUrl?: string | null;
}

interface DashboardUserContextValue {
  user: DashboardUser;
  setUser: (user: Partial<DashboardUser>) => void;
}

const defaultUser: DashboardUser = {
  userName: "User",
  email: null,
  avatarUrl: null,
};

const DashboardUserContext = createContext<DashboardUserContextValue | null>(null);

export function DashboardUserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = useState<DashboardUser>(defaultUser);

  useEffect(() => {
    const avatar = getStoredAvatarUri();
    const name = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEYS.USER_NAME) : null;
    const email = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEYS.USER_EMAIL) : null;
    setUserState((prev) => ({
      ...prev,
      ...(avatar && { avatarUrl: avatar }),
      ...(name && { userName: name }),
      ...(email && { email }),
    }));
  }, []);

  const setUser = useCallback((next: Partial<DashboardUser>) => {
    setUserState((prev) => {
      const nextState = { ...prev, ...next };
      if (typeof window !== "undefined") {
        if (next.avatarUrl !== undefined) {
          setStoredAvatarUri(next.avatarUrl ?? null);
        }
        if (next.userName !== undefined) localStorage.setItem(STORAGE_KEYS.USER_NAME, nextState.userName ?? "");
        if (next.email !== undefined) localStorage.setItem(STORAGE_KEYS.USER_EMAIL, nextState.email ?? "");
      }
      return nextState;
    });
  }, []);

  return (
    <DashboardUserContext.Provider value={{ user, setUser }}>
      {children}
    </DashboardUserContext.Provider>
  );
}

export function useDashboardUser() {
  const ctx = useContext(DashboardUserContext);
  if (!ctx) {
    return {
      user: defaultUser,
      setUser: () => {},
    };
  }
  return ctx;
}
