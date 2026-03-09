"use client";

import { useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTheme } from "@/contexts/ThemeContext";
import { useDashboardUser } from "@/contexts/DashboardUserContext";
import { useProfilePrefs } from "@/contexts/ProfilePrefsContext";
import { useToast } from "@/components/ui/Toast";
import { clearSessionStorage } from "@/lib/profileStorage";
import { logout as apiLogout } from "@/lib/api/auth";

const TALK_TO_US_URL = "https://wa.me/2347059957131?text=";
const DEFAULT_MESSAGE = "Hello%2C%20I%20need%20help%20with%20my%20Ulaktech%20account.";

function Section({
  title,
  children,
}: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 sm:p-6">
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-[var(--textSecondary)]">
        {title}
      </h2>
      <div className="space-y-0">{children}</div>
    </section>
  );
}

function RowLink({
  href,
  label,
  showArrow = true,
}: { href: string; label: string; showArrow?: boolean }) {
  return (
    <Link
      href={href}
      className="flex items-center justify-between py-3 text-[var(--text)] transition hover:opacity-80"
    >
      <span className="font-medium">{label}</span>
      {showArrow && (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m9 18 6-6-6-6" />
        </svg>
      )}
    </Link>
  );
}

function ToggleRow({
  label,
  checked,
  onChange,
}: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between py-3">
      <span className="font-medium text-[var(--text)]">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-7 w-12 shrink-0 rounded-full transition ${
          checked ? "bg-[var(--tint)]" : "bg-[var(--border)]"
        }`}
      >
        <span
          className={`absolute top-1 left-1 h-5 w-5 rounded-full bg-white shadow transition ${
            checked ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}

export function ProfileScreenContent() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user, setUser } = useDashboardUser();
  const { theme, toggleTheme } = useTheme();
  const {
    balanceVisible,
    setBalanceVisible,
    notificationsEnabled,
    setNotificationsEnabled,
    biometricEnabled,
    setBiometricEnabled,
  } = useProfilePrefs();
  const { toast } = useToast();

  const handleAvatarClick = () => fileInputRef.current?.click();

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast("Please select an image file.", "error");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setUser({ avatarUrl: dataUrl });
      toast("Photo updated.", "success");
    };
    reader.onerror = () => toast("Failed to load image.", "error");
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleTalkToUs = () => {
    try {
      const url = TALK_TO_US_URL + DEFAULT_MESSAGE;
      const opened = window.open(url, "_blank", "noopener,noreferrer");
      if (!opened) toast("Could not open WhatsApp. Please try again.", "error");
    } catch {
      toast("Could not open WhatsApp. Please try again.", "error");
    }
  };

  const handleLogOut = async () => {
    try {
      await apiLogout();
    } catch {
      // Proceed to clear local state even if API fails
    }
    clearSessionStorage();
    router.replace("/login");
  };

  const displayName = user.userName || "User";
  const displayEmail = user.email || "—";

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      {/* User block */}
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:flex-row sm:items-center sm:gap-6">
        <button
          type="button"
          onClick={handleAvatarClick}
          className="relative shrink-0 rounded-full focus:outline-none"
          aria-label="Change profile photo"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
            onChange={handleAvatarChange}
            aria-hidden
          />
          <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-[var(--tint)]/20 text-2xl font-bold text-[var(--tint)]">
            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt=""
                className="h-full w-full object-cover"
              />
            ) : (
              (displayName.slice(0, 2) || "U").toUpperCase()
            )}
          </div>
          <span className="absolute bottom-0 right-0 flex h-6 w-6 items-center justify-center rounded-full border-2 border-[var(--surface)] bg-[var(--tint)] text-white">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" x2="12" y1="3" y2="15" />
            </svg>
          </span>
        </button>
        <div className="min-w-0 text-center sm:text-left">
          <p className="truncate text-lg font-semibold text-[var(--text)]">
            {displayName}
          </p>
          <p className="truncate text-sm text-[var(--textSecondary)]">
            {displayEmail}
          </p>
        </div>
      </div>

      {/* Account */}
      <Section title="Account">
        <RowLink href="/dashboard/profile/edit-profile" label="Edit Profile" />
        <div className="border-t border-[var(--border)]">
          <RowLink href="/dashboard/profile/referrals" label="Referrals" />
        </div>
        <div className="border-t border-[var(--border)]">
          <RowLink href="/dashboard/profile/tiers-verification" label="Tiers & Verification" />
        </div>
      </Section>

      {/* Preferences */}
      <Section title="Preferences">
        <ToggleRow
          label="Theme (light / dark)"
          checked={theme === "dark"}
          onChange={() => toggleTheme()}
        />
        <div className="border-t border-[var(--border)]">
          <ToggleRow
            label="Show balance"
            checked={balanceVisible}
            onChange={setBalanceVisible}
          />
        </div>
        <div className="border-t border-[var(--border)]">
          <ToggleRow
            label="Notifications"
            checked={notificationsEnabled}
            onChange={setNotificationsEnabled}
          />
        </div>
      </Section>

      {/* Account Security */}
      <Section title="Account Security">
        <RowLink href="/dashboard/profile/manage-pin" label="Manage PIN" />
        <div className="border-t border-[var(--border)]">
          <RowLink href="/dashboard/profile/manage-passcode" label="Manage Passcode" />
        </div>
        <div className="border-t border-[var(--border)]">
          <ToggleRow
            label="Biometric (Face ID / Touch ID)"
            checked={biometricEnabled}
            onChange={setBiometricEnabled}
          />
        </div>
      </Section>

      {/* More */}
      <Section title="More">
        <div className="py-3 font-medium text-[var(--textSecondary)]">
          Help & FAQ
        </div>
        <div className="border-t border-[var(--border)]">
          <button
            type="button"
            onClick={handleTalkToUs}
            className="flex w-full items-center justify-between py-3 text-left font-medium text-[var(--text)] transition hover:opacity-80"
          >
            Talk to Us
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
        </div>
        <div className="border-t border-[var(--border)]">
          <button
            type="button"
            onClick={handleLogOut}
            className="flex w-full items-center justify-between py-3 text-left font-medium text-[var(--tint)] transition hover:opacity-80"
          >
            Log Out
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
        </div>
        <div className="border-t border-[var(--border)]">
          <button
            type="button"
            className="flex w-full items-center justify-between py-3 text-left font-medium text-[var(--error)] opacity-70"
            disabled
            title="Not implemented"
          >
            Close account
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
        </div>
      </Section>
    </div>
  );
}
