"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { STORAGE_KEYS, setAccessToken } from "@/lib/profileStorage";
import { register as apiRegister, otpSend, otpVerify } from "@/lib/api/auth";

const STEPS = [
  { step: 1, title: "Email", field: "email" },
  { step: 2, title: "Phone number", field: "phone" },
  { step: 3, title: "Set passcode", field: "passcode" },
  { step: 4, title: "Verify email", field: "otp" },
] as const;

const PHONE_PREFIX = "+234";
const PHONE_LOCAL_LENGTH = 10;
const PASSCODE_LENGTH = 6;
const OTP_LENGTH = 6;

function sanitizePhoneInput(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (digits.length > PHONE_LOCAL_LENGTH && digits.startsWith("234")) {
    return digits.slice(3, 3 + PHONE_LOCAL_LENGTH);
  }
  return digits.slice(0, PHONE_LOCAL_LENGTH);
}

export default function RegisterPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [passcode, setPasscode] = useState("");
  const [showPasscode, setShowPasscode] = useState(false);
  const [phoneTouched, setPhoneTouched] = useState(false);
  const [otp, setOtp] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const stepConfig = STEPS[currentStep - 1];
  const isLastStep = currentStep === 4;

  const fullPhoneNumber = phone ? `${PHONE_PREFIX}${phone}` : "";

  function syncUserToStorage(user: { email: string; phone: string; name: string | null }) {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEYS.USER_EMAIL, user.email);
    localStorage.setItem(STORAGE_KEYS.USER_NAME, user.name ?? user.email.split("@")[0] ?? "User");
    localStorage.setItem(STORAGE_KEYS.USER_PHONE, user.phone);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep === 3) {
      setIsSubmitting(true);
      try {
        await apiRegister({
          email: email.trim(),
          phone: fullPhoneNumber,
          passcode,
          displayName: email.trim().split("@")[0] || undefined,
        });
        setCurrentStep(4);
      } catch (err) {
        toast("Something went wrong. Try again later.", "error");
      } finally {
        setIsSubmitting(false);
      }
      return;
    }
    if (isLastStep) {
      setIsSubmitting(true);
      try {
        const result = await otpVerify({ email: email.trim(), otp });
        syncUserToStorage(result.user);
        if (result.user.hasSetPin !== true) {
          if (typeof sessionStorage !== "undefined" && result.accessToken) {
            sessionStorage.setItem(STORAGE_KEYS.PIN_SET_TOKEN, result.accessToken);
            setAccessToken(result.accessToken);
            router.push("/onboarding/set-pin");
          } else {
            toast("Something went wrong. Please try again or sign in.", "error");
          }
          return;
        }
        if (result.user.verified !== true && result.user.verificationStepRequired) {
          if (typeof sessionStorage !== "undefined") {
            sessionStorage.setItem(STORAGE_KEYS.SHOW_VERIFICATION_MODAL, "true");
          }
        }
        if (typeof sessionStorage !== "undefined" && result.accessToken) {
          setAccessToken(result.accessToken);
        }
        router.push("/dashboard");
      } catch (err) {
        toast("Something went wrong. Try again later.", "error");
      } finally {
        setIsSubmitting(false);
      }
      return;
    }
    setCurrentStep((s) => s + 1);
  };

  const canProceed = () => {
    if (currentStep === 1) return email.trim().length > 0;
    if (currentStep === 2) return phone.length === PHONE_LOCAL_LENGTH;
    if (currentStep === 3) return passcode.length === PASSCODE_LENGTH;
    return otp.length === OTP_LENGTH;
  };

  const handleResendOtp = async () => {
    if (resendCooldown > 0) return;
    try {
      await otpSend({ email: email.trim(), purpose: "signup" });
      setResendCooldown(60);
      const interval = setInterval(() => {
        setResendCooldown((s) => {
          if (s <= 1) {
            clearInterval(interval);
            return 0;
          }
          return s - 1;
        });
      }, 1000);
    } catch (err) {
      toast("Something went wrong. Try again later.", "error");
    }
  };

  return (
    <AuthLayout tagline="Create your account. Pay bills, buy data, stay connected.">
      <div className="w-full max-w-[420px]">
        <div className="rounded-2xl border border-[#171717]/10 bg-white p-8 shadow-lg shadow-[#171717]/5">
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-[#171717]/50">
                Step {currentStep} of 4
              </p>
              <p className="mt-0.5 text-lg font-semibold text-[#171717]">
                {stepConfig.title}
              </p>
              <div className="mt-3 flex gap-1.5" aria-hidden>
                {[1, 2, 3, 4].map((i) => (
                  <span
                    key={i}
                    className={`h-1.5 flex-1 rounded-full ${
                      i <= currentStep ? "bg-[#DC5746]" : "bg-[#171717]/15"
                    }`}
                  />
                ))}
              </div>
            </div>

            {currentStep === 1 && (
              <>
                <p className="text-base font-semibold text-[#171717]">
                  What&apos;s your email address?
                </p>
                <div>
                  <label
                    htmlFor="reg-email"
                    className="mb-1.5 block text-sm font-medium text-[#171717]"
                  >
                    Email
                  </label>
                  <input
                    id="reg-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="w-full rounded-xl border border-[#171717]/20 bg-[#F5F5F5] px-4 py-3 text-[#171717] placeholder:text-[#171717]/50 focus:border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--border)]"
                  />
                </div>
              </>
            )}

            {currentStep === 2 && (
              <>
                <p className="text-base font-semibold text-[#171717]">
                  What&apos;s your phone number?
                </p>
                <div>
                  <label
                    htmlFor="reg-phone"
                    className="mb-1.5 block text-sm font-medium text-[#171717]"
                  >
                    Phone number
                  </label>
                  <div className="flex rounded-xl border border-[#171717]/20 bg-[#F5F5F5] overflow-hidden focus-within:ring-2 focus-within:ring-[var(--border)] focus-within:border-[var(--border)]">
                    <span className="flex items-center pl-4 text-[#171717]/70 font-medium select-none">
                      {PHONE_PREFIX}
                    </span>
                    <input
                      id="reg-phone"
                      type="tel"
                      inputMode="numeric"
                      autoComplete="tel-national"
                      value={phone}
                      onChange={(e) => setPhone(sanitizePhoneInput(e.target.value))}
                      onBlur={() => setPhoneTouched(true)}
                      placeholder="8012345678"
                      maxLength={PHONE_LOCAL_LENGTH}
                      className="w-full min-w-0 border-0 bg-transparent px-3 py-3 text-[#171717] placeholder:text-[#171717]/50 focus:outline-none focus:ring-0"
                    />
                  </div>
                  {phoneTouched && phone.length > 0 && phone.length !== PHONE_LOCAL_LENGTH && (
                    <p className="mt-1.5 text-sm text-[#DC5746]">
                      Enter a valid 10-digit Nigerian number.
                    </p>
                  )}
                </div>
              </>
            )}

            {currentStep === 3 && (
              <>
                <p className="text-base font-semibold text-[#171717]">
                  Create a passcode to secure your account.
                </p>
                <div>
                  <label
                    htmlFor="reg-passcode"
                    className="mb-1.5 block text-sm font-medium text-[#171717]"
                  >
                    Passcode
                  </label>
                  <div className="relative">
                    <input
                      id="reg-passcode"
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
                <div className="flex gap-3 rounded-xl border border-[#171717]/10 bg-[#F5F5F5]/80 p-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#DC5746] text-sm font-bold text-white">
                    i
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-[#171717]">
                      Keep it secure
                    </p>
                    <p className="mt-0.5 text-sm text-[#171717]/70">
                      Exactly 6 digits. Don&apos;t share your passcode with anyone.
                    </p>
                  </div>
                </div>
              </>
            )}

            {currentStep === 4 && (
              <>
                <p className="text-base font-semibold text-[#171717]">
                  Enter the 6-digit code we sent to your email
                </p>
                <div className="rounded-xl border-2 border-[#DC5746]/40 bg-[#DC5746]/10 px-4 py-3">
                  <p className="text-xs font-medium uppercase tracking-wider text-[#171717]/60">
                    Verifying
                  </p>
                  <p className="mt-0.5 font-semibold text-[#171717]">{email}</p>
                </div>
                <div>
                  <label
                    htmlFor="reg-otp"
                    className="mb-1.5 block text-sm font-medium text-[#171717]"
                  >
                    Verification code
                  </label>
                  <input
                    id="reg-otp"
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    value={otp}
                    onChange={(e) =>
                      setOtp(e.target.value.replace(/\D/g, "").slice(0, OTP_LENGTH))
                    }
                    placeholder="000000"
                    maxLength={OTP_LENGTH}
                    className="w-full rounded-xl border border-[#171717]/20 bg-[#F5F5F5] px-4 py-3 text-center text-lg tracking-[0.4em] text-[#171717] placeholder:text-[#171717]/40 focus:border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--border)]"
                  />
                </div>
                <p className="text-center text-sm text-[#171717]/70">
                  Didn&apos;t receive the code?{" "}
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={resendCooldown > 0}
                    className="font-semibold text-[#DC5746] hover:underline disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {resendCooldown > 0
                      ? `Resend in ${resendCooldown}s`
                      : "Resend code"}
                  </button>
                </p>
              </>
            )}

            <Button
              type="submit"
              variant="primary"
              fullWidth
              disabled={!canProceed()}
              loading={isSubmitting}
              className="disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting
                ? "Creating account..."
                : isLastStep
                  ? "Verify & create account"
                  : "Continue"}
            </Button>
          </form>
        </div>

        <p className="mt-8 text-center text-sm text-[#171717]/70">
          Got an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-[#DC5746] hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
