"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ProfileSubPageHeader } from "@/components/dashboard/profile/ProfileSubPageHeader";
import { Button } from "@/components/ui/Button";
import { useDashboardUser } from "@/contexts/DashboardUserContext";
import { useToast } from "@/components/ui/Toast";
import { STORAGE_KEYS } from "@/lib/profileStorage";
import { getMe } from "@/lib/api/auth";
import { getWallet, setWalletUsername } from "@/lib/api/wallet";

/** Backend: 3–30 chars, alphanumeric with dots or underscores only. */
const USERNAME_REGEX = /^[a-zA-Z0-9._]{3,30}$/;

function validateUsername(value: string): string | null {
  const t = value.trim();
  if (!t) return null;
  if (t.length < 3) return "Username must be at least 3 characters.";
  if (t.length > 30) return "Username must be at most 30 characters.";
  if (!USERNAME_REGEX.test(t)) return "Use only letters, numbers, dots and underscores.";
  return null;
}

export default function EditProfilePage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user, setUser } = useDashboardUser();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [username, setUsername] = useState("");
  const [verified, setVerified] = useState(false);
  const [initialUsername, setInitialUsername] = useState("");

  const loadProfile = useCallback(async () => {
    try {
      const me = await getMe();
      const name = (me.name ?? "").trim() || "User";
      setDisplayName(name);
      setEmail(me.email ?? "");
      setPhone(me.phone ?? "");
      setVerified(me.verified === true);
      setUser({ userName: name, email: me.email ?? "" });
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEYS.USER_NAME, name);
        localStorage.setItem(STORAGE_KEYS.USER_EMAIL, me.email ?? "");
        localStorage.setItem(STORAGE_KEYS.USER_PHONE, me.phone ?? "");
      }
      if (me.verified) {
        try {
          const wallet = await getWallet();
          const u = (wallet.username ?? "").trim();
          setUsername(u);
          setInitialUsername(u);
          if (typeof window !== "undefined") localStorage.setItem(STORAGE_KEYS.USER_USERNAME, u);
        } catch {
          setUsername("");
          setInitialUsername("");
        }
      } else {
        setUsername("");
        setInitialUsername("");
      }
    } catch {
      const fallbackName = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEYS.USER_NAME) : null;
      const fallbackEmail = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEYS.USER_EMAIL) : null;
      const fallbackPhone = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEYS.USER_PHONE) : null;
      const fallbackUsername = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEYS.USER_USERNAME) : null;
      setDisplayName(fallbackName ?? user.userName ?? "User");
      setEmail(fallbackEmail ?? user.email ?? "");
      setPhone(fallbackPhone ?? "");
      setUsername(fallbackUsername ?? "");
      setInitialUsername(fallbackUsername ?? "");
    } finally {
      setLoading(false);
    }
  }, [setUser, user.userName, user.email]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

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
      setUser({ avatarUrl: reader.result as string });
      toast("Photo updated.", "success");
    };
    reader.onerror = () => toast("Failed to load image.", "error");
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedUsername = username.trim();

    if (verified && trimmedUsername !== initialUsername) {
      const err = validateUsername(trimmedUsername);
      if (err) {
        toast(err, "error");
        return;
      }
      setSaving(true);
      try {
        await setWalletUsername(trimmedUsername);
        setInitialUsername(trimmedUsername);
        if (typeof window !== "undefined") localStorage.setItem(STORAGE_KEYS.USER_USERNAME, trimmedUsername);
        toast("Profile saved.", "success");
        router.push("/dashboard/profile");
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Could not update username. Try again.";
        toast(message, "error");
      } finally {
        setSaving(false);
      }
    } else {
      if (typeof window !== "undefined") localStorage.setItem(STORAGE_KEYS.USER_PHONE, phone);
      toast("Profile saved.", "success");
      router.push("/dashboard/profile");
    }
  };

  const displayNameVal = displayName || user.userName || "User";
  const displayEmailVal = email || user.email || "";

  if (loading) {
    return (
      <div className="mx-auto max-w-2xl space-y-8">
        <ProfileSubPageHeader title="Edit Profile" />
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 text-center text-[var(--textSecondary)]">
          Loading…
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <ProfileSubPageHeader title="Edit Profile" />

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
            <button
              type="button"
              onClick={handleAvatarClick}
              className="relative shrink-0 rounded-full focus:outline-none"
              aria-label="Change photo"
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
                  <img src={user.avatarUrl} alt="" className="h-full w-full object-cover" />
                ) : (
                  (displayNameVal.slice(0, 2) || "U").toUpperCase()
                )}
              </div>
            </button>
            <div className="min-w-0 flex-1 space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[var(--textSecondary)]">Name</label>
                <input
                  type="text"
                  value={displayNameVal}
                  disabled
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-[var(--textSecondary)]"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[var(--textSecondary)]">Email</label>
                <input
                  type="email"
                  value={displayEmailVal}
                  disabled
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-[var(--textSecondary)]"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 space-y-4">
          <div>
            <label htmlFor="edit-phone" className="mb-1.5 block text-sm font-medium text-[var(--textSecondary)]">Phone</label>
            <input
              id="edit-phone"
              type="tel"
              value={phone}
              disabled
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-[var(--textSecondary)]"
            />
          </div>
          <div>
            <label htmlFor="edit-username" className="mb-1.5 block text-sm font-medium text-[var(--text)]">Username</label>
            <input
              id="edit-username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={verified ? "e.g. jane_doe (3–30 chars)" : "Complete verification to set username"}
              disabled={!verified}
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-[var(--text)] disabled:opacity-60"
            />
          </div>
        </div>

        <div className="flex gap-3">
          <Button type="submit" className="flex-1" disabled={saving}>
            {saving ? "Saving…" : "Save"}
          </Button>
          <Link
            href="/dashboard/profile"
            className="inline-flex h-[54px] flex-1 items-center justify-center rounded-[68px] border-2 border-[var(--border)] bg-transparent text-base font-semibold text-[var(--text)] transition hover:bg-[var(--background)]"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
