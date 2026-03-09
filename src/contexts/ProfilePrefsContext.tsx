"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  getBalanceVisible,
  setBalanceVisible as persistBalanceVisible,
  getNotificationsEnabled,
  setNotificationsEnabled as persistNotifications,
  getBiometricEnabled,
  setBiometricEnabled as persistBiometric,
} from "@/lib/profileStorage";

interface ProfilePrefsContextValue {
  balanceVisible: boolean;
  setBalanceVisible: (v: boolean) => void;
  notificationsEnabled: boolean;
  setNotificationsEnabled: (v: boolean) => void;
  biometricEnabled: boolean;
  setBiometricEnabled: (v: boolean) => void;
  mounted: boolean;
}

const ProfilePrefsContext = createContext<ProfilePrefsContextValue | null>(null);

export function ProfilePrefsProvider({ children }: { children: React.ReactNode }) {
  const [balanceVisible, setBalanceVisibleState] = useState(true);
  const [notificationsEnabled, setNotificationsEnabledState] = useState(true);
  const [biometricEnabled, setBiometricEnabledState] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setBalanceVisibleState(getBalanceVisible());
    setNotificationsEnabledState(getNotificationsEnabled());
    setBiometricEnabledState(getBiometricEnabled());
    setMounted(true);
  }, []);

  const setBalanceVisible = useCallback((v: boolean) => {
    setBalanceVisibleState(v);
    persistBalanceVisible(v);
  }, []);

  const setNotificationsEnabled = useCallback((v: boolean) => {
    setNotificationsEnabledState(v);
    persistNotifications(v);
  }, []);

  const setBiometricEnabled = useCallback((v: boolean) => {
    setBiometricEnabledState(v);
    persistBiometric(v);
  }, []);

  const value: ProfilePrefsContextValue = {
    balanceVisible: mounted ? balanceVisible : true,
    setBalanceVisible,
    notificationsEnabled: mounted ? notificationsEnabled : true,
    setNotificationsEnabled,
    biometricEnabled: mounted ? biometricEnabled : false,
    setBiometricEnabled,
    mounted,
  };

  return (
    <ProfilePrefsContext.Provider value={value}>
      {children}
    </ProfilePrefsContext.Provider>
  );
}

export function useProfilePrefs() {
  const ctx = useContext(ProfilePrefsContext);
  if (!ctx) {
    return {
      balanceVisible: true,
      setBalanceVisible: () => {},
      notificationsEnabled: true,
      setNotificationsEnabled: () => {},
      biometricEnabled: false,
      setBiometricEnabled: () => {},
      mounted: false,
    };
  }
  return ctx;
}
