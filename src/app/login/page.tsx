"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { STORAGE_KEYS } from "@/lib/profileStorage";
import { login as apiLogin } from "@/lib/api/auth";

const PASSCODE_LENGTH = 6;

function syncUserToStorage(user: { email: string; phone: string; name: string | null }) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.USER_EMAIL, user.email);
  localStorage.setItem(STORAGE_KEYS.USER_NAME, user.name ?? user.email.split("@")[0] ?? "User");
  localStorage.setItem(STORAGE_KEYS.USER_PHONE, user.phone);
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [passcode, setPasscode] = useState("");
  const [showPasscode, setShowPasscode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const result = await apiLogin({ email: email.trim(), passcode });
      syncUserToStorage(result.user);
      if (result.user.hasSetPin !== true) {
        if (typeof sessionStorage !== "undefined" && result.accessToken) {
          sessionStorage.setItem(STORAGE_KEYS.PIN_SET_TOKEN, result.accessToken);
        }
        router.push("/onboarding/set-pin");
        return;
      }
      if (result.user.verified !== true && result.user.verificationStepRequired) {
        if (typeof sessionStorage !== "undefined") {
          sessionStorage.setItem(STORAGE_KEYS.SHOW_VERIFICATION_MODAL, "true");
        }
      }
      router.push("/dashboard");
    } catch (err) {
      toast("Something went wrong. Try again later.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout tagline="Simplify bill payments. All your needs, one platform.">
      <div className="w-full max-w-[420px]">
        <div className="rounded-2xl border border-[#171717]/10 bg-white p-8 shadow-lg shadow-[#171717]/5">
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div>
              <h1 className="text-2xl font-bold text-[#171717]">Sign in</h1>
              <p className="mt-1 text-sm text-[#171717]/60">
                Enter your email and passcode to continue.
              </p>
            </div>

            <div>
              <label
                htmlFor="login-email"
                className="mb-1.5 block text-sm font-medium text-[#171717]"
              >
                Email
              </label>
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full rounded-xl border border-[#171717]/20 bg-[#F5F5F5] px-4 py-3 text-[#171717] placeholder:text-[#171717]/50 focus:border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--border)]"
              />
            </div>

            <div>
              <label
                htmlFor="login-passcode"
                className="mb-1.5 block text-sm font-medium text-[#171717]"
              >
                Passcode
              </label>
              <div className="relative">
                <input
                  id="login-passcode"
                  type={showPasscode ? "text" : "password"}
                  inputMode="numeric"
                  value={passcode}
                  onChange={(e) =>
                    setPasscode(e.target.value.replace(/\D/g, "").slice(0, PASSCODE_LENGTH))
                  }
                  placeholder="6 digits"
                  required
                  minLength={PASSCODE_LENGTH}
                  maxLength={PASSCODE_LENGTH}
                  className="w-full rounded-xl border border-[#171717]/20 bg-[#F5F5F5] px-4 py-3 pr-20 text-[#171717] placeholder:text-[#171717]/50 focus:border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--border)]"
                />
                <button
                  type="button"
                  onClick={() => setShowPasscode((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-[#DC5746] hover:underline focus:outline-none focus:ring-2 focus:ring-[var(--border)] focus:ring-inset focus:ring-offset-0 rounded"
                  aria-label={showPasscode ? "Hide passcode" : "Show passcode"}
                >
                  {showPasscode ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              fullWidth
              loading={isSubmitting}
            >
              {isSubmitting ? "Signing in..." : "Continue"}
            </Button>
          </form>
        </div>

        <p className="mt-8 text-center text-sm text-[#171717]/70">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="font-semibold text-[#DC5746] hover:underline"
          >
            Create account
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
